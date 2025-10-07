import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.7
});

async function streamTextExample() {
  console.log("=== STREAMING TEXT EXAMPLE ===");
  console.log("This is equivalent to Vercel AI SDK's streamText()");
  console.log();

  const prompt = "Write a short story about a robot learning to paint";
  
  try {
    // Stream the response
    const stream = await model.stream(prompt);
    
    console.log("Streaming response:");
    console.log("-".repeat(50));
    
    for await (const chunk of stream) {
      // Print each chunk as it arrives
      process.stdout.write(chunk.content);
    }
    
    console.log("\n" + "-".repeat(50));
    console.log("Streaming completed!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

streamTextExample();
