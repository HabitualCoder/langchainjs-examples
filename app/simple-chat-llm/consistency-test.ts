import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Simple schema to test
const TestSchema = z.object({
  answer: z.string().describe("The main answer to the question"),
  confidence: z.number().min(0).max(1).describe("How confident you are (0-1)")
});

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0  // Set to 0 for consistent results
});

const structuredModel = model.withStructuredOutput(TestSchema);

async function testConsistency() {
  console.log("Testing the same prompt multiple times...\n");
  
  const prompt = "What is 2+2?";
  
  for (let i = 1; i <= 3; i++) {
    console.log(`=== Attempt ${i} ===`);
    try {
      const response = await structuredModel.invoke(prompt);
      console.log(JSON.stringify(response, null, 2));
      console.log();
    } catch (error) {
      console.error(`Error in attempt ${i}:`, error);
    }
  }
}

testConsistency();
