import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for case analysis
const CASE_ANALYSIS_PROMPT = `You are Richard Law AI, an expert legal case analyzer for GPULaw. Your task is to analyze legal cases and provide:

1. Case Summary: Brief overview of the legal issue
2. Legal Category: Which practice area this falls under
3. Key Issues: Main legal points to address
4. Immediate Actions: What the person should do right now
5. Potential Outcomes: Possible scenarios and resolutions
6. Attorney Recommendation: Whether this requires attorney consultation (and why)
7. Relevant Documents: What documents they should gather
8. Timeline: Expected timeframes for resolution

Provide comprehensive, actionable analysis while maintaining that this is general information, not legal advice.

Practice areas: Family Law, Consumer & Debt, Housing & Landlord-Tenant, Wills/Estates/Probate, Immigration, Traffic Cases`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, category, urgency, description } = body;

    if (!description || !category) {
      return NextResponse.json(
        { error: 'Description and category are required' },
        { status: 400 }
      );
    }

    // Create analysis request
    const analysisRequest = `
Please analyze this legal case:

**Category:** ${category}
**Urgency:** ${urgency}
**Client Name:** ${name}

**Case Description:**
${description}

Provide a comprehensive legal analysis including:
1. Case summary
2. Key legal issues
3. Immediate action items
4. Potential outcomes
5. Whether attorney consultation is recommended
6. Documents to gather
7. Expected timeline

Format your response in clear sections with bullet points where appropriate.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: CASE_ANALYSIS_PROMPT },
        { role: 'user', content: analysisRequest },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const analysis = completion.choices[0]?.message?.content || 'Unable to generate analysis.';

    // Determine if attorney is needed based on urgency and complexity
    const needsAttorney = urgency === 'high' || urgency === 'critical';

    return NextResponse.json({
      analysis,
      needsAttorney,
      category,
      urgency,
      clientInfo: {
        name,
        email,
        phone,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Case analysis error:', error);

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
      { error: 'An error occurred while analyzing your case' },
      { status: 500 }
    );
  }
}
