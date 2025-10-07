import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
import { PromptTemplate } from "@langchain/core/prompts";
import { Tool } from "@langchain/core/tools";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.1
});

// 1. BASIC AGENT - Simple tool calling
async function basicAgent() {
  console.log("=== BASIC AGENT ===");
  
  // Define tools
  const calculatorTool = new Tool({
    name: "calculator",
    description: "Perform mathematical calculations",
    parameters: z.object({
      expression: z.string().describe("Mathematical expression to evaluate")
    }),
    func: async ({ expression }) => {
      try {
        // Simple math evaluation (in production, use a proper math parser)
        const result = eval(expression);
        return `Result: ${result}`;
      } catch (error) {
        return `Error calculating: ${expression}`;
      }
    }
  });
  
  const weatherTool = new Tool({
    name: "get_weather",
    description: "Get current weather for a location",
    parameters: z.object({
      location: z.string().describe("City name")
    }),
    func: async ({ location }) => {
      // Simulate weather API call
      const weatherData = {
        "tokyo": "22°C, sunny",
        "london": "15°C, cloudy",
        "new york": "18°C, partly cloudy",
        "paris": "20°C, clear"
      };
      
      const weather = weatherData[location.toLowerCase() as keyof typeof weatherData] || "Weather data not available";
      return `Weather in ${location}: ${weather}`;
    }
  });
  
  const tools = [calculatorTool, weatherTool];
  
  // Create agent prompt
  const prompt = PromptTemplate.fromTemplate(`
    You are a helpful AI assistant with access to tools.
    
    Available tools:
    {tools}
    
    Use the following format:
    Question: the input question you must answer
    Thought: you should always think about what to do
    Action: the action to take, should be one of [{tool_names}]
    Action Input: the input to the action
    Observation: the result of the action
    ... (this Thought/Action/Action Input/Observation can repeat N times)
    Thought: I now know the final answer
    Final Answer: the final answer to the original input question
    
    Question: {input}
    Thought: {agent_scratchpad}
    `);
  
  // Create agent
  const agent = await createReactAgent({
    llm: model,
    tools: tools,
    prompt: prompt
  });
  
  // Create agent executor
  const agentExecutor = new AgentExecutor({
    agent: agent,
    tools: tools,
    verbose: true,
    maxIterations: 3
  });
  
  // Test the agent
  const queries = [
    "What's the weather in Tokyo?",
    "Calculate 15 * 8 + 32",
    "What's the weather in London and calculate 20% of 150?"
  ];
  
  for (const query of queries) {
    console.log(`\nQuestion: ${query}`);
    const result = await agentExecutor.invoke({ input: query });
    console.log(`Answer: ${result.output}`);
  }
}

// 2. ADVANCED AGENT - Multiple tools with complex reasoning
async function advancedAgent() {
  console.log("\n=== ADVANCED AGENT ===");
  
  // Database simulation
  const userDatabase = {
    "john": { name: "John", age: 30, city: "Tokyo", salary: 50000 },
    "sarah": { name: "Sarah", age: 25, city: "London", salary: 45000 },
    "mike": { name: "Mike", age: 35, city: "New York", salary: 60000 }
  };
  
  const getUserTool = new Tool({
    name: "get_user",
    description: "Get user information from database",
    parameters: z.object({
      username: z.string().describe("Username to look up")
    }),
    func: async ({ username }) => {
      const user = userDatabase[username.toLowerCase() as keyof typeof userDatabase];
      if (user) {
        return `User: ${user.name}, Age: ${user.age}, City: ${user.city}, Salary: $${user.salary}`;
      }
      return `User ${username} not found`;
    }
  });
  
  const calculateTaxTool = new Tool({
    name: "calculate_tax",
    description: "Calculate tax based on salary",
    parameters: z.object({
      salary: z.number().describe("Annual salary")
    }),
    func: async ({ salary }) => {
      const taxRate = salary > 50000 ? 0.25 : 0.20;
      const tax = salary * taxRate;
      return `Tax calculation: Salary $${salary}, Tax Rate ${taxRate * 100}%, Tax Amount $${tax}`;
    }
  });
  
  const sendEmailTool = new Tool({
    name: "send_email",
    description: "Send email to user",
    parameters: z.object({
      recipient: z.string().describe("Email recipient"),
      subject: z.string().describe("Email subject"),
      message: z.string().describe("Email message")
    }),
    func: async ({ recipient, subject, message }) => {
      return `Email sent to ${recipient} with subject "${subject}" and message "${message}"`;
    }
  });
  
  const tools = [getUserTool, calculateTaxTool, sendEmailTool];
  
  const prompt = PromptTemplate.fromTemplate(`
    You are a business AI assistant with access to user data and business tools.
    
    Available tools:
    {tools}
    
    Instructions:
    1. Always think step by step
    2. Use tools when you need specific information
    3. Provide comprehensive answers
    4. Be helpful and professional
    
    Question: {input}
    Thought: {agent_scratchpad}
    `);
  
  const agent = await createReactAgent({
    llm: model,
    tools: tools,
    prompt: prompt
  });
  
  const agentExecutor = new AgentExecutor({
    agent: agent,
    tools: tools,
    verbose: true,
    maxIterations: 5
  });
  
  const query = "Get information about John, calculate his tax, and send him an email about his tax calculation";
  console.log(`\nQuestion: ${query}`);
  
  const result = await agentExecutor.invoke({ input: query });
  console.log(`Answer: ${result.output}`);
}

