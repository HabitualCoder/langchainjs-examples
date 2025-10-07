import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0.3
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    
    if (!image) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const mimeType = image.type;

    // Create message with image and text
    const message = {
      role: "user" as const,
      content: [
        {
          type: "text" as const,
          text: prompt
        },
        {
          type: "image_url" as const,
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`
          }
        }
      ]
    };

    const response = await model.invoke([message]);
    
    return NextResponse.json({ 
      success: true, 
      content: response.content 
    });
    
  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze image' 
    }, { status: 500 });
  }
}
