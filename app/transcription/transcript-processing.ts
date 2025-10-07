import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0
});

async function transcriptionExample() {
  console.log("=== TRANSCRIPTION EXAMPLE ===");
  console.log("Note: Gemini can analyze audio transcripts but doesn't directly");
  console.log("transcribe audio. You would use other services for audio-to-text");
  console.log("and then process the transcript with Gemini.");
  console.log();

  try {
    // Example 1: Process audio transcript
    const sampleTranscript = `
    Speaker 1: Hi, welcome to our podcast about artificial intelligence.
    Speaker 2: Thanks for having me. I'm excited to discuss the latest developments in AI.
    Speaker 1: Can you tell us about your work in machine learning?
    Speaker 2: Sure, I've been working on natural language processing models for the past five years.
    `;

    const prompt1 = `Analyze this audio transcript and provide:
    1. A summary of the conversation
    2. Key topics discussed
    3. Speaker identification and their roles
    4. Important quotes or statements

    Transcript: ${sampleTranscript}`;

    console.log("1️⃣ Processing Audio Transcript:");
    console.log("Sample transcript:", sampleTranscript);
    console.log();
    
    const response1 = await model.invoke(prompt1);
    console.log("Analysis:", response1.content);
    console.log();

    // Example 2: Extract action items from meeting transcript
    const meetingTranscript = `
    John: We need to finish the project by next Friday.
    Sarah: I'll handle the frontend development.
    Mike: I can work on the backend API.
    John: Great, let's schedule a review meeting for Wednesday.
    Sarah: I'll send out the calendar invite.
    `;

    const prompt2 = `Extract action items from this meeting transcript:
    - Who is responsible for what
    - Deadlines mentioned
    - Follow-up tasks required

    Meeting transcript: ${meetingTranscript}`;

    console.log("2️⃣ Extracting Action Items:");
    console.log("Meeting transcript:", meetingTranscript);
    console.log();
    
    const response2 = await model.invoke(prompt2);
    console.log("Action Items:", response2.content);
    console.log();

    // Example 3: Improve transcript quality
    const poorTranscript = "um so like we need to uh finish the project and stuff you know";
    
    const prompt3 = `Clean up and improve this transcript while maintaining the original meaning:
    "${poorTranscript}"`;

    console.log("3️⃣ Improving Transcript Quality:");
    console.log("Original:", poorTranscript);
    console.log();
    
    const response3 = await model.invoke(prompt3);
    console.log("Improved:", response3.content);
    console.log();

    console.log("🔧 Integration with Real Transcription Services:");
    console.log(`
// Example integration with Google Speech-to-Text:
import speech from '@google-cloud/speech';

async function transcribeAudio(audioFile: string) {
  const client = new speech.SpeechClient();
  
  const audio = {
    content: fs.readFileSync(audioFile).toString('base64'),
  };
  
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  
  const request = {
    audio: audio,
    config: config,
  };
  
  const [response] = await client.recognize(request);
  const transcript = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\\n');
  
  // Now process with Gemini
  const analysis = await model.invoke(\`Analyze this transcript: \${transcript}\`);
  return analysis.content;
}
    `);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

transcriptionExample();
