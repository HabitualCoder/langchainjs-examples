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

// 1. BASIC RAG - Document Q&A
async function basicRAG() {
  console.log("=== BASIC RAG SYSTEM ===");
  
  // Sample documents
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
    }),
    new Document({
      pageContent: "Computer Vision allows machines to interpret and understand visual information from the world.",
      metadata: { source: "cv_basics.txt", topic: "computer_vision" }
    })
  ];
  
  // Split documents into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20
  });
  
  const splits = await textSplitter.splitDocuments(documents);
  console.log(`Split documents into ${splits.length} chunks`);
  
  // Create vector store
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  
  // Create retriever
  const retriever = vectorStore.asRetriever({ k: 2 });
  
  // Create RAG chain
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
  
  // Test queries
  const queries = [
    "What is artificial intelligence?",
    "How does machine learning work?",
    "What is the difference between AI and ML?",
    "Tell me about computer vision"
  ];
  
  for (const query of queries) {
    console.log(`\nQuestion: ${query}`);
    const result = await qaChain.call({ query });
    console.log(`Answer: ${result.text}`);
    console.log(`Sources: ${result.sourceDocuments.map(doc => doc.metadata.source).join(', ')}`);
  }
}

// 2. ADVANCED RAG - Multi-step retrieval
async function advancedRAG() {
  console.log("\n=== ADVANCED RAG SYSTEM ===");
  
  // More complex documents
  const documents = [
    new Document({
      pageContent: "LangChain is a framework for developing applications powered by language models. It enables applications that are data-aware and agentic.",
      metadata: { source: "langchain_intro.txt", category: "framework" }
    }),
    new Document({
      pageContent: "Chains in LangChain allow you to combine multiple components together to create sophisticated applications.",
      metadata: { source: "langchain_chains.txt", category: "framework" }
    }),
    new Document({
      pageContent: "Agents use language models as reasoning engines to determine which actions to take and in what order.",
      metadata: { source: "langchain_agents.txt", category: "framework" }
    }),
    new Document({
      pageContent: "Memory allows you to persist state between calls of a chain or agent, enabling conversational AI.",
      metadata: { source: "langchain_memory.txt", category: "framework" }
    }),
    new Document({
      pageContent: "Vector stores enable semantic search over documents, allowing retrieval of relevant information.",
      metadata: { source: "langchain_vectorstores.txt", category: "framework" }
    })
  ];
  
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 150,
    chunkOverlap: 30
  });
  
  const splits = await textSplitter.splitDocuments(documents);
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  
  // Multi-step retrieval
  const retriever = vectorStore.asRetriever({ k: 3 });
  
  // Advanced prompt with context ranking
  const advancedPrompt = PromptTemplate.fromTemplate(`
    You are an expert AI consultant. Use the provided context to answer the question comprehensively.
    
    Context (ranked by relevance):
    {context}
    
    Question: {question}
    
    Instructions:
    1. Provide a comprehensive answer based on the context
    2. If the context is insufficient, mention what additional information would be helpful
    3. Include specific examples or details from the context
    4. Structure your answer clearly
    
    Answer:`);
  
  const advancedChain = RetrievalQAChain.fromLLM(model, retriever, {
    prompt: advancedPrompt,
    returnSourceDocuments: true
  });
  
  const query = "How can I build a conversational AI application with LangChain?";
  console.log(`\nQuestion: ${query}`);
  
  const result = await advancedChain.call({ query });
  console.log(`Answer: ${result.text}`);
  
  console.log("\nRelevant sources:");
  result.sourceDocuments.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.metadata.source} (${doc.metadata.category})`);
    console.log(`   ${doc.pageContent.substring(0, 100)}...`);
  });
}

// 3. RAG WITH FILTERING - Category-based retrieval
async function ragWithFiltering() {
  console.log("\n=== RAG WITH FILTERING ===");
  
  const documents = [
    new Document({
      pageContent: "Python is a high-level programming language known for its simplicity and readability.",
      metadata: { source: "python.txt", category: "programming", difficulty: "beginner" }
    }),
    new Document({
      pageContent: "Advanced Python features include decorators, generators, and metaclasses.",
      metadata: { source: "python_advanced.txt", category: "programming", difficulty: "advanced" }
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
    })
  ];
  
  const splits = await textSplitter.splitDocuments(documents);
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  
  // Filtered retrieval
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
  
  // Test different retrievers
  const query = "What should I learn for programming?";
  
  console.log(`\nQuestion: ${query}`);
  
  console.log("\n--- Programming Context ---");
  const programmingDocs = await programmingRetriever.getRelevantDocuments(query);
  programmingDocs.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.metadata.source} (${doc.metadata.difficulty})`);
    console.log(`   ${doc.pageContent}`);
  });
  
  console.log("\n--- AI Context ---");
  const aiDocs = await aiRetriever.getRelevantDocuments(query);
  aiDocs.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.metadata.source} (${doc.metadata.difficulty})`);
    console.log(`   ${doc.pageContent}`);
  });
  
  console.log("\n--- Beginner Context ---");
  const beginnerDocs = await beginnerRetriever.getRelevantDocuments(query);
  beginnerDocs.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.metadata.source} (${doc.metadata.category})`);
    console.log(`   ${doc.pageContent}`);
  });
}

