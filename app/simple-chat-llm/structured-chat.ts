import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Define the schema for structured output
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

// Bind the structured output schema to the model
const structuredModel = model.withStructuredOutput(ResponseSchema);

async function runStructuredChat() {
  try {
    const response = await structuredModel.invoke("What is artificial intelligence and how does it work?");
    
    console.log("Structured Response:");
    console.log(JSON.stringify(response, null, 2));
    
    // You can also access individual properties
    console.log("\nIndividual Properties:");
    console.log(`Answer: ${response.answer}`);
    console.log(`Confidence: ${response.confidence}`);
    console.log(`Category: ${response.category}`);
    console.log(`Key Points: ${response.key_points.join(", ")}`);
    console.log(`Follow-up Questions: ${response.followup_questions.join(", ")}`);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

runStructuredChat();
