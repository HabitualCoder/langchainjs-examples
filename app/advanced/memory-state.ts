import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BufferMemory, ConversationSummaryMemory, WindowMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.7
});

// 1. BUFFER MEMORY - Complete conversation history
async function bufferMemoryExample() {
  console.log("=== BUFFER MEMORY ===");
  
  const memory = new BufferMemory();
  const prompt = PromptTemplate.fromTemplate(`
    The following is a friendly conversation between a human and an AI.
    
    Current conversation:
    {history}
    
    Human: {input}
    AI:`);
  
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: prompt
  });
  
  console.log("Starting conversation with buffer memory...");
  
  const response1 = await chain.call({ input: "Hi, my name is John. I'm a software engineer." });
  console.log("AI:", response1.response);
  
  const response2 = await chain.call({ input: "What's my name and profession?" });
  console.log("AI:", response2.response);
  
  const response3 = await chain.call({ input: "What programming languages should I learn?" });
  console.log("AI:", response3.response);
  
  console.log("\nMemory contents:");
  console.log(await memory.loadMemoryVariables({}));
}

// 2. WINDOW MEMORY - Last N messages only
async function windowMemoryExample() {
  console.log("\n=== WINDOW MEMORY ===");
  
  const memory = new WindowMemory({ k: 2 }); // Keep last 2 exchanges
  const prompt = PromptTemplate.fromTemplate(`
    The following is a conversation between a human and an AI.
    
    Recent conversation:
    {history}
    
    Human: {input}
    AI:`);
  
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: prompt
  });
  
  console.log("Starting conversation with window memory (last 2 messages)...");
  
  await chain.call({ input: "I love pizza" });
  await chain.call({ input: "My favorite color is blue" });
  await chain.call({ input: "I have a dog named Max" });
  
  const response = await chain.call({ input: "What do you know about me?" });
  console.log("AI:", response.response);
  
  console.log("\nWindow memory contents:");
  console.log(await memory.loadMemoryVariables({}));
}

// 3. CONVERSATION SUMMARY MEMORY - Summarized history
async function summaryMemoryExample() {
  console.log("\n=== SUMMARY MEMORY ===");
  
  const memory = new ConversationSummaryMemory({
    llm: model,
    memoryKey: "chat_history"
  });
  
  const prompt = PromptTemplate.fromTemplate(`
    The following is a friendly conversation between a human and an AI.
    
    Summary of conversation:
    {chat_history}
    
    Human: {input}
    AI:`);
  
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: prompt
  });
  
  console.log("Starting conversation with summary memory...");
  
  // Simulate a long conversation
  const topics = [
    "I'm planning a trip to Japan",
    "I want to visit Tokyo, Kyoto, and Osaka",
    "I'm interested in Japanese culture and food",
    "I'll be traveling in spring for cherry blossom season",
    "I need advice on what to pack",
    "What are the must-see attractions?"
  ];
  
  for (const topic of topics) {
    const response = await chain.call({ input: topic });
    console.log(`Human: ${topic}`);
    console.log(`AI: ${response.response}\n`);
  }
  
  console.log("Summary memory contents:");
  console.log(await memory.loadMemoryVariables({}));
}