// 4. RAG WITH RE-RANKING - Improved relevance
async function ragWithReranking() {
  console.log("\n=== RAG WITH RE-RANKING ===");
  
  const documents = [
    new Document({
      pageContent: "React is a JavaScript library for building user interfaces, particularly web applications.",
      metadata: { source: "react.txt", relevance_score: 0.9 }
    }),
    new Document({
      pageContent: "Vue.js is a progressive JavaScript framework for building user interfaces.",
      metadata: { source: "vue.txt", relevance_score: 0.8 }
    }),
    new Document({
      pageContent: "Angular is a platform and framework for building single-page client applications.",
      metadata: { source: "angular.txt", relevance_score: 0.7 }
    }),
    new Document({
      pageContent: "JavaScript is a programming language that enables interactive web pages.",
      metadata: { source: "javascript.txt", relevance_score: 0.6 }
    }),
    new Document({
      pageContent: "HTML is the standard markup language for creating web pages.",
      metadata: { source: "html.txt", relevance_score: 0.5 }
    })
  ];
  
  const splits = await textSplitter.splitDocuments(documents);
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  
  // Custom retriever with re-ranking
  class RerankingRetriever {
    constructor(private vectorStore: MemoryVectorStore, private k: number = 3) {}
    
    async getRelevantDocuments(query: string) {
      // Get more documents than needed
      const docs = await this.vectorStore.similaritySearch(query, this.k * 2);
      
      // Re-rank by relevance score
      const rerankedDocs = docs
        .sort((a, b) => (b.metadata.relevance_score || 0) - (a.metadata.relevance_score || 0))
        .slice(0, this.k);
      
      return rerankedDocs;
    }
  }
  
  const rerankingRetriever = new RerankingRetriever(vectorStore, 3);
  
  const query = "What is the best JavaScript framework for building user interfaces?";
  console.log(`\nQuestion: ${query}`);
  
  const relevantDocs = await rerankingRetriever.getRelevantDocuments(query);
  
  console.log("\nRe-ranked results:");
  relevantDocs.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.metadata.source} (score: ${doc.metadata.relevance_score})`);
    console.log(`   ${doc.pageContent}`);
  });
}

// 5. RAG WITH CONTEXT COMPRESSION - Optimized responses
async function ragWithCompression() {
  console.log("\n=== RAG WITH CONTEXT COMPRESSION ===");
  
  const documents = [
    new Document({
      pageContent: "LangChain provides a comprehensive framework for building AI applications with language models. It includes components for prompt management, memory, chains, agents, and more. The framework is designed to be modular and extensible, allowing developers to build sophisticated applications quickly.",
      metadata: { source: "langchain_overview.txt" }
    }),
    new Document({
      pageContent: "Chains in LangChain allow you to combine multiple components together. You can create simple chains for basic tasks or complex chains for sophisticated workflows. Chains are built using the LangChain Expression Language (LCEL) which provides a declarative way to compose components.",
      metadata: { source: "langchain_chains.txt" }
    }),
    new Document({
      pageContent: "Memory in LangChain enables persistent state between calls. There are different types of memory including buffer memory, window memory, and summary memory. Memory is essential for building conversational AI applications.",
      metadata: { source: "langchain_memory.txt" }
    })
  ];
  
  const splits = await textSplitter.splitDocuments(documents);
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  
  // Context compression retriever
  class ContextCompressionRetriever {
    constructor(private vectorStore: MemoryVectorStore, private llm: any) {}
    
    async getRelevantDocuments(query: string) {
      const docs = await this.vectorStore.similaritySearch(query, 5);
      
      // Compress context by summarizing relevant parts
      const compressedDocs = await Promise.all(
        docs.map(async (doc) => {
          const compressionPrompt = `Summarize this document in 2-3 sentences, focusing on information relevant to: "${query}"
          
          Document: ${doc.pageContent}
          
          Compressed summary:`;
          
          const compressed = await this.llm.invoke(compressionPrompt);
          
          return new Document({
            pageContent: compressed.content,
            metadata: { ...doc.metadata, original_length: doc.pageContent.length }
          });
        })
      );
      
      return compressedDocs;
    }
  }
  
  const compressionRetriever = new ContextCompressionRetriever(vectorStore, model);
  
  const query = "How does LangChain help with building AI applications?";
  console.log(`\nQuestion: ${query}`);
  
  const compressedDocs = await compressionRetriever.getRelevantDocuments(query);
  
  console.log("\nCompressed context:");
  compressedDocs.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.metadata.source}`);
    console.log(`   Original length: ${doc.metadata.original_length} chars`);
    console.log(`   Compressed: ${doc.pageContent}`);
  });
}

// Run all RAG examples
async function runAllRAGExamples() {
  try {
    await basicRAG();
    await advancedRAG();
    await ragWithFiltering();
    await ragWithReranking();
    await ragWithCompression();
  } catch (error) {
    console.error("Error:", error);
  }
}

runAllRAGExamples();
