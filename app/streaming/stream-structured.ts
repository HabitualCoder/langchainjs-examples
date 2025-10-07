import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.7
});

// Define schema for structured streaming
const StorySchema = z.object({
  title: z.string().describe("Title of the story"),
  paragraphs: z.array(z.string()).describe("Story broken into paragraphs"),
  characters: z.array(z.string()).describe("Main characters in the story"),
  theme: z.string().describe("Main theme of the story")
});

async function streamStructuredExample() {
  console.log("=== STREAMING STRUCTURED OUTPUT ===");
  console.log("This is equivalent to Vercel AI SDK's streamObject()");
  console.log();

  const prompt = "Write a creative story about a time traveler";
  const structuredModel = model.withStructuredOutput(StorySchema);
  
  try {
    // Stream structured response
    const stream = await structuredModel.stream(prompt);
    
    console.log("Streaming structured response:");
    console.log("-".repeat(50));
    
    let fullResponse = "";
    for await (const chunk of stream) {
      fullResponse += chunk.content;
      process.stdout.write(chunk.content);
    }
    
    console.log("\n" + "-".repeat(50));
    console.log("Final structured object:");
    console.log(JSON.stringify(JSON.parse(fullResponse), null, 2));
    
  } catch (error) {
    console.error("Error:", error);
  }
}

streamStructuredExample();
