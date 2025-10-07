import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Your exact schema from the file
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

async function revealInternalPrompt() {
  console.log("=== YOUR ORIGINAL PROMPT ===");
  const originalPrompt = "What is artificial intelligence and how does it work?";
  console.log(originalPrompt);
  console.log();

  console.log("=== WHAT LANGCHAIN ADDS INTERNALLY ===");
  console.log("LangChain converts your Zod schema to JSON Schema and adds instructions like this:");
  console.log();

  // This is what LangChain internally generates
  const internalPrompt = `${originalPrompt}

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

  console.log(internalPrompt);
  console.log();

  console.log("=== TESTING WITH STRUCTURED OUTPUT ===");
  const structuredModel = model.withStructuredOutput(ResponseSchema);
  
  try {
    const response = await structuredModel.invoke(originalPrompt);
    console.log("Structured Response:");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

revealInternalPrompt();