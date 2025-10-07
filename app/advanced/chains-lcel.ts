import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.7
});

// 1. BASIC CHAIN - Simple pipeline
async function basicChain() {
  console.log("=== BASIC CHAIN ===");
  
  const prompt = PromptTemplate.fromTemplate(`
    You are a helpful AI assistant. 
    Question: {question}
    Answer: `);
  
  const outputParser = new StringOutputParser();
  
  // Create chain using LCEL
  const chain = RunnableSequence.from([
    prompt,
    model,
    outputParser
  ]);
  
  const result = await chain.invoke({
    question: "What is the capital of France?"
  });
  
  console.log("Result:", result);
}

// 2. COMPLEX CHAIN - Multi-step processing
async function complexChain() {
  console.log("\n=== COMPLEX CHAIN ===");
  
  const step1Prompt = PromptTemplate.fromTemplate(`
    Analyze this text and extract key information:
    Text: {text}
    
    Extract:
    1. Main topic
    2. Key points
    3. Sentiment
    4. Action items
    `);
  
  const step2Prompt = PromptTemplate.fromTemplate(`
    Based on this analysis, create a summary:
    Analysis: {analysis}
    
    Create a professional summary with:
    1. Executive summary
    2. Key findings
    3. Recommendations
    `);
  
  const complexChain = RunnableSequence.from([
    {
      analysis: step1Prompt.pipe(model).pipe(new StringOutputParser()),
      originalText: new RunnablePassthrough()
    },
    step2Prompt,
    model,
    new StringOutputParser()
  ]);
  
  const result = await complexChain.invoke({
    text: "Our Q4 sales increased by 25% compared to last year. Customer satisfaction is at 92%. We need to expand to European markets and invest in AI technology."
  });
  
  console.log("Complex Chain Result:", result);
}

// 3. CONDITIONAL CHAIN - Different paths based on input
async function conditionalChain() {
  console.log("\n=== CONDITIONAL CHAIN ===");
  
  const routingPrompt = PromptTemplate.fromTemplate(`
    Analyze this request and determine the type:
    Request: {request}
    
    Types: technical, business, creative, personal
    
    Respond with just the type.
    `);
  
  const technicalPrompt = PromptTemplate.fromTemplate(`
    Provide a technical analysis of: {request}
    Include: technical details, implementation steps, best practices
    `);
  
  const businessPrompt = PromptTemplate.fromTemplate(`
    Provide a business analysis of: {request}
    Include: market analysis, ROI, strategic recommendations
    `);
  
  const creativePrompt = PromptTemplate.fromTemplate(`
    Provide a creative approach to: {request}
    Include: innovative ideas, creative solutions, artistic elements
    `);
  
  const personalPrompt = PromptTemplate.fromTemplate(`
    Provide personal advice for: {request}
    Include: practical tips, personal insights, encouragement
    `);
  
  // Create routing chain
  const router = RunnableSequence.from([
    routingPrompt,
    model,
    new StringOutputParser()
  ]);
  
  // Create specialized chains
  const technicalChain = technicalPrompt.pipe(model).pipe(new StringOutputParser());
  const businessChain = businessPrompt.pipe(model).pipe(new StringOutputParser());
  const creativeChain = creativePrompt.pipe(model).pipe(new StringOutputParser());
  const personalChain = personalPrompt.pipe(model).pipe(new StringOutputParser());
  
  async function routeRequest(request: string) {
    const route = await router.invoke({ request });
    console.log(`Routing to: ${route}`);
    
    switch (route.toLowerCase()) {
      case 'technical':
        return await technicalChain.invoke({ request });
      case 'business':
        return await businessChain.invoke({ request });
      case 'creative':
        return await creativeChain.invoke({ request });
      case 'personal':
        return await personalChain.invoke({ request });
      default:
        return "Unable to determine request type";
    }
  }
  
  const result = await routeRequest("How to implement microservices architecture?");
  console.log("Conditional Chain Result:", result);
}

// 4. PARALLEL CHAIN - Multiple chains running simultaneously
async function parallelChain() {
  console.log("\n=== PARALLEL CHAIN ===");
  
  const sentimentPrompt = PromptTemplate.fromTemplate(`
    Analyze the sentiment of this text: {text}
    Respond with: positive, negative, or neutral
    `);
  
  const topicPrompt = PromptTemplate.fromTemplate(`
    Identify the main topic of this text: {text}
    Respond with a single word or short phrase.
    `);
  
  const summaryPrompt = PromptTemplate.fromTemplate(`
    Summarize this text in one sentence: {text}
    `);
  
  // Create parallel chains
  const sentimentChain = sentimentPrompt.pipe(model).pipe(new StringOutputParser());
  const topicChain = topicPrompt.pipe(model).pipe(new StringOutputParser());
  const summaryChain = summaryPrompt.pipe(model).pipe(new StringOutputParser());
  
  const text = "I love working with AI technology. It's fascinating how it can understand and generate human-like text. The possibilities are endless!";
  
  // Run chains in parallel
  const [sentiment, topic, summary] = await Promise.all([
    sentimentChain.invoke({ text }),
    topicChain.invoke({ text }),
    summaryChain.invoke({ text })
  ]);
  
  console.log("Parallel Chain Results:");
  console.log("Sentiment:", sentiment);
  console.log("Topic:", topic);
  console.log("Summary:", summary);
}

// 5. STREAMING CHAIN - Real-time processing
async function streamingChain() {
  console.log("\n=== STREAMING CHAIN ===");
  
  const prompt = PromptTemplate.fromTemplate(`
    Write a detailed explanation about: {topic}
    Make it educational and engaging.
    `);
  
  const streamingChain = prompt.pipe(model);
  
  console.log("Streaming response:");
  console.log("-".repeat(50));
  
  const stream = await streamingChain.stream({ topic: "artificial intelligence" });
  
  for await (const chunk of stream) {
    process.stdout.write(chunk.content);
  }
  
  console.log("\n" + "-".repeat(50));
}

// Run all examples
async function runAllChains() {
  try {
    await basicChain();
    await complexChain();
    await conditionalChain();
    await parallelChain();
    await streamingChain();
  } catch (error) {
    console.error("Error:", error);
  }
}

runAllChains();
