import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Let's see what happens internally
const TestSchema = z.object({
  answer: z.string().describe("The main answer to the question"),
  confidence: z.number().min(0).max(1).describe("How confident you are (0-1)")
});

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

async function demonstrateInternalProcess() {
  console.log("=== Regular Model Call ===");
  const regularResponse = await model.invoke("What is 2+2?");
  console.log("Regular response:", regularResponse.content);
  console.log();

  console.log("=== Structured Model Call ===");
  const structuredModel = model.withStructuredOutput(TestSchema);
  const structuredResponse = await structuredModel.invoke("What is 2+2?");
  console.log("Structured response:", structuredResponse);
  console.log();

  console.log("=== What Zod .describe() Actually Does ===");
  console.log("The .describe() method provides hints to the AI about what each field should contain.");
  console.log("It does NOT create follow-up prompts or multiple responses.");
  console.log("It helps the AI understand the expected content for each field.");
  console.log();

  console.log("=== Why You Might See Variations ===");
  console.log("1. Temperature setting (higher = more random)");
  console.log("2. Model's inherent variability");
  console.log("3. Complex prompts that can be interpreted multiple ways");
  console.log("4. Different schema fields requiring different types of content");
}

demonstrateInternalProcess();