// 3. SPECIALIZED AGENT - Code review agent
async function codeReviewAgent() {
  console.log("\n=== CODE REVIEW AGENT ===");
  
  const analyzeCodeTool = new Tool({
    name: "analyze_code",
    description: "Analyze code for issues and improvements",
    parameters: z.object({
      code: z.string().describe("Code to analyze"),
      language: z.string().describe("Programming language")
    }),
    func: async ({ code, language }) => {
      // Simulate code analysis
      const issues = [];
      const improvements = [];
      
      if (code.includes("var ")) {
        issues.push("Use 'let' or 'const' instead of 'var'");
      }
      
      if (code.includes("== ")) {
        issues.push("Use strict equality '===' instead of '=='");
      }
      
      if (!code.includes("function") && !code.includes("=>")) {
        improvements.push("Consider breaking down into smaller functions");
      }
      
      if (code.length > 100) {
        improvements.push("Consider splitting into multiple functions for better readability");
      }
      
      return `Code Analysis for ${language}:
      Issues: ${issues.length > 0 ? issues.join(', ') : 'No issues found'}
      Improvements: ${improvements.length > 0 ? improvements.join(', ') : 'No improvements suggested'}`;
    }
  });
  
  const generateTestsTool = new Tool({
    name: "generate_tests",
    description: "Generate unit tests for code",
    parameters: z.object({
      code: z.string().describe("Code to generate tests for"),
      language: z.string().describe("Programming language")
    }),
    func: async ({ code, language }) => {
      return `Generated ${language} tests:
      - Test case 1: Normal operation
      - Test case 2: Edge cases
      - Test case 3: Error handling
      - Test case 4: Performance validation`;
    }
  });
  
  const suggestDocumentationTool = new Tool({
    name: "suggest_documentation",
    description: "Suggest documentation for code",
    parameters: z.object({
      code: z.string().describe("Code to document"),
      language: z.string().describe("Programming language")
    }),
    func: async ({ code, language }) => {
      return `Documentation suggestions for ${language}:
      - Add JSDoc comments for functions
      - Include parameter descriptions
      - Add return type documentation
      - Include usage examples`;
    }
  });
  
  const tools = [analyzeCodeTool, generateTestsTool, suggestDocumentationTool];
  
  const prompt = PromptTemplate.fromTemplate(`
    You are an expert code reviewer AI assistant.
    
    Available tools:
    {tools}
    
    Your task is to provide comprehensive code reviews including:
    1. Code analysis for issues and improvements
    2. Test generation suggestions
    3. Documentation recommendations
    
    Question: {input}
    Thought: {agent_scratchpad}
    `);
  
  const agent = await createReactAgent({
    llm: model,
    tools: tools,
    prompt: prompt
  });
  
  const agentExecutor = new AgentExecutor({
    agent: agent,
    tools: tools,
    verbose: true,
    maxIterations: 4
  });
  
  const codeToReview = `
    function calculateTotal(items) {
      var total = 0;
      for (var i = 0; i < items.length; i++) {
        total += items[i].price * items[i].quantity;
      }
      return total;
    }
  `;
  
  const query = `Please review this JavaScript code: ${codeToReview}`;
  console.log(`\nQuestion: ${query}`);
  
  const result = await agentExecutor.invoke({ input: query });
  console.log(`Answer: ${result.output}`);
}

