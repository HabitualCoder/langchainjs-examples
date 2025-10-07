import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const ResponseSchema = z.object({
  answer: z.string().describe("The main answer to the user's question"),
  confidence: z.number().min(0).max(1).describe("Confidence level from 0 to 1"),
  followup_questions: z.array(z.string()).describe("2-3 relevant follow-up questions"),
  category: z.enum(["general", "technical", "personal", "educational"]).describe("Category of the question"),
  key_points: z.array(z.string()).describe("Key points or facts mentioned in the answer")
});

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

async function sideBySideComparison() {
  const originalPrompt = "What is artificial intelligence and how does it work?";
  
  console.log("=".repeat(80));
  console.log("SIDE-BY-SIDE COMPARISON: REGULAR vs STRUCTURED OUTPUT");
  console.log("=".repeat(80));
  
  console.log("\n1️⃣ REGULAR MODEL CALL:");
  console.log("Prompt sent to LLM:", originalPrompt);
  console.log();
  
  try {
    const regularResponse = await model.invoke(originalPrompt);
    console.log("Response:", regularResponse.content);
  } catch (error) {
    console.error("Error:", error);
  }
  
  console.log("\n" + "=".repeat(80));
  console.log("2️⃣ STRUCTURED MODEL CALL:");
  console.log("Prompt sent to LLM:");
  console.log();
  
  // Show the exact prompt that gets sent
  const structuredPrompt = `${originalPrompt}

Please respond with a JSON object that matches the following schema:
{
  "type": "object",
  "properties": {
    "answer": {
      "type": "string",
      "description": "The main answer to the user's question"
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Confidence level from 0 to 1"
    },
    "followup_questions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "2-3 relevant follow-up questions"
    },
    "category": {
      "type": "string",
      "enum": ["general", "technical", "personal", "educational"],
      "description": "Category of the question"
    },
    "key_points": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Key points or facts mentioned in the answer"
    }
  },
  "required": ["answer", "confidence", "followup_questions", "category", "key_points"]
}

Respond with valid JSON only.`;
  
  console.log(structuredPrompt);
  console.log();
  
  try {
    const structuredModel = model.withStructuredOutput(ResponseSchema);
    const structuredResponse = await structuredModel.invoke(originalPrompt);
    console.log("Response:", JSON.stringify(structuredResponse, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
  
  console.log("\n" + "=".repeat(80));
  console.log("KEY INSIGHTS FOR BETTER SCHEMAS:");
  console.log("=".repeat(80));
  console.log("✅ .describe() text becomes the 'description' field in JSON Schema");
  console.log("✅ Zod constraints (.min(), .max(), .enum()) become JSON Schema constraints");
  console.log("✅ Array types become JSON Schema arrays with item definitions");
  console.log("✅ Required fields are automatically detected and marked as required");
  console.log("✅ The LLM gets explicit instructions to return ONLY valid JSON");
  console.log("✅ Your original prompt stays exactly the same - only instructions are added");
}

sideBySideComparison();
