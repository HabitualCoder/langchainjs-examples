import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

// Advanced tool calling with conversation flow
const advancedTools = [
  {
    name: "create_todo",
    description: "Create a new todo item",
    parameters: z.object({
      title: z.string().describe("Title of the todo"),
      priority: z.enum(["low", "medium", "high"]).describe("Priority level"),
      dueDate: z.string().optional().describe("Due date in YYYY-MM-DD format")
    })
  },
  {
    name: "get_todos",
    description: "Get all todo items",
    parameters: z.object({
      filter: z.enum(["all", "pending", "completed"]).optional().describe("Filter todos by status")
    })
  },
  {
    name: "complete_todo",
    description: "Mark a todo as completed",
    parameters: z.object({
      todoId: z.string().describe("ID of the todo to complete")
    })
  }
];

// Simple in-memory todo storage
let todos: Array<{id: string, title: string, priority: string, dueDate?: string, completed: boolean}> = [];

const modelWithAdvancedTools = model.bindTools(advancedTools);

async function executeAdvancedTool(toolName: string, args: any) {
  switch (toolName) {
    case "create_todo":
      const newTodo = {
        id: `todo_${Date.now()}`,
        title: args.title,
        priority: args.priority,
        dueDate: args.dueDate,
        completed: false
      };
      todos.push(newTodo);
      return `Created todo: "${args.title}" with ${args.priority} priority`;
    
    case "get_todos":
      let filteredTodos = todos;
      if (args.filter === "pending") {
        filteredTodos = todos.filter(t => !t.completed);
      } else if (args.filter === "completed") {
        filteredTodos = todos.filter(t => t.completed);
      }
      
      if (filteredTodos.length === 0) {
        return "No todos found";
      }
      
      return filteredTodos.map(t => 
        `- ${t.title} (${t.priority} priority) ${t.completed ? '✅' : '⏳'}`
      ).join('\n');
    
    case "complete_todo":
      const todo = todos.find(t => t.id === args.todoId);
      if (todo) {
        todo.completed = true;
        return `Completed todo: "${todo.title}"`;
      }
      return `Todo with ID ${args.todoId} not found`;
    
    default:
      return `Unknown tool: ${toolName}`;
  }
}

async function advancedToolCallingExample() {
  console.log("=== ADVANCED TOOL CALLING EXAMPLE ===");
  console.log("This shows a conversational AI assistant with persistent state");
  console.log();

  const conversation = [
    "Create a todo to buy groceries with high priority",
    "Create another todo to finish the project report with medium priority due tomorrow",
    "Show me all my pending todos",
    "Complete the groceries todo"
  ];

  let messages: any[] = [];

  for (const userMessage of conversation) {
    console.log(`\n👤 User: ${userMessage}`);
    
    try {
      const response = await modelWithAdvancedTools.invoke([
        ...messages,
        { role: "user", content: userMessage }
      ]);
      
      console.log(`🤖 AI: ${response.content}`);
      
      // Add to conversation history
      messages.push({ role: "user", content: userMessage });
      messages.push({ role: "assistant", content: response.content });
      
      // Handle tool calls
      if (response.tool_calls && response.tool_calls.length > 0) {
        for (const toolCall of response.tool_calls) {
          console.log(`🔧 Using tool: ${toolCall.name}`);
          
          const toolResult = await executeAdvancedTool(toolCall.name, toolCall.args);
          console.log(`✅ Tool result: ${toolResult}`);
          
          // Add tool call and result to conversation
          messages.push({
            role: "assistant",
            content: response.content,
            tool_calls: response.tool_calls
          });
          messages.push({
            role: "tool",
            content: toolResult,
            tool_call_id: toolCall.id
          });
          
          // Get final response after tool execution
          const finalResponse = await modelWithAdvancedTools.invoke(messages);
          console.log(`🤖 Final AI: ${finalResponse.content}`);
          
          // Update conversation history
          messages[messages.length - 2] = {
            role: "assistant",
            content: finalResponse.content
          };
        }
      }
      
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

advancedToolCallingExample();
