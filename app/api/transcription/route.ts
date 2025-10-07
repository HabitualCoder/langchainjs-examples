import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.3
});

export async function POST(request: NextRequest) {
  try {
    const { transcript, analysisType } = await request.json();
    
    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    let prompt = '';
    
    switch (analysisType) {
      case 'summary':
        prompt = `Analyze this audio transcript and provide:
        1. A summary of the conversation
        2. Key topics discussed
        3. Speaker identification and their roles
        4. Important quotes or statements

        Transcript: ${transcript}`;
        break;
        
      case 'action_items':
        prompt = `Extract action items from this meeting transcript:
        - Who is responsible for what
        - Deadlines mentioned
        - Follow-up tasks required

        Meeting transcript: ${transcript}`;
        break;
        
      case 'improve':
        prompt = `Clean up and improve this transcript while maintaining the original meaning:
        "${transcript}"`;
        break;
        
      default:
        prompt = `Analyze this transcript: ${transcript}`;
    }

    const response = await model.invoke(prompt);
    
    return NextResponse.json({ 
      success: true, 
      content: response.content 
    });
    
  } catch (error) {
    console.error('Transcript processing error:', error);
    return NextResponse.json({ 
      error: 'Failed to process transcript' 
    }, { status: 500 });
  }
}
