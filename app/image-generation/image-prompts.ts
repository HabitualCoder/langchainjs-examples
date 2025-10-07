import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp", // Use experimental model for image generation
  temperature: 0.7
});

async function imageGenerationExample() {
  console.log("=== IMAGE GENERATION EXAMPLE ===");
  console.log("Note: Gemini 2.0 Flash doesn't directly generate images,");
  console.log("but it can analyze images and create detailed descriptions");
  console.log("that can be used with other image generation APIs.");
  console.log();

  try {
    // Example 1: Generate detailed image description
    const prompt1 = "Create a detailed description for an image generation AI. Describe a futuristic cityscape at sunset with flying cars and neon lights.";
    
    console.log("1️⃣ Generating detailed image description:");
    console.log("Prompt:", prompt1);
    console.log();
    
    const response1 = await model.invoke(prompt1);
    console.log("AI Description:", response1.content);
    console.log();

    // Example 2: Create prompt for DALL-E/Midjourney
    const prompt2 = "Create a detailed prompt that could be used with DALL-E or Midjourney to generate an image of a cyberpunk robot artist painting a digital masterpiece.";
    
    console.log("2️⃣ Creating image generation prompt:");
    console.log("Prompt:", prompt2);
    console.log();
    
    const response2 = await model.invoke(prompt2);
    console.log("Generated Prompt:", response2.content);
    console.log();

    // Example 3: Analyze and improve existing image descriptions
    const existingDescription = "A cat sitting on a table";
    const prompt3 = `Analyze this image description and create a much more detailed, artistic version: "${existingDescription}"`;
    
    console.log("3️⃣ Improving image description:");
    console.log("Original:", existingDescription);
    console.log();
    
    const response3 = await model.invoke(prompt3);
    console.log("Improved Description:", response3.content);
    console.log();

    console.log("💡 Note: For actual image generation, you would:");
    console.log("1. Use the AI-generated descriptions above");
    console.log("2. Send them to image generation APIs like:");
    console.log("   - OpenAI DALL-E");
    console.log("   - Midjourney");
    console.log("   - Stable Diffusion");
    console.log("   - Google Imagen");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

imageGenerationExample();
