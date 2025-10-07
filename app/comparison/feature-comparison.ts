import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

// Comprehensive comparison schema
const ComparisonSchema = z.object({
  feature: z.string().describe("The AI feature being compared"),
  vercel_ai_sdk: z.object({
    function_name: z.string().describe("Vercel AI SDK function name"),
    description: z.string().describe("What it does in Vercel AI SDK"),
    example_usage: z.string().describe("Example of how to use it")
  }),
  langchain_js: z.object({
    method_name: z.string().describe("LangChain.js method name"),
    description: z.string().describe("What it does in LangChain.js"),
    example_usage: z.string().describe("Example of how to use it")
  }),
  differences: z.array(z.string()).describe("Key differences between the two approaches"),
  use_cases: z.array(z.string()).describe("When to use each approach")
});

const structuredModel = model.withStructuredOutput(ComparisonSchema);

async function comprehensiveComparison() {
  console.log("=== COMPREHENSIVE FEATURE COMPARISON ===");
  console.log("LangChain.js vs Vercel AI SDK");
  console.log("=".repeat(60));
  console.log();

  const features = [
    "Text Generation (generateText equivalent)",
    "Structured Output (generateObject equivalent)", 
    "Streaming Text (streamText equivalent)",
    "Streaming Objects (streamObject equivalent)",
    "Tool Calling / Function Calling",
    "Image Analysis and Generation",
    "Audio Transcription and Speech Processing",
    "Multimodal Content Processing",
    "State Management and Memory",
    "Prompt Engineering and Templates"
  ];

  for (const feature of features) {
    console.log(`\n🔍 Analyzing: ${feature}`);
    console.log("-".repeat(50));
    
    try {
      const response = await structuredModel.invoke(`
        Compare ${feature} between Vercel AI SDK and LangChain.js.
        Provide detailed comparison including function names, descriptions, 
        example usage, key differences, and use cases for each approach.
      `);
      
      console.log(`Feature: ${response.feature}`);
      console.log();
      
      console.log("📦 Vercel AI SDK:");
      console.log(`  Function: ${response.vercel_ai_sdk.function_name}`);
      console.log(`  Description: ${response.vercel_ai_sdk.description}`);
      console.log(`  Example: ${response.vercel_ai_sdk.example_usage}`);
      console.log();
      
      console.log("🔗 LangChain.js:");
      console.log(`  Method: ${response.langchain_js.method_name}`);
      console.log(`  Description: ${response.langchain_js.description}`);
      console.log(`  Example: ${response.langchain_js.example_usage}`);
      console.log();
      
      console.log("⚖️ Key Differences:");
      response.differences.forEach((diff, index) => {
        console.log(`  ${index + 1}. ${diff}`);
      });
      console.log();
      
      console.log("🎯 Use Cases:");
      response.use_cases.forEach((useCase, index) => {
        console.log(`  ${index + 1}. ${useCase}`);
      });
      
    } catch (error) {
      console.error(`Error analyzing ${feature}:`, error);
    }
    
    console.log("\n" + "=".repeat(60));
  }

  console.log("\n📊 SUMMARY COMPARISON TABLE:");
  console.log("=".repeat(80));
  console.log("| Feature | Vercel AI SDK | LangChain.js | Best For |");
  console.log("|---------|---------------|--------------|----------|");
  console.log("| Text Gen | generateText() | model.invoke() | Simple apps |");
  console.log("| Structured | generateObject() | withStructuredOutput() | Complex schemas |");
  console.log("| Streaming | streamText() | model.stream() | Real-time apps |");
  console.log("| Tools | Built-in | bindTools() | Advanced workflows |");
  console.log("| Images | Limited | Multimodal support | Image analysis |");
  console.log("| Audio | None | Integration ready | Speech processing |");
  console.log("| State | None | Built-in chains | Complex workflows |");
  console.log("| Templates | Basic | Advanced | Prompt engineering |");
  console.log("=".repeat(80));

  console.log("\n🏆 RECOMMENDATIONS:");
  console.log("=".repeat(40));
  console.log("✅ Use Vercel AI SDK when:");
  console.log("  - Building simple chat applications");
  console.log("  - Need React components out of the box");
  console.log("  - Want minimal setup and configuration");
  console.log("  - Building Next.js applications");
  console.log();
  console.log("✅ Use LangChain.js when:");
  console.log("  - Building complex AI workflows");
  console.log("  - Need advanced prompt engineering");
  console.log("  - Want extensive tool integration");
  console.log("  - Building enterprise applications");
  console.log("  - Need multimodal capabilities");
  console.log("  - Want fine-grained control over AI behavior");
}

comprehensiveComparison();
