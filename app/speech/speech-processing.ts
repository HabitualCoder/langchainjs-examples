import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0.3
});

async function speechProcessingExample() {
  console.log("=== SPEECH PROCESSING EXAMPLE ===");
  console.log("This shows how to process speech-related data with Gemini");
  console.log("Note: For actual speech-to-text, use Google Speech-to-Text API");
  console.log();

  try {
    // Example 1: Generate speech scripts
    const prompt1 = `Create a natural-sounding speech script for a 2-minute presentation about the benefits of AI in healthcare. Include:
    - Engaging opening
    - 3 main points with examples
    - Call to action
    - Natural transitions between topics`;

    console.log("1️⃣ Generating Speech Script:");
    console.log("Prompt:", prompt1);
    console.log();
    
    const response1 = await model.invoke(prompt1);
    console.log("Speech Script:", response1.content);
    console.log();

    // Example 2: Convert text to speech-friendly format
    const formalText = "The implementation of artificial intelligence technologies in healthcare systems has demonstrated significant improvements in diagnostic accuracy and treatment efficiency.";
    
    const prompt2 = `Convert this formal text into a conversational, speech-friendly format that sounds natural when spoken aloud:
    "${formalText}"`;

    console.log("2️⃣ Converting Text for Speech:");
    console.log("Formal text:", formalText);
    console.log();
    
    const response2 = await model.invoke(prompt2);
    console.log("Speech-friendly version:", response2.content);
    console.log();

    // Example 3: Analyze speech patterns
    const speechSample = "So, um, I think that, you know, we should probably, like, consider the options and stuff.";
    
    const prompt3 = `Analyze this speech sample and provide:
    1. Filler words identified
    2. Confidence level assessment
    3. Suggestions for improvement
    4. Cleaned version

    Speech sample: "${speechSample}"`;

    console.log("3️⃣ Analyzing Speech Patterns:");
    console.log("Sample:", speechSample);
    console.log();
    
    const response3 = await model.invoke(prompt3);
    console.log("Analysis:", response3.content);
    console.log();

    // Example 4: Create voice assistant responses
    const prompt4 = `Create natural, conversational responses for a voice assistant when users ask:
    1. "What's the weather like?"
    2. "Set a reminder for 3 PM"
    3. "Tell me a joke"
    4. "What time is it?"

    Make responses sound human and friendly.`;

    console.log("4️⃣ Voice Assistant Responses:");
    console.log("Prompt:", prompt4);
    console.log();
    
    const response4 = await model.invoke(prompt4);
    console.log("Responses:", response4.content);
    console.log();

    console.log("🔧 Integration with Text-to-Speech Services:");
    console.log(`
// Example integration with Google Text-to-Speech:
import textToSpeech from '@google-cloud/text-to-speech';

async function convertToSpeech(text: string) {
  const client = new textToSpeech.TextToSpeechClient();
  
  const request = {
    input: { text: text },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Wavenet-D',
      ssmlGender: 'NEUTRAL',
    },
    audioConfig: {
      audioEncoding: 'MP3',
    },
  };
  
  const [response] = await client.synthesizeSpeech(request);
  
  // Save audio file
  fs.writeFileSync('output.mp3', response.audioContent, 'binary');
  return 'output.mp3';
}

// Usage:
const speechScript = await model.invoke("Create a friendly greeting");
const audioFile = await convertToSpeech(speechScript.content);
    `);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

speechProcessingExample();
