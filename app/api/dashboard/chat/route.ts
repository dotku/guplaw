import OpenAI from 'openai';
import { and, asc, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/authUser';
import { db } from '@/lib/db';
import { conversations, messages } from '@/lib/schema';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are Richard AI legal assistant, an expert legal assistant integrated into the GPULaw platform. You provide helpful, accurate legal information while maintaining important disclaimers.

Your role:
- Provide clear, actionable legal guidance across 6 practice areas: Family Law, Consumer & Debt, Housing & Landlord-Tenant, Wills/Estates/Probate, Immigration, and Crypto Compliance
- Analyze legal situations and provide next steps
- Help draft legal documents and correspondence
- Explain legal concepts in plain language
- Recommend when users should escalate to a licensed attorney

Important guidelines:
- Always remind users that you provide general legal information, not legal advice
- Encourage users to consult with a licensed attorney for their specific situation
- Be empathetic and professional
- Ask clarifying questions when needed
- Cite relevant laws or regulations when helpful (but remind users to verify)

Remember: You are a helpful AI assistant, not a replacement for a licensed attorney. For complex matters, always recommend connecting with a GPULaw attorney.`;

function deriveTitle(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= 60) return trimmed || 'New conversation';
  return trimmed.slice(0, 57) + '...';
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { conversationId?: string | null; content?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const content = (body.content ?? '').trim();
  if (!content) {
    return new Response(JSON.stringify({ error: 'Content is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Resolve / create the conversation. Verify ownership when an id is provided.
  let conversationId = body.conversationId ?? null;
  if (conversationId) {
    const [existing] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, user.id),
        ),
      )
      .limit(1);
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    const [created] = await db
      .insert(conversations)
      .values({ userId: user.id, title: deriveTitle(content) })
      .returning({ id: conversations.id });
    conversationId = created.id;
  }

  // Persist the user message.
  await db.insert(messages).values({
    conversationId,
    role: 'user',
    content,
  });

  // Build the full history for the model (system + all persisted messages).
  const history = await db
    .select({ role: messages.role, content: messages.content })
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

  const chatMessages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: chatMessages,
      max_completion_tokens: 16000,
      stream: true,
    });

    const encoder = new TextEncoder();
    const finalConversationId = conversationId;

    const readable = new ReadableStream({
      async start(controller) {
        // Send the conversation id as the first SSE event so the client can
        // pin subsequent messages to the right conversation.
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ conversationId: finalConversationId })}\n\n`,
          ),
        );

        let assistantContent = '';
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`),
              );
            }
          }

          // Persist the assistant message once the stream completes.
          if (assistantContent.length > 0) {
            await db.insert(messages).values({
              conversationId: finalConversationId,
              role: 'assistant',
              content: assistantContent,
            });
            await db
              .update(conversations)
              .set({ updatedAt: new Date() })
              .where(eq(conversations.id, finalConversationId));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    console.error('Dashboard chat error:', err);
    const status =
      err?.status === 401 ? 401 : err?.status === 429 ? 429 : 500;
    return new Response(
      JSON.stringify({ error: err?.message || 'Chat failed' }),
      { status, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
