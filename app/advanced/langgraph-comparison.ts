import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.7
});

// LANGCHAIN.JS APPROACH - What we've been building
async function langchainApproach() {
  console.log("=== LANGCHAIN.JS APPROACH ===");
  
  // Simple linear workflow
  const prompt = PromptTemplate.fromTemplate(`
    Analyze this document and provide:
    1. Main topic
    2. Key points
    3. Summary
    
    Document: {document}
    
    Analysis:`);
  
  const outputParser = new StringOutputParser();
  
  // Simple chain
  const chain = RunnableSequence.from([
    prompt,
    model,
    outputParser
  ]);
  
  const result = await chain.invoke({
    document: "Artificial Intelligence is transforming industries worldwide. Machine learning algorithms can process vast amounts of data to identify patterns and make predictions. Deep learning networks mimic the human brain to solve complex problems."
  });
  
  console.log("LangChain.js Result:");
  console.log(result);
}

// LANGGRAPH.JS APPROACH - Advanced workflow
async function langgraphApproach() {
  console.log("\n=== LANGGRAPH.JS APPROACH ===");
  
  // Note: This is a conceptual example since we don't have LangGraph.js installed
  // In real LangGraph.js, you would use StateGraph
  
  console.log("LangGraph.js would look like this:");
  console.log(`
  const workflow = new StateGraph({
    nodes: {
      analyze: analyzeNode,
      extract: extractNode,
      summarize: summarizeNode,
      validate: validateNode
    },
    edges: [
      ["analyze", "extract"],
      ["extract", "summarize"],
      ["summarize", "validate"],
      ["validate", "extract"] // Loop back if validation fails
    ]
  });
  `);
  
  // Simulate the workflow steps
  console.log("\nSimulated LangGraph.js Workflow:");
  
  // Step 1: Analyze
  console.log("Step 1: Analyzing document...");
  const analysisPrompt = PromptTemplate.fromTemplate(`
    Analyze this document and identify the main topic:
    Document: {document}
    Topic:`);
  
  const analysisChain = RunnableSequence.from([
    analysisPrompt,
    model,
    new StringOutputParser()
  ]);
  
  const topic = await analysisChain.invoke({
    document: "Artificial Intelligence is transforming industries worldwide. Machine learning algorithms can process vast amounts of data to identify patterns and make predictions. Deep learning networks mimic the human brain to solve complex problems."
  });
  
  console.log(`Topic: ${topic}`);
  
  // Step 2: Extract key points
  console.log("\nStep 2: Extracting key points...");
  const extractPrompt = PromptTemplate.fromTemplate(`
    Extract key points from this document:
    Document: {document}
    Key Points:`);
  
  const extractChain = RunnableSequence.from([
    extractPrompt,
    model,
    new StringOutputParser()
  ]);
  
  const keyPoints = await extractChain.invoke({
    document: "Artificial Intelligence is transforming industries worldwide. Machine learning algorithms can process vast amounts of data to identify patterns and make predictions. Deep learning networks mimic the human brain to solve complex problems."
  });
  
  console.log(`Key Points: ${keyPoints}`);
  
  // Step 3: Summarize
  console.log("\nStep 3: Creating summary...");
  const summaryPrompt = PromptTemplate.fromTemplate(`
    Create a summary based on:
    Topic: {topic}
    Key Points: {keyPoints}
    
    Summary:`);
  
  const summaryChain = RunnableSequence.from([
    summaryPrompt,
    model,
    new StringOutputParser()
  ]);
  
  const summary = await summaryChain.invoke({
    topic: topic,
    keyPoints: keyPoints
  });
  
  console.log(`Summary: ${summary}`);
  
  // Step 4: Validate (simulated)
  console.log("\nStep 4: Validating results...");
  if (summary.length > 50) {
    console.log("✅ Validation passed - summary is comprehensive");
  } else {
    console.log("❌ Validation failed - summary too short, looping back...");
  }
}

