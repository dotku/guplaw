import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userMessage, assistantMessage } = await request.json();

    if (!assistantMessage) {
      return NextResponse.json({ questions: [] });
    }

    const suggestionPrompt = `Based on the following conversation, generate 5 short, relevant follow-up questions that the user might want to ask next. The questions should be contextually relevant to the conversation and help the user explore related legal topics or next steps.

Conversation:
User: ${userMessage || ''}
Assistant: ${assistantMessage}

Return ONLY a JSON array of 5 question strings, nothing else. Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates relevant follow-up questions based on legal conversations. Always return valid JSON array format.' },
        { role: 'user', content: suggestionPrompt },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const text = completion.choices[0]?.message?.content || '[]';

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return NextResponse.json({ questions: parsed.slice(0, 5) });
      }
    } catch {
      // Parse failed, return defaults
    }

    return NextResponse.json({
      questions: [
        "What are my next steps?",
        "Do I need to consult an attorney?",
        "What documents should I prepare?",
        "What is the typical timeline?",
        "What are the potential costs?",
      ],
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json({
      questions: [
        "What are my next steps?",
        "Do I need to consult an attorney?",
        "What documents should I prepare?",
        "What is the typical timeline?",
        "What are the potential costs?",
      ],
    });
  }
}
