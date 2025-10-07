import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BufferMemory, WindowMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.7
});

// MEMORY EXPLANATION - Step by step
async function memoryExplanation() {
  console.log("=== MEMORY & STATE MANAGEMENT EXPLANATION ===");
  
  // What is Memory?
  console.log("\nWhat is Memory?");
  console.log("Memory allows AI to remember previous conversations.");
  console.log("Without memory: Each question is independent");
  console.log("With memory: AI remembers context from previous messages");
  
  // Example 1: Without Memory
  console.log("\n--- Example 1: Without Memory ---");
  console.log("Question 1: What's my name?");
  console.log("AI: I don't know your name.");
  console.log("Question 2: What's my name?");
  console.log("AI: I don't know your name."); // Still doesn't know!
  
  // Example 2: With Memory
  console.log("\n--- Example 2: With Memory ---");
  console.log("Question 1: My name is John.");
  console.log("AI: Nice to meet you, John!");
  console.log("Question 2: What's my name?");
  console.log("AI: Your name is John!"); // Remembers!
}

// BUFFER MEMORY - Complete conversation history
async function bufferMemoryExample() {
  console.log("\n=== BUFFER MEMORY EXPLANATION ===");
  
  console.log("Buffer Memory stores ALL conversation history.");
  console.log("Pros: Remembers everything");
  console.log("Cons: Can get very long and expensive");
  
  // Step 1: Create memory
  console.log("\nStep 1: Creating buffer memory...");
  const memory = new BufferMemory();
  
  // Step 2: Create prompt template
  console.log("Step 2: Creating prompt template...");
  const prompt = PromptTemplate.fromTemplate(`
    The following is a friendly conversation between a human and an AI.
    
    Current conversation:
    {history}
    
    Human: {input}
    AI:`);
  
  // Step 3: Create conversation chain
  console.log("Step 3: Creating conversation chain...");
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: prompt
  });
  
  // Step 4: Have a conversation
  console.log("Step 4: Having a conversation...");
  
  console.log("\n--- Conversation with Buffer Memory ---");
  
  const response1 = await chain.call({ input: "Hi, my name is John. I'm a software engineer." });
  console.log("Human: Hi, my name is John. I'm a software engineer.");
  console.log("AI:", response1.response);
  
  const response2 = await chain.call({ input: "What's my name and profession?" });
  console.log("\nHuman: What's my name and profession?");
  console.log("AI:", response2.response);
  
  const response3 = await chain.call({ input: "What programming languages should I learn?" });
  console.log("\nHuman: What programming languages should I learn?");
  console.log("AI:", response3.response);
  
  // Step 5: Show memory contents
  console.log("\nStep 5: Memory contents:");
  const memoryVars = await memory.loadMemoryVariables({});
  console.log("Memory:", memoryVars.history);
}

// WINDOW MEMORY - Last N messages only
async function windowMemoryExample() {
  console.log("\n=== WINDOW MEMORY EXPLANATION ===");
  
  console.log("Window Memory stores only the last N messages.");
  console.log("Pros: Faster, cheaper, focused on recent context");
  console.log("Cons: Forgets older information");
  
  // Step 1: Create window memory (last 2 exchanges)
  console.log("\nStep 1: Creating window memory (last 2 messages)...");
  const memory = new WindowMemory({ k: 2 });
  
  // Step 2: Create conversation chain
  console.log("Step 2: Creating conversation chain...");
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
  
  // Step 3: Have a conversation
  console.log("Step 3: Having a conversation...");
  
  console.log("\n--- Conversation with Window Memory ---");
  
  await chain.call({ input: "I love pizza" });
  console.log("Human: I love pizza");
  
  await chain.call({ input: "My favorite color is blue" });
  console.log("Human: My favorite color is blue");
  
  await chain.call({ input: "I have a dog named Max" });
  console.log("Human: I have a dog named Max");
  
  const response = await chain.call({ input: "What do you know about me?" });
  console.log("\nHuman: What do you know about me?");
  console.log("AI:", response.response);
  
  // Step 4: Show memory contents
  console.log("\nStep 4: Memory contents:");
  const memoryVars = await memory.loadMemoryVariables({});
  console.log("Memory:", memoryVars.history);
  console.log("Note: Only remembers the last 2 messages!");
}

