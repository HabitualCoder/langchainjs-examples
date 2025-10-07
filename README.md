# 🚀 LangChain.js Complete AI Application

A comprehensive Next.js application demonstrating all major LangChain.js capabilities with Google Gemini integration. This project showcases text generation, image analysis, speech processing, transcription, multimodal processing, and more.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Usage Examples](#-usage-examples)
- [LangChain.js vs Vercel AI SDK](#-langchainjs-vs-vercel-ai-sdk)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core AI Capabilities
- **Text Generation** - Basic chat and structured output with Gemini
- **Image Analysis** - Upload images for OCR, content analysis, and visual Q&A
- **Speech Processing** - Generate speech scripts and analyze speech patterns
- **Transcript Analysis** - Process audio transcripts and extract insights
- **Multimodal Processing** - Handle multiple content types simultaneously
- **Feature Comparison** - AI-powered comparison between LangChain.js and Vercel AI SDK

### 🔧 Advanced Features
- **Streaming Support** - Real-time text and structured output streaming
- **Tool Calling** - Function calling and external tool integration
- **File Upload** - Support for image files (PNG, JPEG)
- **Schema Validation** - Zod-based structured output validation
- **Error Handling** - Comprehensive error handling and validation
- **Responsive UI** - Modern, mobile-friendly interface

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI Framework**: LangChain.js
- **AI Model**: Google Gemini 2.0 Flash
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Google AI API key

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd langchainjs-examples
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```bash
GOOGLE_API_KEY=your_google_api_key_here
```

**Getting Google API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" 
4. Create a new API key
5. Copy the key to your `.env.local` file

### 4. Run the Development Server
```bash
npm run dev
# or
pnpm dev
```

### 5. Open Your Browser
Navigate to `http://localhost:3000` to see the application.

## 📁 Project Structure

```
langchainjs-examples/
├── app/
│   ├── api/                    # API routes
│   │   ├── text/route.ts       # Text generation API
│   │   ├── image/route.ts      # Image analysis API
│   │   ├── speech/route.ts     # Speech processing API
│   │   └── transcription/route.ts # Transcript analysis API
│   ├── simple-chat-llm/        # Basic text generation examples
│   │   ├── chat.ts
│   │   ├── structured-chat.ts
│   │   ├── schema-examples.ts
│   │   └── prompt-reveal.ts
│   ├── streaming/              # Streaming examples
│   │   ├── stream-text.ts
│   │   └── stream-structured.ts
│   ├── tool-calling/           # Tool calling examples
│   │   ├── basic-tools.ts
│   │   └── advanced-tools.ts
│   ├── image-generation/       # Image processing
│   │   ├── image-prompts.ts
│   │   ├── image-analysis.ts
│   │   └── page.tsx           # UI for image analysis
│   ├── speech/                 # Speech processing
│   │   ├── speech-processing.ts
│   │   └── page.tsx           # UI for speech processing
│   ├── transcription/          # Transcript processing
│   │   ├── transcript-processing.ts
│   │   └── page.tsx           # UI for transcript analysis
│   ├── multimodal/            # Multimodal processing
│   │   ├── content-analysis.ts
│   │   └── page.tsx           # UI for multimodal processing
│   ├── comparison/            # Feature comparison
│   │   ├── feature-comparison.ts
│   │   └── page.tsx           # UI for comparison
│   ├── page.tsx               # Main homepage
│   └── layout.tsx             # App layout
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### Text Generation
- **POST** `/api/text`
- **Body**: `{ "prompt": "Your text prompt" }`
- **Response**: `{ "success": true, "content": "AI response" }`

### Image Analysis
- **POST** `/api/image`
- **Body**: FormData with `image` file and `prompt` text
- **Response**: `{ "success": true, "content": "Image analysis" }`

### Speech Processing
- **POST** `/api/speech`
- **Body**: `{ "text": "Text to process", "processingType": "speech_script" }`
- **Response**: `{ "success": true, "content": "Processed speech" }`

### Transcript Analysis
- **POST** `/api/transcription`
- **Body**: `{ "transcript": "Audio transcript", "analysisType": "summary" }`
- **Response**: `{ "success": true, "content": "Analysis result" }`

## 💡 Usage Examples

### 1. Basic Text Generation
```typescript
const response = await fetch('/api/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Explain quantum computing' })
});
const data = await response.json();
console.log(data.content);
```

### 2. Image Analysis
```typescript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('prompt', 'What do you see in this image?');

const response = await fetch('/api/image', {
  method: 'POST',
  body: formData
});
const data = await response.json();
console.log(data.content);
```

### 3. Structured Output
```typescript
import { z } from "zod";

const schema = z.object({
  answer: z.string().describe("The main answer"),
  confidence: z.number().min(0).max(1)
});

const structuredModel = model.withStructuredOutput(schema);
const result = await structuredModel.invoke("What is AI?");
```

## ⚖️ LangChain.js vs Vercel AI SDK

| Feature | LangChain.js | Vercel AI SDK | Best For |
|---------|--------------|---------------|----------|
| **Text Generation** | `model.invoke()` | `generateText()` | LangChain: Complex workflows |
| **Structured Output** | `withStructuredOutput()` | `generateObject()` | LangChain: Advanced schemas |
| **Streaming** | `model.stream()` | `streamText()` | Both: Real-time apps |
| **Tool Calling** | `bindTools()` | Built-in | LangChain: Advanced tools |
| **State Management** | Built-in chains | None | LangChain: Complex workflows |
| **Multimodal** | Full support | Limited | LangChain: Image/audio |
| **React Components** | None | Built-in | Vercel: Quick UI |
| **Learning Curve** | Steeper | Gentle | Vercel: Simple apps |

### When to Choose Each:

**Choose LangChain.js if:**
- Building complex AI workflows
- Need advanced prompt engineering
- Want extensive tool integration
- Building enterprise applications
- Need multimodal capabilities

**Choose Vercel AI SDK if:**
- Building simple chat applications
- Need React components out of the box
- Want minimal setup
- Building Next.js applications
- Need quick prototyping

## 🎯 Key Learnings

1. **LangChain.js is more powerful** but has a steeper learning curve
2. **Vercel AI SDK is simpler** but limited to basic text generation
3. **Both use the same underlying AI models** - the difference is in the framework
4. **LangChain.js excels at complex workflows** with state management and tool integration
5. **Vercel AI SDK excels at quick UI development** with built-in React components

## 🔧 Development

### Running Examples
```bash
# Run specific examples
npx tsx app/simple-chat-llm/chat.ts
npx tsx app/streaming/stream-text.ts
npx tsx app/tool-calling/basic-tools.ts
```

### Building for Production
```bash
npm run build
npm start
```

## 📚 Additional Resources

- [LangChain.js Documentation](https://js.langchain.com/)
- [Google AI Studio](https://aistudio.google.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using LangChain.js, Next.js, and Google Gemini**