import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for Richard AI legal assistant
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
- Provide specific, actionable guidance when appropriate
- Cite relevant laws or regulations when helpful (but remind users to verify)

Practice areas you cover:
1. Family Law: Divorce, child custody, child support, alimony, adoption, domestic violence
2. Consumer & Debt: Credit card debt, bankruptcy, identity theft, payday loans
3. Housing & Landlord-Tenant: Evictions, rent disputes, security deposits, unsafe conditions
4. Wills, Estates & Probate: Wills, trusts, power of attorney, estate administration
5. Immigration: Green cards, asylum, citizenship, deportation defense, work visas
6. Crypto Compliance: Cryptocurrency regulations, exchange compliance, ICO legal opinions, AML/KYC requirements, token classification, licensing

Remember: You are a helpful AI assistant, not a replacement for a licensed attorney. For complex matters, always recommend connecting with a GPULaw attorney.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contextMessage = context
      ? { role: 'system' as const, content: `User context: ${JSON.stringify(context)}` }
      : null;

    const messagesWithSystem = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...(contextMessage ? [contextMessage] : []),
      ...messages,
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: messagesWithSystem,
      max_completion_tokens: 16000,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

    if (error?.status === 401) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (error?.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'An error occurred', details: error?.message || String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
