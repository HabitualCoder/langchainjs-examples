# LangChain.js vs Vercel AI SDK - Complete Feature Comparison

## 📁 Project Structure
```
app/
├── simple-chat-llm/          # Basic text generation examples
├── streaming/               # Streaming text and structured output
├── tool-calling/           # Function calling and tool integration
├── image-generation/       # Image analysis and generation prompts
├── transcription/          # Audio transcript processing
├── speech/                # Speech processing and TTS
├── multimodal/            # Multi-content type analysis
└── comparison/            # Feature comparisons
```

## 🚀 Quick Start Guide

### 1. Basic Text Generation
```typescript
// Vercel AI SDK
import { generateText } from 'ai';
const result = await generateText({ model, prompt });

// LangChain.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const model = new ChatGoogleGenerativeAI({ model: "gemini-2.0-flash" });
const result = await model.invoke(prompt);
```

### 2. Structured Output
```typescript
// Vercel AI SDK
const result = await generateObject({ model, schema, prompt });

// LangChain.js
const structuredModel = model.withStructuredOutput(schema);
const result = await structuredModel.invoke(prompt);
```

### 3. Streaming
```typescript
// Vercel AI SDK
const stream = await streamText({ model, prompt });
for await (const chunk of stream.textStream) { ... }

// LangChain.js
const stream = await model.stream(prompt);
for await (const chunk of stream) { ... }
```

## 📊 Feature Comparison Matrix

| Feature | Vercel AI SDK | LangChain.js | Complexity | Best For |
|---------|---------------|--------------|------------|----------|
| **Text Generation** | ✅ `generateText()` | ✅ `model.invoke()` | Low | Simple apps |
| **Structured Output** | ✅ `generateObject()` | ✅ `withStructuredOutput()` | Medium | Complex schemas |
| **Streaming Text** | ✅ `streamText()` | ✅ `model.stream()` | Low | Real-time apps |
| **Streaming Objects** | ✅ `streamObject()` | ✅ `structuredModel.stream()` | Medium | Live structured data |
| **Tool Calling** | ✅ Built-in | ✅ `bindTools()` | High | Advanced workflows |
| **Image Analysis** | ❌ Limited | ✅ Multimodal support | Medium | Image processing |
| **Audio Processing** | ❌ None | ✅ Integration ready | High | Speech apps |
| **State Management** | ❌ None | ✅ Built-in chains | High | Complex workflows |
| **Prompt Templates** | ✅ Basic | ✅ Advanced | Medium | Prompt engineering |
| **React Components** | ✅ Built-in | ❌ None | Low | UI integration |
| **Error Handling** | ✅ Built-in | ✅ Comprehensive | Medium | Production apps |
| **Type Safety** | ✅ Excellent | ✅ Good | Medium | TypeScript apps |

## 🎯 When to Use Which?

### Choose Vercel AI SDK if:
- ✅ Building simple chat applications
- ✅ Need React components out of the box
- ✅ Want minimal setup and configuration
- ✅ Building Next.js applications
- ✅ Need quick prototyping
- ✅ Want built-in UI components

### Choose LangChain.js if:
- ✅ Building complex AI workflows
- ✅ Need advanced prompt engineering
- ✅ Want extensive tool integration
- ✅ Building enterprise applications
- ✅ Need multimodal capabilities
- ✅ Want fine-grained control over AI behavior
- ✅ Need state management and memory
- ✅ Building custom AI chains

## 🔧 Key Differences Explained

### 1. **Architecture Philosophy**
- **Vercel AI SDK**: Simple, opinionated, React-focused
- **LangChain.js**: Flexible, modular, framework-agnostic

### 2. **State Management**
- **Vercel AI SDK**: No built-in state management
- **LangChain.js**: Built-in chains, memory, and state management

### 3. **Tool Integration**
- **Vercel AI SDK**: Basic function calling
- **LangChain.js**: Advanced tool ecosystem with 100+ integrations

### 4. **Multimodal Support**
- **Vercel AI SDK**: Limited to text
- **LangChain.js**: Full multimodal support (text, images, audio)

### 5. **Learning Curve**
- **Vercel AI SDK**: Easy to learn, quick to implement
- **LangChain.js**: Steeper learning curve, more powerful

## 📝 Code Examples

### Streaming Comparison
```typescript
// Vercel AI SDK
const { textStream } = await streamText({
  model,
  prompt: "Tell me a story",
});
for await (const chunk of textStream) {
  console.log(chunk);
}

// LangChain.js
const stream = await model.stream("Tell me a story");
for await (const chunk of stream) {
  console.log(chunk.content);
}
```

### Tool Calling Comparison
```typescript
// Vercel AI SDK
const result = await generateObject({
  model,
  schema: z.object({
    tool: z.string(),
    args: z.record(z.any())
  }),
  prompt: "What's the weather?"
});

// LangChain.js
const modelWithTools = model.bindTools(tools);
const result = await modelWithTools.invoke("What's the weather?");
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install @langchain/google-genai zod
   ```

2. **Set up environment**:
   ```bash
   echo "GOOGLE_API_KEY=your_key_here" > .env
   ```

3. **Run examples**:
   ```bash
   npx tsx app/simple-chat-llm/chat.ts
   npx tsx app/streaming/stream-text.ts
   npx tsx app/tool-calling/basic-tools.ts
   ```

## 📚 Additional Resources

- [LangChain.js Documentation](https://js.langchain.com/)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/)
- [Google Generative AI Documentation](https://ai.google.dev/)

## 🤝 Contributing

Feel free to add more examples or improve existing ones. Each folder contains focused examples for specific AI capabilities.