// 4. CUSTOM MEMORY - Business context memory
async function customMemoryExample() {
  console.log("\n=== CUSTOM MEMORY ===");
  
  class BusinessMemory extends BufferMemory {
    private businessContext: any = {};
    
    async saveContext(inputValues: any, outputValues: any) {
      // Save regular conversation
      await super.saveContext(inputValues, outputValues);
      
      // Extract and save business context
      const input = inputValues.input || inputValues.human || "";
      const output = outputValues.output || outputValues.ai || "";
      
      // Extract business entities
      if (input.includes("company") || input.includes("business")) {
        this.businessContext.company = this.extractEntity(input, "company");
      }
      
      if (input.includes("budget") || input.includes("cost")) {
        this.businessContext.budget = this.extractEntity(input, "budget");
      }
      
      if (input.includes("timeline") || input.includes("deadline")) {
        this.businessContext.timeline = this.extractEntity(input, "timeline");
      }
    }
    
    async loadMemoryVariables(inputs: any) {
      const baseMemory = await super.loadMemoryVariables(inputs);
      return {
        ...baseMemory,
        business_context: JSON.stringify(this.businessContext, null, 2)
      };
    }
    
    private extractEntity(text: string, type: string): string {
      // Simple entity extraction (in production, use NER)
      const patterns = {
        company: /(?:company|business|organization)\s+(?:is\s+)?([A-Z][a-zA-Z\s]+)/i,
        budget: /(?:budget|cost|price)\s+(?:is\s+)?(\$?[\d,]+(?:\.[\d]{2})?)/i,
        timeline: /(?:timeline|deadline|by)\s+(?:is\s+)?([A-Za-z\s\d,]+)/i
      };
      
      const match = text.match(patterns[type as keyof typeof patterns]);
      return match ? match[1].trim() : "";
    }
  }
  
  const memory = new BusinessMemory();
  const prompt = PromptTemplate.fromTemplate(`
    You are a business consultant AI assistant.
    
    Conversation history:
    {history}
    
    Business context:
    {business_context}
    
    Human: {input}
    AI:`);
  
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: prompt
  });
  
  console.log("Starting business conversation with custom memory...");
  
  await chain.call({ input: "Our company TechCorp is planning a new project" });
  await chain.call({ input: "The budget is $50,000" });
  await chain.call({ input: "We need to finish by December 2024" });
  
  const response = await chain.call({ input: "What do you know about our project?" });
  console.log("AI:", response.response);
  
  console.log("\nCustom memory contents:");
  console.log(await memory.loadMemoryVariables({}));
}

// 5. MEMORY WITH TOOLS - Memory + Tool calling
async function memoryWithToolsExample() {
  console.log("\n=== MEMORY WITH TOOLS ===");
  
  const memory = new BufferMemory();
  
  // Define tools
  const tools = [
    {
      name: "get_weather",
      description: "Get current weather for a location",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "City name" }
        },
        required: ["location"]
      }
    },
    {
      name: "calculate",
      description: "Perform mathematical calculations",
      parameters: {
        type: "object",
        properties: {
          expression: { type: "string", description: "Math expression" }
        },
        required: ["expression"]
      }
    }
  ];
  
  const modelWithTools = model.bindTools(tools);
  
  const prompt = PromptTemplate.fromTemplate(`
    You are a helpful assistant with access to tools.
    
    Conversation history:
    {history}
    
    Human: {input}
    AI:`);
  
  async function chatWithMemoryAndTools(input: string) {
    // Load memory
    const memoryVars = await memory.loadMemoryVariables({});
    const history = memoryVars.history || "";
    
    // Create prompt with memory
    const formattedPrompt = await prompt.format({
      history: history,
      input: input
    });
    
    // Get response
    const response = await modelWithTools.invoke(formattedPrompt);
    
    // Save to memory
    await memory.saveContext(
      { input: input },
      { output: response.content }
    );
    
    return response;
  }
  
  console.log("Starting conversation with memory and tools...");
  
  const response1 = await chatWithMemoryAndTools("What's the weather like in Tokyo?");
  console.log("AI:", response1.content);
  
  const response2 = await chatWithMemoryAndTools("Calculate 15 * 8 + 32");
  console.log("AI:", response2.content);
  
  const response3 = await chatWithMemoryAndTools("What did I ask you about earlier?");
  console.log("AI:", response3.content);
  
  console.log("\nMemory with tools contents:");
  console.log(await memory.loadMemoryVariables({}));
}

// Run all memory examples
async function runAllMemoryExamples() {
  try {
    await bufferMemoryExample();
    await windowMemoryExample();
    await summaryMemoryExample();
    await customMemoryExample();
    await memoryWithToolsExample();
  } catch (error) {
    console.error("Error:", error);
  }
}

runAllMemoryExamples();
