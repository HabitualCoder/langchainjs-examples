import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.3
});

export async function POST(request: NextRequest) {
  try {
    const { text, processingType } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    let prompt = '';
    
    switch (processingType) {
      case 'speech_script':
        prompt = `Create a natural-sounding speech script for a 2-minute presentation about: ${text}. Include:
        - Engaging opening
        - 3 main points with examples
        - Call to action
        - Natural transitions between topics`;
        break;
        
      case 'speech_friendly':
        prompt = `Convert this formal text into a conversational, speech-friendly format that sounds natural when spoken aloud:
        "${text}"`;
        break;
        
      case 'speech_analysis':
        prompt = `Analyze this speech sample and provide:
        1. Filler words identified
        2. Confidence level assessment
        3. Suggestions for improvement
        4. Cleaned version

        Speech sample: "${text}"`;
        break;
        
      case 'voice_assistant':
        prompt = `Create natural, conversational responses for a voice assistant when users say: "${text}". Make responses sound human and friendly.`;
        break;
        
      default:
        prompt = `Process this text for speech: ${text}`;
    }

    const response = await model.invoke(prompt);
    
    return NextResponse.json({ 
      success: true, 
      content: response.content 
    });
    
  } catch (error) {
    console.error('Speech processing error:', error);
    return NextResponse.json({ 
      error: 'Failed to process speech' 
    }, { status: 500 });
  }
}
