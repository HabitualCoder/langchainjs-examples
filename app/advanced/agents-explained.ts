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

// AGENTS EXPLANATION - Step by step
async function agentsExplanation() {
  console.log("=== AGENTS & TOOL CALLING EXPLANATION ===");
  
  console.log("\nWhat are Agents?");
  console.log("Agents are AI systems that can use tools to accomplish tasks.");
  console.log("Think of them as AI assistants that can:");
  console.log("- Use calculators");
  console.log("- Search the web");
  console.log("- Access databases");
  console.log("- Call APIs");
  console.log("- Make decisions about which tools to use");
  
  console.log("\nHow do Agents work?");
  console.log("1. User asks a question");
  console.log("2. Agent thinks: 'What tools do I need?'");
  console.log("3. Agent uses the tools");
  console.log("4. Agent combines results");
  console.log("5. Agent gives final answer");
  
  console.log("\nExample:");
  console.log("User: 'What's the weather in Tokyo and calculate 15% of 200?'");
  console.log("Agent: 'I need weather tool and calculator tool'");
  console.log("Agent: Uses weather tool → Gets weather data");
  console.log("Agent: Uses calculator tool → Gets 30");
  console.log("Agent: 'Weather in Tokyo is sunny, 22°C. 15% of 200 is 30.'");
}

// BASIC AGENT - Step by step
async function basicAgentExample() {
  console.log("\n=== BASIC AGENT STEP-BY-STEP ===");
  
  // Step 1: Create tools
  console.log("Step 1: Creating tools...");
  console.log("Tools are functions that the agent can call to get information or perform actions.");
  
  const calculatorTool = new Tool({
    name: "calculator",
    description: "Perform mathematical calculations",
    parameters: z.object({
      expression: z.string().describe("Mathematical expression to evaluate")
    }),
    func: async ({ expression }) => {
      try {
        console.log(`  Calculator tool: Calculating ${expression}`);
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
      console.log(`  Weather tool: Getting weather for ${location}`);
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
  console.log(`Created ${tools.length} tools: ${tools.map(t => t.name).join(', ')}`);
  
  // Step 2: Create agent prompt
  console.log("\nStep 2: Creating agent prompt...");
  console.log("The prompt tells the agent how to think and use tools.");
  
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
  
  console.log("Agent prompt created with reasoning format");
  
  // Step 3: Create agent
  console.log("\nStep 3: Creating agent...");
  console.log("The agent combines the AI model with tools and prompt.");
  
  const agent = await createReactAgent({
    llm: model,
    tools: tools,
    prompt: prompt
  });
  
  console.log("Agent created");
  
  // Step 4: Create agent executor
  console.log("\nStep 4: Creating agent executor...");
  console.log("The executor runs the agent and handles tool calling.");
  
  const agentExecutor = new AgentExecutor({
    agent: agent,
    tools: tools,
    verbose: true,  // Show the agent's thinking process
    maxIterations: 3  // Maximum number of tool calls
  });
  
  console.log("Agent executor created");
  
  // Step 5: Test the agent
  console.log("\nStep 5: Testing the agent...");
  
  const testQueries = [
    "What's the weather in Tokyo?",
    "Calculate 15 * 8 + 32",
    "What's the weather in London and calculate 20% of 150?"
  ];
  
  for (const query of testQueries) {
    console.log(`\n--- Testing: "${query}" ---`);
    const result = await agentExecutor.invoke({ input: query });
    console.log(`Final Answer: ${result.output}`);
  }
}

// MULTI-STEP AGENT - Complex reasoning
async function multiStepAgentExample() {
  console.log("\n=== MULTI-STEP AGENT ===");
  
  console.log("This agent can perform complex multi-step tasks.");
  console.log("Example: Get user info, calculate tax, send email");
  
  // Step 1: Create database simulation
  console.log("\nStep 1: Creating database simulation...");
  const userDatabase = {
    "john": { name: "John", age: 30, city: "Tokyo", salary: 50000 },
    "sarah": { name: "Sarah", age: 25, city: "London", salary: 45000 },
    "mike": { name: "Mike", age: 35, city: "New York", salary: 60000 }
  };
  
  // Step 2: Create tools
  console.log("Step 2: Creating tools...");
  
  const getUserTool = new Tool({
    name: "get_user",
    description: "Get user information from database",
    parameters: z.object({
      username: z.string().describe("Username to look up")
    }),
    func: async ({ username }) => {
      console.log(`  Database tool: Looking up user ${username}`);
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
      console.log(`  Tax tool: Calculating tax for salary $${salary}`);
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
      console.log(`  Email tool: Sending email to ${recipient}`);
      return `Email sent to ${recipient} with subject "${subject}" and message "${message}"`;
    }
  });
  
  const tools = [getUserTool, calculateTaxTool, sendEmailTool];
  console.log(`Created ${tools.length} tools: ${tools.map(t => t.name).join(', ')}`);
  
  // Step 3: Create agent
  console.log("\nStep 3: Creating multi-step agent...");
  
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
  
  // Step 4: Test complex task
  console.log("\nStep 4: Testing complex multi-step task...");
  
  const complexQuery = "Get information about John, calculate his tax, and send him an email about his tax calculation";
  console.log(`Complex Query: "${complexQuery}"`);
  
  const result = await agentExecutor.invoke({ input: complexQuery });
  console.log(`Final Result: ${result.output}`);
}

// AGENT WORKFLOW EXPLANATION
async function agentWorkflowExplanation() {
  console.log("\n=== AGENT WORKFLOW EXPLANATION ===");
  
  console.log("How agents work internally:");
  
  console.log("\n1. USER INPUT:");
  console.log("   User asks a question or gives a task");
  
  console.log("\n2. AGENT THINKING:");
  console.log("   Agent analyzes the request");
  console.log("   Agent decides which tools to use");
  console.log("   Agent plans the sequence of actions");
  
  console.log("\n3. TOOL SELECTION:");
  console.log("   Agent chooses the appropriate tool");
  console.log("   Agent formats the input for the tool");
  console.log("   Agent calls the tool");
  
  console.log("\n4. TOOL EXECUTION:");
  console.log("   Tool performs its function");
  console.log("   Tool returns results to agent");
  console.log("   Agent receives the output");
  
  console.log("\n5. RESULT PROCESSING:");
  console.log("   Agent analyzes the tool output");
  console.log("   Agent decides if more tools are needed");
  console.log("   Agent combines results from multiple tools");
  
  console.log("\n6. FINAL RESPONSE:");
  console.log("   Agent generates final answer");
  console.log("   Agent provides comprehensive response");
  console.log("   Agent includes source information");
  
  console.log("\nAgent vs Regular AI:");
  console.log("❌ Regular AI: Can only generate text");
  console.log("✅ Agent AI: Can use tools, access data, perform actions");
  
  console.log("\nReal-world Agent Examples:");
  console.log("🤖 Customer Service Agent: Can check orders, process refunds, send emails");
  console.log("🤖 Business Analyst Agent: Can analyze data, generate reports, send notifications");
  console.log("🤖 Code Review Agent: Can analyze code, run tests, create documentation");
  console.log("🤖 Personal Assistant Agent: Can schedule meetings, send messages, search information");
}

// Run all examples
async function runAllAgentExamples() {
  try {
    await agentsExplanation();
    await basicAgentExample();
    await multiStepAgentExample();
    await agentWorkflowExplanation();
  } catch (error) {
    console.error("Error:", error);
  }
}

runAllAgentExamples();
