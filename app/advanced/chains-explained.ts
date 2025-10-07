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

// SIMPLE CHAIN - Step by step explanation
async function simpleChainExample() {
  console.log("=== SIMPLE CHAIN EXPLANATION ===");
  
  // Step 1: Create a prompt template
  console.log("Step 1: Creating prompt template...");
  const prompt = PromptTemplate.fromTemplate(`
    You are a helpful AI assistant.
    Question: {question}
    Answer: `);
  
  // Step 2: Create output parser
  console.log("Step 2: Creating output parser...");
  const outputParser = new StringOutputParser();
  
  // Step 3: Create the chain
  console.log("Step 3: Creating chain...");
  const chain = RunnableSequence.from([
    prompt,        // Takes input, formats prompt
    model,         // Takes prompt, generates response
    outputParser   // Takes response, cleans it up
  ]);
  
  // Step 4: Use the chain
  console.log("Step 4: Using the chain...");
  const result = await chain.invoke({
    question: "What is 2 + 2?"
  });
  
  console.log("Final result:", result);
}

// COMPLEX CHAIN - Multi-step processing
async function complexChainExample() {
  console.log("\n=== COMPLEX CHAIN EXPLANATION ===");
  
  // Step 1: Create first prompt (analysis)
  console.log("Step 1: Creating analysis prompt...");
  const analysisPrompt = PromptTemplate.fromTemplate(`
    Analyze this text and extract:
    1. Main topic
    2. Key points
    3. Sentiment
    
    Text: {text}
    
    Analysis:`);
  
  // Step 2: Create second prompt (summary)
  console.log("Step 2: Creating summary prompt...");
  const summaryPrompt = PromptTemplate.fromTemplate(`
    Based on this analysis, create a summary:
    
    Analysis: {analysis}
    
    Summary:`);
  
  // Step 3: Create the complex chain
  console.log("Step 3: Creating complex chain...");
  const complexChain = RunnableSequence.from([
    analysisPrompt,                    // Step 1: Analyze text
    model,                            // Step 2: Generate analysis
    new StringOutputParser(),         // Step 3: Clean analysis
    summaryPrompt,                    // Step 4: Format summary prompt
    model,                            // Step 5: Generate summary
    new StringOutputParser()          // Step 6: Clean summary
  ]);
  
  // Step 4: Use the complex chain
  console.log("Step 4: Using complex chain...");
  const result = await complexChain.invoke({
    text: "Our company sales increased by 25% this quarter. Customer satisfaction is at 92%. We need to expand to European markets."
  });
  
  console.log("Final summary:", result);
}

// CONDITIONAL CHAIN - Different paths based on input
async function conditionalChainExample() {
  console.log("\n=== CONDITIONAL CHAIN EXPLANATION ===");
  
  // Step 1: Create routing prompt
  console.log("Step 1: Creating routing prompt...");
  const routingPrompt = PromptTemplate.fromTemplate(`
    Analyze this request and determine the type:
    Request: {request}
    
    Types: technical, business, personal
    
    Respond with just the type.`);
  
  // Step 2: Create specialized prompts
  console.log("Step 2: Creating specialized prompts...");
  const technicalPrompt = PromptTemplate.fromTemplate(`
    Provide technical analysis of: {request}
    Include: technical details, implementation steps`);
  
  const businessPrompt = PromptTemplate.fromTemplate(`
    Provide business analysis of: {request}
    Include: market analysis, ROI, recommendations`);
  
  const personalPrompt = PromptTemplate.fromTemplate(`
    Provide personal advice for: {request}
    Include: practical tips, encouragement`);
  
  // Step 3: Create routing chain
  console.log("Step 3: Creating routing chain...");
  const router = RunnableSequence.from([
    routingPrompt,
    model,
    new StringOutputParser()
  ]);
  
  // Step 4: Create specialized chains
  console.log("Step 4: Creating specialized chains...");
  const technicalChain = technicalPrompt.pipe(model).pipe(new StringOutputParser());
  const businessChain = businessPrompt.pipe(model).pipe(new StringOutputParser());
  const personalChain = personalPrompt.pipe(model).pipe(new StringOutputParser());
  
  // Step 5: Route requests
  console.log("Step 5: Routing requests...");
  
  async function routeRequest(request: string) {
    console.log(`Routing request: "${request}"`);
    
    const route = await router.invoke({ request });
    console.log(`Route determined: ${route}`);
    
    switch (route.toLowerCase()) {
      case 'technical':
        return await technicalChain.invoke({ request });
      case 'business':
        return await businessChain.invoke({ request });
      case 'personal':
        return await personalChain.invoke({ request });
      default:
        return "Unable to determine request type";
    }
  }
  
  // Test different requests
  const requests = [
    "How to implement microservices?",
    "Should I invest in AI technology?",
    "I'm feeling stressed about work"
  ];
  
  for (const request of requests) {
    console.log(`\n--- Processing: "${request}" ---`);
    const result = await routeRequest(request);
    console.log("Result:", result.substring(0, 100) + "...");
  }
}

// PARALLEL CHAIN - Multiple chains running simultaneously
async function parallelChainExample() {
  console.log("\n=== PARALLEL CHAIN EXPLANATION ===");
  
  // Step 1: Create different analysis prompts
  console.log("Step 1: Creating analysis prompts...");
  const sentimentPrompt = PromptTemplate.fromTemplate(`
    Analyze the sentiment of this text: {text}
    Respond with: positive, negative, or neutral`);
  
  const topicPrompt = PromptTemplate.fromTemplate(`
    Identify the main topic of this text: {text}
    Respond with a single word or short phrase.`);
  
  const summaryPrompt = PromptTemplate.fromTemplate(`
    Summarize this text in one sentence: {text}`);
  
  // Step 2: Create parallel chains
  console.log("Step 2: Creating parallel chains...");
  const sentimentChain = sentimentPrompt.pipe(model).pipe(new StringOutputParser());
  const topicChain = topicPrompt.pipe(model).pipe(new StringOutputParser());
  const summaryChain = summaryPrompt.pipe(model).pipe(new StringOutputParser());
  
  // Step 3: Run chains in parallel
  console.log("Step 3: Running chains in parallel...");
  const text = "I love working with AI technology. It's fascinating how it can understand and generate human-like text. The possibilities are endless!";
  
  console.log(`Analyzing text: "${text}"`);
  
  const [sentiment, topic, summary] = await Promise.all([
    sentimentChain.invoke({ text }),
    topicChain.invoke({ text }),
    summaryChain.invoke({ text })
  ]);
  
  console.log("Parallel results:");
  console.log("Sentiment:", sentiment);
  console.log("Topic:", topic);
  console.log("Summary:", summary);
}

// Run all examples
async function runAllExamples() {
  try {
    await simpleChainExample();
    await complexChainExample();
    await conditionalChainExample();
    await parallelChainExample();
  } catch (error) {
    console.error("Error:", error);
  }
}

runAllExamples();
