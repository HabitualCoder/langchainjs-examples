import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0.3
});

async function imageAnalysisExample() {
  console.log("=== IMAGE ANALYSIS EXAMPLE ===");
  console.log("This shows how to analyze images with Gemini");
  console.log("Note: You need to provide actual image data for this to work");
  console.log();

  try {
    // Example 1: Analyze image content
    const prompt1 = "Analyze this image and describe what you see in detail. Include colors, objects, composition, and any text visible.";
    
    console.log("1️⃣ Image Analysis Prompt:");
    console.log(prompt1);
    console.log();
    
    // Note: In real usage, you would provide actual image data
    console.log("To use this with actual images, you would:");
    console.log("- Load image file (PNG, JPEG, etc.)");
    console.log("- Convert to base64 or provide as buffer");
    console.log("- Send with the prompt to the model");
    console.log();

    // Example 2: Extract text from images (OCR)
    const prompt2 = "Extract all text from this image. If there's no text, say 'No text found'.";
    
    console.log("2️⃣ OCR Prompt:");
    console.log(prompt2);
    console.log();

    // Example 3: Image-based Q&A
    const prompt3 = "Answer questions about this image. What objects do you see? What colors are prominent? What is the mood or atmosphere?";
    
    console.log("3️⃣ Image Q&A Prompt:");
    console.log(prompt3);
    console.log();

    // Example 4: Image comparison
    const prompt4 = "Compare these two images. What are the similarities and differences?";
    
    console.log("4️⃣ Image Comparison Prompt:");
    console.log(prompt4);
    console.log();

    console.log("📝 Code Example for Real Image Analysis:");
    console.log(`
// Example of how to use with actual images:
import fs from 'fs';

async function analyzeRealImage(imagePath: string) {
  // Read image file
  const imageBuffer = fs.readFileSync(imagePath);
  
  // Convert to base64
  const base64Image = imageBuffer.toString('base64');
  
  // Create message with image
  const message = {
    role: "user",
    content: [
      {
        type: "text",
        text: "Analyze this image and describe what you see"
      },
      {
        type: "image_url",
        image_url: {
          url: \`data:image/jpeg;base64,\${base64Image}\`
        }
      }
    ]
  };
  
  const response = await model.invoke([message]);
  return response.content;
}
    `);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

imageAnalysisExample();
