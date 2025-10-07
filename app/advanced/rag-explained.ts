import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.3
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004"
});

// RAG EXPLANATION - Step by step
async function ragExplanation() {
  console.log("=== RAG (RETRIEVAL-AUGMENTED GENERATION) EXPLANATION ===");
  
  console.log("\nWhat is RAG?");
  console.log("RAG = Retrieval + Augmented + Generation");
  console.log("1. RETRIEVAL: Find relevant information from documents");
  console.log("2. AUGMENTED: Add that information to your prompt");
  console.log("3. GENERATION: AI generates answer using the retrieved info");
  
  console.log("\nWhy use RAG?");
  console.log("❌ Without RAG: AI only knows what it was trained on");
  console.log("✅ With RAG: AI can answer questions about YOUR documents");
  
  console.log("\nExample:");
  console.log("Question: 'What is our company's refund policy?'");
  console.log("Without RAG: 'I don't know your company's policy'");
  console.log("With RAG: 'According to your policy document, refunds are allowed within 30 days...'");
}

// BASIC RAG - Step by step process
async function basicRAGExample() {
  console.log("\n=== BASIC RAG STEP-BY-STEP ===");
  
  // Step 1: Prepare documents
  console.log("Step 1: Preparing documents...");
  const documents = [
    new Document({
      pageContent: "Artificial Intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals.",
      metadata: { source: "ai_basics.txt", topic: "definition" }
    }),
    new Document({
      pageContent: "Machine Learning is a subset of AI that focuses on algorithms that can learn from data without being explicitly programmed.",
      metadata: { source: "ml_basics.txt", topic: "machine_learning" }
    }),
    new Document({
      pageContent: "Deep Learning uses neural networks with multiple layers to model and understand complex patterns in data.",
      metadata: { source: "dl_basics.txt", topic: "deep_learning" }
    }),
    new Document({
      pageContent: "Natural Language Processing (NLP) enables computers to understand, interpret, and generate human language.",
      metadata: { source: "nlp_basics.txt", topic: "nlp" }
    })
  ];
  
  console.log(`Created ${documents.length} documents`);
  
  // Step 2: Split documents into chunks
  console.log("\nStep 2: Splitting documents into chunks...");
  console.log("Why split? AI models have token limits, so we break large documents into smaller pieces.");
  
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,  // Each chunk has max 100 characters
    chunkOverlap: 20 // Chunks overlap by 20 characters for context
  });
  
  const splits = await textSplitter.splitDocuments(documents);
  console.log(`Split documents into ${splits.length} chunks`);
  
  // Show what chunks look like
  console.log("\nExample chunks:");
  splits.slice(0, 2).forEach((chunk, index) => {
    console.log(`Chunk ${index + 1}: "${chunk.pageContent}"`);
  });
  
  // Step 3: Create vector store (semantic search)
  console.log("\nStep 3: Creating vector store...");
  console.log("What is a vector store? It converts text into numbers (embeddings) for semantic search.");
  console.log("Similar texts get similar numbers, so we can find relevant information.");
  
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  console.log("Vector store created with embeddings");
  
  // Step 4: Create retriever
  console.log("\nStep 4: Creating retriever...");
  console.log("Retriever finds the most relevant chunks for a question.");
  
  const retriever = vectorStore.asRetriever({ k: 2 }); // Get top 2 most relevant chunks
  console.log("Retriever configured to return top 2 relevant chunks");
  
  // Step 5: Test retrieval
  console.log("\nStep 5: Testing retrieval...");
  const query = "What is machine learning?";
  console.log(`Query: "${query}"`);
  
  const relevantDocs = await retriever.getRelevantDocuments(query);
  console.log(`Found ${relevantDocs.length} relevant documents:`);
  
  relevantDocs.forEach((doc, index) => {
    console.log(`${index + 1}. "${doc.pageContent}" (from ${doc.metadata.source})`);
  });
  
  // Step 6: Create RAG chain
  console.log("\nStep 6: Creating RAG chain...");
  console.log("RAG chain combines retrieval + generation:");
  console.log("1. Retrieve relevant documents");
  console.log("2. Add them to the prompt");
  console.log("3. Generate answer using the documents");
  
  const qaPrompt = PromptTemplate.fromTemplate(`
    Use the following pieces of context to answer the question at the end.
    If you don't know the answer based on the context, just say that you don't know.
    
    Context:
    {context}
    
    Question: {question}
    
    Answer:`);
  
  const qaChain = RetrievalQAChain.fromLLM(model, retriever, {
    prompt: qaPrompt,
    returnSourceDocuments: true
  });
  
  console.log("RAG chain created");
  
  // Step 7: Test RAG system
  console.log("\nStep 7: Testing RAG system...");
  
  const testQueries = [
    "What is artificial intelligence?",
    "How does machine learning work?",
    "What is deep learning?",
    "Tell me about natural language processing"
  ];
  
  for (const query of testQueries) {
    console.log(`\n--- Query: "${query}" ---`);
    const result = await qaChain.call({ query });
    console.log(`Answer: ${result.text}`);
    console.log(`Sources: ${result.sourceDocuments.map(doc => doc.metadata.source).join(', ')}`);
  }
}