// COMPLEX WORKFLOW EXAMPLE - What LangGraph.js excels at
async function complexWorkflowExample() {
  console.log("\n=== COMPLEX WORKFLOW EXAMPLE ===");
  
  console.log("This is where LangGraph.js shines:");
  console.log(`
  Document Processing Workflow:
  
  1. Upload Document
  2. Validate Format
  3. Extract Text
  4. Chunk Text
  5. Create Embeddings
  6. Index Document
  7. Notify User
  
  But what if:
  - Step 3 fails? → Retry or use different extraction method
  - Step 5 fails? → Fallback to simpler embedding
  - Step 6 fails? → Queue for later processing
  - User wants to review? → Pause for human input
  `);
  
  console.log("\nLangChain.js approach:");
  console.log("❌ Hard to handle complex error scenarios");
  console.log("❌ Difficult to pause and resume");
  console.log("❌ No built-in retry logic");
  console.log("❌ Limited state management");
  
  console.log("\nLangGraph.js approach:");
  console.log("✅ Built-in error handling and recovery");
  console.log("✅ Checkpointing for pause/resume");
  console.log("✅ Automatic retry with different strategies");
  console.log("✅ Explicit state management");
  console.log("✅ Human-in-the-loop support");
}

// WHEN TO USE WHICH
async function whenToUseWhich() {
  console.log("\n=== WHEN TO USE WHICH ===");
  
  console.log("\nUse LangChain.js for:");
  console.log("✅ Simple document Q&A");
  console.log("✅ Basic chatbot");
  console.log("✅ Linear text processing");
  console.log("✅ Learning AI concepts");
  console.log("✅ Prototyping quickly");
  console.log("✅ Portfolio projects");
  
  console.log("\nUse LangGraph.js for:");
  console.log("✅ Complex document pipelines");
  console.log("✅ Multi-step business processes");
  console.log("✅ Error-prone workflows");
  console.log("✅ Human-in-the-loop systems");
  console.log("✅ Production enterprise systems");
  console.log("✅ Stateful applications");
  
  console.log("\nReal-world examples:");
  console.log("\nLangChain.js projects:");
  console.log("- Personal document assistant");
  console.log("- Simple customer support bot");
  console.log("- Basic content generation");
  console.log("- Learning and experimentation");
  
  console.log("\nLangGraph.js projects:");
  console.log("- Enterprise document processing");
  console.log("- Complex customer support with escalation");
  console.log("- Multi-agent business automation");
  console.log("- Production AI systems");
}

// MIGRATION STRATEGY
async function migrationStrategy() {
  console.log("\n=== MIGRATION STRATEGY ===");
  
  console.log("\nStep 1: Start with LangChain.js");
  console.log("- Learn AI concepts");
  console.log("- Build simple applications");
  console.log("- Understand workflows");
  console.log("- Create portfolio projects");
  
  console.log("\nStep 2: Identify Complex Workflows");
  console.log("- Look for multi-step processes");
  console.log("- Identify error-prone steps");
  console.log("- Find places needing human input");
  console.log("- Spot state management needs");
  
  console.log("\nStep 3: Migrate to LangGraph.js");
  console.log("- Convert chains to workflows");
  console.log("- Add explicit state management");
  console.log("- Implement error handling");
  console.log("- Add checkpointing");
  
  console.log("\nStep 4: Production Deployment");
  console.log("- Add monitoring and logging");
  console.log("- Implement human-in-the-loop");
  console.log("- Add retry and fallback logic");
  console.log("- Scale to enterprise usage");
}

// Run all examples
async function runAllExamples() {
  try {
    await langchainApproach();
    await langgraphApproach();
    await complexWorkflowExample();
    await whenToUseWhich();
    await migrationStrategy();
  } catch (error) {
    console.error("Error:", error);
  }
}

runAllExamples();
