import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0.3
});

async function multimodalExample() {
  console.log("=== MULTIMODAL PROCESSING EXAMPLE ===");
  console.log("This shows how to work with multiple types of content");
  console.log("Note: For actual multimodal processing, you need to provide");
  console.log("real image/audio data. This shows the structure and prompts.");
  console.log();

  try {
    // Example 1: Image + Text Analysis
    const prompt1 = `Analyze this image and answer questions about it. 
    If you can see text in the image, transcribe it.
    Describe the visual elements, colors, and composition.
    What is the mood or atmosphere of the image?
    
    Note: In real usage, you would provide actual image data here.`;

    console.log("1️⃣ Image + Text Analysis:");
    console.log("Prompt:", prompt1);
    console.log();
    
    const response1 = await model.invoke(prompt1);
    console.log("Analysis:", response1.content);
    console.log();

    // Example 2: Document Analysis (Text + Structure)
    const documentText = `
    CONFIDENTIAL REPORT
    Date: 2024-01-15
    Subject: Q4 Performance Analysis
    
    Executive Summary:
    Our Q4 performance exceeded expectations with a 15% increase in revenue.
    
    Key Metrics:
    - Revenue: $2.5M (+15%)
    - Customer Acquisition: 1,200 new customers
    - Churn Rate: 3.2% (target: <5%)
    
    Recommendations:
    1. Increase marketing budget by 20%
    2. Expand to European markets
    3. Invest in AI-powered customer support
    `;

    const prompt2 = `Analyze this business document and extract:
    1. Document type and purpose
    2. Key metrics and numbers
    3. Action items and recommendations
    4. Confidentiality level
    5. Create a summary for executives

    Document: ${documentText}`;

    console.log("2️⃣ Document Analysis:");
    console.log("Document:", documentText);
    console.log();
    
    const response2 = await model.invoke(prompt2);
    console.log("Analysis:", response2.content);
    console.log();

    // Example 3: Code + Documentation Analysis
    const codeSample = `
    function calculateTotal(items) {
      let total = 0;
      for (let item of items) {
        total += item.price * item.quantity;
      }
      return total;
    }
    `;

    const prompt3 = `Analyze this JavaScript code and provide:
    1. What the function does
    2. Potential issues or improvements
    3. Documentation comments
    4. Test cases
    5. Alternative implementations

    Code: ${codeSample}`;

    console.log("3️⃣ Code Analysis:");
    console.log("Code:", codeSample);
    console.log();
    
    const response3 = await model.invoke(prompt3);
    console.log("Analysis:", response3.content);
    console.log();

    // Example 4: Multi-step Analysis Pipeline
    const prompt4 = `Create a comprehensive analysis pipeline for processing user-generated content:

    1. Content Classification (text, image, video, audio)
    2. Moderation Rules (inappropriate content detection)
    3. Sentiment Analysis
    4. Topic Extraction
    5. Action Recommendations (approve, flag, reject)

    Provide a structured approach for each step.`;

    console.log("4️⃣ Multi-step Analysis Pipeline:");
    console.log("Prompt:", prompt4);
    console.log();
    
    const response4 = await model.invoke(prompt4);
    console.log("Pipeline:", response4.content);
    console.log();

    console.log("🔧 Real Multimodal Integration Example:");
    console.log(`
// Example of processing multiple content types:
async function processMultimodalContent(content) {
  let analysis = {};
  
  // Process text content
  if (content.text) {
    const textAnalysis = await model.invoke(\`
      Analyze this text content:
      - Sentiment
      - Key topics
      - Language quality
      - Potential issues
      
      Text: \${content.text}
    \`);
    analysis.text = textAnalysis.content;
  }
  
  // Process image content (if available)
  if (content.image) {
    const imageAnalysis = await model.invoke([
      {
        type: "text",
        text: "Analyze this image and describe what you see"
      },
      {
        type: "image_url",
        image_url: {
          url: content.image
        }
      }
    ]);
    analysis.image = imageAnalysis.content;
  }
  
  // Process audio transcript (if available)
  if (content.transcript) {
    const audioAnalysis = await model.invoke(\`
      Analyze this audio transcript:
      - Speaker identification
      - Key topics discussed
      - Sentiment analysis
      - Action items
      
      Transcript: \${content.transcript}
    \`);
    analysis.audio = audioAnalysis.content;
  }
  
  return analysis;
}
    `);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

multimodalExample();