// RAG WITH FILTERING - Category-based retrieval
async function ragWithFilteringExample() {
  console.log("\n=== RAG WITH FILTERING ===");
  
  console.log("Sometimes you want to search only in specific categories.");
  console.log("Example: Search only in 'programming' documents, not 'business' documents.");
  
  // Step 1: Create documents with categories
  console.log("\nStep 1: Creating documents with categories...");
  const documents = [
    new Document({
      pageContent: "Python is a high-level programming language known for its simplicity and readability.",
      metadata: { source: "python.txt", category: "programming", difficulty: "beginner" }
    }),
    new Document({
      pageContent: "JavaScript is essential for web development and can run on both client and server.",
      metadata: { source: "javascript.txt", category: "programming", difficulty: "intermediate" }
    }),
    new Document({
      pageContent: "Machine Learning algorithms can be supervised, unsupervised, or reinforcement learning.",
      metadata: { source: "ml_algorithms.txt", category: "ai", difficulty: "intermediate" }
    }),
    new Document({
      pageContent: "Deep Learning neural networks require significant computational resources and large datasets.",
      metadata: { source: "deep_learning.txt", category: "ai", difficulty: "advanced" }
    }),
    new Document({
      pageContent: "Marketing strategies should focus on customer needs and market trends.",
      metadata: { source: "marketing.txt", category: "business", difficulty: "beginner" }
    })
  ];
  
  // Step 2: Create vector store
  console.log("Step 2: Creating vector store...");
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 150,
    chunkOverlap: 30
  });
  
  const splits = await textSplitter.splitDocuments(documents);
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  
  // Step 3: Create filtered retrievers
  console.log("Step 3: Creating filtered retrievers...");
  
  const programmingRetriever = vectorStore.asRetriever({
    k: 2,
    filter: { category: "programming" }
  });
  
  const aiRetriever = vectorStore.asRetriever({
    k: 2,
    filter: { category: "ai" }
  });
  
  const beginnerRetriever = vectorStore.asRetriever({
    k: 2,
    filter: { difficulty: "beginner" }
  });
  
  console.log("Created retrievers for different categories");
  
  // Step 4: Test filtered retrieval
  console.log("\nStep 4: Testing filtered retrieval...");
  const query = "What should I learn for programming?";
  console.log(`Query: "${query}"`);
  
  console.log("\n--- Programming Results ---");
  const programmingDocs = await programmingRetriever.getRelevantDocuments(query);
  programmingDocs.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.metadata.source} (${doc.metadata.difficulty})`);
    console.log(`   ${doc.pageContent}`);
  });
  
  console.log("\n--- AI Results ---");
  const aiDocs = await aiRetriever.getRelevantDocuments(query);
  aiDocs.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.metadata.source} (${doc.metadata.difficulty})`);
    console.log(`   ${doc.pageContent}`);
  });
  
  console.log("\n--- Beginner Results ---");
  const beginnerDocs = await beginnerRetriever.getRelevantDocuments(query);
  beginnerDocs.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.metadata.source} (${doc.metadata.category})`);
    console.log(`   ${doc.pageContent}`);
  });
}

// RAG WORKFLOW EXPLANATION
async function ragWorkflowExplanation() {
  console.log("\n=== RAG WORKFLOW EXPLANATION ===");
  
  console.log("Complete RAG workflow:");
  console.log("\n1. DOCUMENT PREPARATION:");
  console.log("   - Collect your documents (PDFs, text files, etc.)");
  console.log("   - Clean and format the text");
  console.log("   - Add metadata (source, category, etc.)");
  
  console.log("\n2. DOCUMENT CHUNKING:");
  console.log("   - Split large documents into smaller chunks");
  console.log("   - Each chunk should be meaningful but not too large");
  console.log("   - Add overlap between chunks for context");
  
  console.log("\n3. EMBEDDING GENERATION:");
  console.log("   - Convert each chunk into a vector (list of numbers)");
  console.log("   - Similar texts get similar vectors");
  console.log("   - Store vectors in a vector database");
  
  console.log("\n4. QUERY PROCESSING:");
  console.log("   - User asks a question");
  console.log("   - Convert question to a vector");
  console.log("   - Find most similar document chunks");
  
  console.log("\n5. CONTEXT AUGMENTATION:");
  console.log("   - Add retrieved chunks to the prompt");
  console.log("   - Tell AI to use only this information");
  console.log("   - Generate answer based on retrieved context");
  
  console.log("\n6. RESPONSE GENERATION:");
  console.log("   - AI generates answer using retrieved information");
  console.log("   - Include source citations");
  console.log("   - Provide accurate, up-to-date information");
  
  console.log("\nBenefits of RAG:");
  console.log("✅ AI can answer questions about YOUR documents");
  console.log("✅ Always up-to-date information");
  console.log("✅ Source citations for verification");
  console.log("✅ No need to retrain the AI model");
  console.log("✅ Cost-effective solution");
}

// Run all examples
async function runAllRAGExamples() {
  try {
    await ragExplanation();
    await basicRAGExample();
    await ragWithFilteringExample();
    await ragWorkflowExplanation();
  } catch (error) {
    console.error("Error:", error);
  }
}

runAllRAGExamples();