// 4. MULTI-AGENT SYSTEM - Agents working together
async function multiAgentSystem() {
  console.log("\n=== MULTI-AGENT SYSTEM ===");
  
  // Research Agent
  const researchTool = new Tool({
    name: "research_topic",
    description: "Research a topic and provide information",
    parameters: z.object({
      topic: z.string().describe("Topic to research")
    }),
    func: async ({ topic }) => {
      const researchData = {
        "artificial intelligence": "AI is intelligence demonstrated by machines, including machine learning, deep learning, and neural networks.",
        "machine learning": "ML is a subset of AI that focuses on algorithms that can learn from data without being explicitly programmed.",
        "deep learning": "Deep learning uses neural networks with multiple layers to model complex patterns in data."
      };
      
      return researchData[topic.toLowerCase() as keyof typeof researchData] || "Research data not available";
    }
  });
  
  // Writing Agent
  const writingTool = new Tool({
    name: "write_content",
    description: "Write content based on research",
    parameters: z.object({
      topic: z.string().describe("Topic to write about"),
      research: z.string().describe("Research information"),
      format: z.string().describe("Content format (blog, article, summary)")
    }),
    func: async ({ topic, research, format }) => {
      return `Written ${format} about ${topic}:
      
      Introduction: ${topic} is a fascinating field of study.
      
      Main Content: ${research}
      
      Conclusion: This overview provides a foundation for understanding ${topic}.
      
      Word count: Approximately 150 words`;
    }
  });
  
  // Editing Agent
  const editingTool = new Tool({
    name: "edit_content",
    description: "Edit and improve content",
    parameters: z.object({
      content: z.string().describe("Content to edit"),
      improvements: z.string().describe("Type of improvements needed")
    }),
    func: async ({ content, improvements }) => {
      return `Edited content with ${improvements}:
      
      ${content}
      
      Improvements made:
      - Enhanced readability
      - Improved structure
      - Added clarity
      - Fixed grammar issues`;
    }
  });
  
  // Create specialized agents
  const researchAgent = await createReactAgent({
    llm: model,
    tools: [researchTool],
    prompt: PromptTemplate.fromTemplate(`
      You are a research agent. Your job is to gather information about topics.
      
      Question: {input}
      Thought: {agent_scratchpad}
      `)
  });
  
  const writingAgent = await createReactAgent({
    llm: model,
    tools: [writingTool],
    prompt: PromptTemplate.fromTemplate(`
      You are a writing agent. Your job is to create content based on research.
      
      Question: {input}
      Thought: {agent_scratchpad}
      `)
  });
  
  const editingAgent = await createReactAgent({
    llm: model,
    tools: [editingTool],
    prompt: PromptTemplate.fromTemplate(`
      You are an editing agent. Your job is to improve and polish content.
      
      Question: {input}
      Thought: {agent_scratchpad}
      `)
  });
  
  // Execute multi-agent workflow
  const topic = "artificial intelligence";
  
  console.log(`\nMulti-agent workflow for topic: ${topic}`);
  
  // Step 1: Research
  console.log("\n--- Research Agent ---");
  const researchExecutor = new AgentExecutor({
    agent: researchAgent,
    tools: [researchTool],
    verbose: false
  });
  
  const researchResult = await researchExecutor.invoke({ 
    input: `Research information about ${topic}` 
  });
  console.log(`Research: ${researchResult.output}`);
  
  // Step 2: Writing
  console.log("\n--- Writing Agent ---");
  const writingExecutor = new AgentExecutor({
    agent: writingAgent,
    tools: [writingTool],
    verbose: false
  });
  
  const writingResult = await writingExecutor.invoke({ 
    input: `Write a blog post about ${topic} using this research: ${researchResult.output}` 
  });
  console.log(`Writing: ${writingResult.output}`);
  
  // Step 3: Editing
  console.log("\n--- Editing Agent ---");
  const editingExecutor = new AgentExecutor({
    agent: editingAgent,
    tools: [editingTool],
    verbose: false
  });
  
  const editingResult = await editingExecutor.invoke({ 
    input: `Edit and improve this content: ${writingResult.output}` 
  });
  console.log(`Final Result: ${editingResult.output}`);
}

// 5. AGENT WITH MEMORY - Persistent conversation
async function agentWithMemory() {
  console.log("\n=== AGENT WITH MEMORY ===");
  
  const memoryTool = new Tool({
    name: "save_to_memory",
    description: "Save information to memory for later use",
    parameters: z.object({
      key: z.string().describe("Memory key"),
      value: z.string().describe("Value to store")
    }),
    func: async ({ key, value }) => {
      // In production, use proper memory storage
      return `Saved to memory: ${key} = ${value}`;
    }
  });
  
  const recallTool = new Tool({
    name: "recall_from_memory",
    description: "Recall information from memory",
    parameters: z.object({
      key: z.string().describe("Memory key to recall")
    }),
    func: async ({ key }) => {
      // Simulate memory recall
      const memory = {
        "user_preference": "User prefers detailed explanations",
        "last_topic": "artificial intelligence",
        "user_name": "John"
      };
      
      return memory[key as keyof typeof memory] || "Memory not found";
    }
  });
  
  const tools = [memoryTool, recallTool];
  
  const prompt = PromptTemplate.fromTemplate(`
    You are a helpful AI assistant with memory capabilities.
    
    Available tools:
    {tools}
    
    Instructions:
    1. Remember important information about the user
    2. Use memory to provide personalized responses
    3. Save new information for future reference
    
    Question: {input}
    Thought: {agent_scratchpad}
    `);
  
  const agent = await createReactAgent({
    llm: model,
    tools: tools,
    prompt: prompt
  });
  
  const agentExecutor = new AgentExecutor({
    agent: agent,
    tools: tools,
    verbose: true,
    maxIterations: 3
  });
  
  const queries = [
    "My name is John and I'm interested in AI",
    "What do you know about me?",
    "I prefer detailed explanations",
    "Can you help me with AI concepts?"
  ];
  
  for (const query of queries) {
    console.log(`\nQuestion: ${query}`);
    const result = await agentExecutor.invoke({ input: query });
    console.log(`Answer: ${result.output}`);
  }
}

// Run all agent examples
async function runAllAgentExamples() {
  try {
    await basicAgent();
    await advancedAgent();
    await codeReviewAgent();
    await multiAgentSystem();
    await agentWithMemory();
  } catch (error) {
    console.error("Error:", error);
  }
}

runAllAgentExamples();
