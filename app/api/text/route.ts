import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.7
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await model.invoke(prompt);
    
    return NextResponse.json({ 
      success: true, 
      content: response.content 
    });
    
  } catch (error) {
    console.error('Text generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate text' 
    }, { status: 500 });
  }
}
