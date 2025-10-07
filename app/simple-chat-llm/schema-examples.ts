import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Example 1: Simple object schema
const SimpleSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
  isActive: z.boolean()
});

// Example 2: Complex nested schema
const PersonSchema = z.object({
  personalInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string().describe("Date in YYYY-MM-DD format"),
    nationality: z.string()
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      country: z.string(),
      postalCode: z.string()
    })
  }),
  preferences: z.array(z.string()).describe("List of user preferences"),
  metadata: z.object({
    createdAt: z.string().describe("ISO timestamp"),
    lastLogin: z.string().optional().describe("ISO timestamp"),
    accountType: z.enum(["free", "premium", "enterprise"])
  })
});

// Example 3: Array-based schema
const ProductListSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    category: z.string(),
    inStock: z.boolean(),
    tags: z.array(z.string())
  })),
  totalCount: z.number(),
  categories: z.array(z.string())
});

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

async function demonstrateSchemas() {
  try {
    console.log("=== Example 1: Simple Schema ===");
    const simpleModel = model.withStructuredOutput(SimpleSchema);
    const simpleResponse = await simpleModel.invoke("Create a fictional user profile");
    console.log(JSON.stringify(simpleResponse, null, 2));

    console.log("\n=== Example 2: Complex Nested Schema ===");
    const personModel = model.withStructuredOutput(PersonSchema);
    const personResponse = await personModel.invoke("Generate a detailed user profile for a software developer");
    console.log(JSON.stringify(personResponse, null, 2));

    console.log("\n=== Example 3: Array-based Schema ===");
    const productModel = model.withStructuredOutput(ProductListSchema);
    const productResponse = await productModel.invoke("Create a list of 5 tech products with their details");
    console.log(JSON.stringify(productResponse, null, 2));

  } catch (error) {
    console.error("Error:", error);
  }
}

demonstrateSchemas();
