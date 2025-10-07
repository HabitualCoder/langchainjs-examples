import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

// Define tools that the AI can use
const tools = [
  {
    name: "get_weather",
    description: "Get the current weather for a specific location",
    parameters: z.object({
      location: z.string().describe("The city and country, e.g. 'London, UK'"),
      unit: z.enum(["celsius", "fahrenheit"]).describe("Temperature unit")
    })
  },
  {
    name: "calculate",
    description: "Perform mathematical calculations",
    parameters: z.object({
      expression: z.string().describe("Mathematical expression to evaluate, e.g. '2 + 2 * 3'")
    })
  },
  {
    name: "search_wikipedia",
    description: "Search for information on Wikipedia",
    parameters: z.object({
      query: z.string().describe("Search query for Wikipedia")
    })
  }
];

// Bind tools to the model
const modelWithTools = model.bindTools(tools);

// Tool execution functions
async function executeTool(toolName: string, args: any) {
  switch (toolName) {
    case "get_weather":
      // Simulate weather API call
      return `Weather in ${args.location}: 22°C, sunny with light clouds`;
    
    case "calculate":
      try {
        // Simple math evaluation (in real app, use a proper math parser)
        const result = eval(args.expression);
        return `Result: ${result}`;
      } catch (error) {
        return `Error calculating: ${args.expression}`;
      }
    
    case "search_wikipedia":
      // Simulate Wikipedia search
      return `Wikipedia search for "${args.query}": Found information about ${args.query} including historical background, key facts, and current developments.`;
    
    default:
      return `Unknown tool: ${toolName}`;
  }
}

async function toolCallingExample() {
  console.log("=== TOOL CALLING EXAMPLE ===");
  console.log("This demonstrates how AI can use external tools");
  console.log();

  const prompt = "What's the weather like in Tokyo? Also calculate 15 * 8 + 32, and search for information about artificial intelligence.";
  
  try {
    const response = await modelWithTools.invoke(prompt);
    
    console.log("AI Response:");
    console.log(response.content);
    console.log();
    
    // Check if AI wants to use tools
    if (response.tool_calls && response.tool_calls.length > 0) {
      console.log("AI wants to use tools:");
      
      for (const toolCall of response.tool_calls) {
        console.log(`\n🔧 Tool: ${toolCall.name}`);
        console.log(`📝 Arguments:`, toolCall.args);
        
        // Execute the tool
        const toolResult = await executeTool(toolCall.name, toolCall.args);
        console.log(`✅ Result: ${toolResult}`);
        
        // Send tool result back to AI for final response
        const finalResponse = await modelWithTools.invoke([
          { role: "user", content: prompt },
          { role: "assistant", content: response.content, tool_calls: response.tool_calls },
          { role: "tool", content: toolResult, tool_call_id: toolCall.id }
        ]);
        
        console.log(`\n🤖 Final AI Response: ${finalResponse.content}`);
      }
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

toolCallingExample();
