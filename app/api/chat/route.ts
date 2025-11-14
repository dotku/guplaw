import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for Richard Law AI
const SYSTEM_PROMPT = `You are Richard Law AI, an expert legal assistant integrated into the GPULaw platform. You provide helpful, accurate legal information while maintaining important disclaimers.

Your role:
- Provide clear, actionable legal guidance across 6 practice areas: Family Law, Consumer & Debt, Housing & Landlord-Tenant, Wills/Estates/Probate, Immigration, and Traffic Cases
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
6. Traffic Cases: Parking tickets, traffic violations, DUIs

Remember: You are a helpful AI assistant, not a replacement for a licensed attorney. For complex matters, always recommend connecting with a GPULaw attorney.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Add context to the conversation if provided (e.g., from case intake form)
    const contextMessage = context
      ? {
          role: 'system' as const,
          content: `User context: ${JSON.stringify(context)}`,
        }
      : null;

    const messagesWithSystem = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...(contextMessage ? [contextMessage] : []),
      ...messages,
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    return NextResponse.json({
      response: aiResponse,
      usage: completion.usage,
    });

  } catch (error: any) {
    console.error('OpenAI API error:', error);

    // Handle specific error types
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
