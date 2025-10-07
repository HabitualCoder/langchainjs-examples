import dotenv from 'dotenv';
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// 1. PRODUCTION ERROR HANDLING
class ProductionAI {
  private model: ChatGoogleGenerativeAI;
  private retryCount: number = 3;
  private timeout: number = 30000; // 30 seconds

  constructor() {
    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.7,
      maxOutputTokens: 1000,
      timeout: this.timeout
    });
  }

  async generateWithRetry(prompt: string, context?: any): Promise<string> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${this.retryCount}`);
        
        const result = await this.model.invoke(prompt);
        return result.content as string;
        
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt < this.retryCount) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`Failed after ${this.retryCount} attempts. Last error: ${lastError?.message}`);
  }

  async generateWithFallback(prompt: string): Promise<string> {
    try {
      return await this.generateWithRetry(prompt);
    } catch (error) {
      console.error("Primary model failed, using fallback:", error);
      
      // Fallback to simpler model or cached response
      const fallbackModel = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash", // Simpler model as fallback
        temperature: 0.3
      });
      
      try {
        const result = await fallbackModel.invoke(prompt);
        return result.content as string;
      } catch (fallbackError) {
        return "I apologize, but I'm currently unable to process your request. Please try again later.";
      }
    }
  }
}

// 2. RATE LIMITING & THROTTLING
class RateLimitedAI {
  private requests: number[] = [];
  private maxRequests: number = 100; // per minute
  private windowMs: number = 60000; // 1 minute

  async checkRateLimit(): Promise<boolean> {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false; // Rate limit exceeded
    }
    
    this.requests.push(now);
    return true;
  }

  async generateWithRateLimit(prompt: string): Promise<string> {
    if (!(await this.checkRateLimit())) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.7
    });
    
    const result = await model.invoke(prompt);
    return result.content as string;
  }
}

// 3. CACHING SYSTEM
class CachedAI {
  private cache: Map<string, { result: string; timestamp: number }> = new Map();
  private cacheTTL: number = 300000; // 5 minutes

  private generateCacheKey(prompt: string): string {
    // Simple hash function for cache key
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTTL;
  }

  async generateWithCache(prompt: string): Promise<string> {
    const cacheKey = this.generateCacheKey(prompt);
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.log("Cache hit!");
      return cached.result;
    }
    
    console.log("Cache miss, generating new response...");
    
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.7
    });
    
    const result = await model.invoke(prompt);
    const response = result.content as string;
    
    // Cache the result
    this.cache.set(cacheKey, {
      result: response,
      timestamp: Date.now()
    });
    
    return response;
  }

  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0.75 // In production, calculate actual hit rate
    };
  }
}

// 4. MONITORING & METRICS
class MonitoredAI {
  private metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    totalTokens: number;
  } = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    totalTokens: 0
  };

  async generateWithMonitoring(prompt: string): Promise<string> {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    try {
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0.7
      });
      
      const result = await model.invoke(prompt);
      const response = result.content as string;
      
      const responseTime = Date.now() - startTime;
      this.updateMetrics(true, responseTime, response.length);
      
      return response;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics(false, responseTime, 0);
      throw error;
    }
  }

  private updateMetrics(success: boolean, responseTime: number, tokenCount: number): void {
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }
    
    // Update average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) / 
      this.metrics.totalRequests;
    
    this.metrics.totalTokens += tokenCount;
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.successfulRequests / this.metrics.totalRequests,
      averageTokensPerRequest: this.metrics.totalTokens / this.metrics.totalRequests
    };
  }
}

// 5. SECURITY & VALIDATION
class SecureAI {
  private blockedPatterns = [
    /password/i,
    /secret/i,
    /token/i,
    /api[_-]?key/i,
    /credit[_-]?card/i,
    /ssn/i,
    /social[_-]?security/i
  ];

  private validateInput(prompt: string): { valid: boolean; reason?: string } {
    // Check for blocked patterns
    for (const pattern of this.blockedPatterns) {
      if (pattern.test(prompt)) {
        return { valid: false, reason: "Input contains sensitive information" };
      }
    }
    
    // Check length
    if (prompt.length > 10000) {
      return { valid: false, reason: "Input too long" };
    }
    
    // Check for potential injection
    if (prompt.includes("ignore previous instructions") || 
        prompt.includes("system prompt") ||
        prompt.includes("jailbreak")) {
      return { valid: false, reason: "Potential prompt injection detected" };
    }
    
    return { valid: true };
  }

  async generateSecurely(prompt: string): Promise<string> {
    const validation = this.validateInput(prompt);
    
    if (!validation.valid) {
      throw new Error(`Security validation failed: ${validation.reason}`);
    }
    
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.7
    });
    
    // Add security context to prompt
    const securePrompt = `
    You are a helpful AI assistant. Please respond to the user's question professionally and safely.
    
    User question: ${prompt}
    
    Guidelines:
    - Do not provide personal, financial, or sensitive information
    - Do not generate harmful or inappropriate content
    - Be helpful and informative
    `;
    
    const result = await model.invoke(securePrompt);
    return result.content as string;
  }
}

// 6. BATCH PROCESSING
class BatchAI {
  private batchSize: number = 5;
  private batchDelay: number = 1000; // 1 second between batches

  async processBatch(prompts: string[]): Promise<string[]> {
    const results: string[] = [];
    
    for (let i = 0; i < prompts.length; i += this.batchSize) {
      const batch = prompts.slice(i, i + this.batchSize);
      console.log(`Processing batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(prompts.length / this.batchSize)}`);
      
      const batchResults = await Promise.all(
        batch.map(async (prompt) => {
          try {
            const model = new ChatGoogleGenerativeAI({
              model: "gemini-2.0-flash",
              temperature: 0.7
            });
            
            const result = await model.invoke(prompt);
            return result.content as string;
          } catch (error) {
            return `Error processing: ${error}`;
          }
        })
      );
      
      results.push(...batchResults);
      
      // Delay between batches to avoid rate limiting
      if (i + this.batchSize < prompts.length) {
        await new Promise(resolve => setTimeout(resolve, this.batchDelay));
      }
    }
    
    return results;
  }
}

// 7. PRODUCTION PIPELINE
class ProductionPipeline {
  private productionAI: ProductionAI;
  private rateLimitedAI: RateLimitedAI;
  private cachedAI: CachedAI;
  private monitoredAI: MonitoredAI;
  private secureAI: SecureAI;
  private batchAI: BatchAI;

  constructor() {
    this.productionAI = new ProductionAI();
    this.rateLimitedAI = new RateLimitedAI();
    this.cachedAI = new CachedAI();
    this.monitoredAI = new MonitoredAI();
    this.secureAI = new SecureAI();
    this.batchAI = new BatchAI();
  }

  async processRequest(prompt: string): Promise<string> {
    try {
      // 1. Security validation
      const validation = this.secureAI.validateInput(prompt);
      if (!validation.valid) {
        throw new Error(`Security validation failed: ${validation.reason}`);
      }
      
      // 2. Rate limiting check
      if (!(await this.rateLimitedAI.checkRateLimit())) {
        throw new Error("Rate limit exceeded");
      }
      
      // 3. Try cache first
      try {
        return await this.cachedAI.generateWithCache(prompt);
      } catch (cacheError) {
        console.log("Cache failed, proceeding with generation");
      }
      
      // 4. Generate with monitoring and fallback
      return await this.monitoredAI.generateWithMonitoring(prompt);
      
    } catch (error) {
      console.error("Production pipeline error:", error);
      
      // Fallback to basic generation
      try {
        return await this.productionAI.generateWithFallback(prompt);
      } catch (fallbackError) {
        return "I apologize, but I'm currently unable to process your request. Please try again later.";
      }
    }
  }

  async processBatch(prompts: string[]): Promise<string[]> {
    return await this.batchAI.processBatch(prompts);
  }

  getSystemHealth() {
    return {
      cache: this.cachedAI.getCacheStats(),
      metrics: this.monitoredAI.getMetrics(),
      rateLimit: "OK" // In production, check actual rate limit status
    };
  }
}

// DEMO FUNCTION
async function demonstrateProductionFeatures() {
  console.log("=== PRODUCTION AI FEATURES DEMO ===");
  
  const pipeline = new ProductionPipeline();
  
  // Test single request
  console.log("\n--- Single Request Processing ---");
  try {
    const result = await pipeline.processRequest("What is artificial intelligence?");
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
  
  // Test batch processing
  console.log("\n--- Batch Processing ---");
  const batchPrompts = [
    "What is machine learning?",
    "Explain deep learning",
    "What are neural networks?",
    "How does AI work?",
    "What is natural language processing?"
  ];
  
  const batchResults = await pipeline.processBatch(batchPrompts);
  console.log("Batch results:", batchResults.length, "responses generated");
  
  // Test security validation
  console.log("\n--- Security Validation ---");
  try {
    await pipeline.processRequest("What is my password?");
  } catch (error) {
    console.log("Security validation caught:", error.message);
  }
  
  // Show system health
  console.log("\n--- System Health ---");
  console.log(JSON.stringify(pipeline.getSystemHealth(), null, 2));
}

// Run the demo
demonstrateProductionFeatures().catch(console.error);