// CUSTOM MEMORY - Business context memory
async function customMemoryExample() {
  console.log("\n=== CUSTOM MEMORY EXPLANATION ===");
  
  console.log("Custom Memory allows you to store specific information.");
  console.log("Example: Remember business context, user preferences, etc.");
  
  // Step 1: Create custom memory class
  console.log("\nStep 1: Creating custom memory class...");
  
  class BusinessMemory extends BufferMemory {
    private businessContext: any = {};
    
    async saveContext(inputValues: any, outputValues: any) {
      // Save regular conversation
      await super.saveContext(inputValues, outputValues);
      
      // Extract and save business context
      const input = inputValues.input || inputValues.human || "";
      
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
      // Simple entity extraction
      const patterns = {
        company: /(?:company|business|organization)\s+(?:is\s+)?([A-Z][a-zA-Z\s]+)/i,
        budget: /(?:budget|cost|price)\s+(?:is\s+)?(\$?[\d,]+(?:\.[\d]{2})?)/i,
        timeline: /(?:timeline|deadline|by)\s+(?:is\s+)?([A-Za-z\s\d,]+)/i
      };
      
      const match = text.match(patterns[type as keyof typeof patterns]);
      return match ? match[1].trim() : "";
    }
  }
  
  // Step 2: Create memory instance
  console.log("Step 2: Creating memory instance...");
  const memory = new BusinessMemory();
  
  // Step 3: Create conversation chain
  console.log("Step 3: Creating conversation chain...");
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
  
  // Step 4: Have a business conversation
  console.log("Step 4: Having a business conversation...");
  
  console.log("\n--- Business Conversation with Custom Memory ---");
  
  await chain.call({ input: "Our company TechCorp is planning a new project" });
  console.log("Human: Our company TechCorp is planning a new project");
  
  await chain.call({ input: "The budget is $50,000" });
  console.log("Human: The budget is $50,000");
  
  await chain.call({ input: "We need to finish by December 2024" });
  console.log("Human: We need to finish by December 2024");
  
  const response = await chain.call({ input: "What do you know about our project?" });
  console.log("\nHuman: What do you know about our project?");
  console.log("AI:", response.response);
  
  // Step 5: Show memory contents
  console.log("\nStep 5: Memory contents:");
  const memoryVars = await memory.loadMemoryVariables({});
  console.log("Conversation:", memoryVars.history);
  console.log("Business Context:", memoryVars.business_context);
}

// MEMORY COMPARISON
async function memoryComparison() {
  console.log("\n=== MEMORY COMPARISON ===");
  
  console.log("Different memory types and when to use them:");
  console.log("\n1. Buffer Memory:");
  console.log("   - Stores ALL conversation history");
  console.log("   - Use for: Important conversations, legal/medical contexts");
  console.log("   - Pros: Complete context, accurate responses");
  console.log("   - Cons: Expensive, slow, can hit token limits");
  
  console.log("\n2. Window Memory:");
  console.log("   - Stores only last N messages");
  console.log("   - Use for: Casual chat, recent context matters most");
  console.log("   - Pros: Fast, cheap, focused");
  console.log("   - Cons: Forgets older information");
  
  console.log("\n3. Summary Memory:");
  console.log("   - Summarizes old conversations");
  console.log("   - Use for: Long conversations, important context");
  console.log("   - Pros: Keeps important info, manageable size");
  console.log("   - Cons: May lose specific details");
  
  console.log("\n4. Custom Memory:");
  console.log("   - Stores specific information");
  console.log("   - Use for: Business context, user preferences");
  console.log("   - Pros: Flexible, targeted storage");
  console.log("   - Cons: More complex to implement");
}

// Run all examples
async function runAllMemoryExamples() {
  try {
    await memoryExplanation();
    await bufferMemoryExample();
    await windowMemoryExample();
    await customMemoryExample();
    await memoryComparison();
  } catch (error) {
    console.error("Error:", error);
  }
}

runAllMemoryExamples();
