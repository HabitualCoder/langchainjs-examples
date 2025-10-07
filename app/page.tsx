import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Text Generation",
      description: "Basic text generation with Gemini",
      href: "/simple-chat-llm",
      icon: "💬",
      color: "bg-blue-500",
      examples: ["Chat with AI", "Structured Output", "Prompt Engineering"]
    },
    {
      title: "Image Analysis",
      description: "Upload and analyze images with AI",
      href: "/image-generation",
      icon: "🖼️",
      color: "bg-green-500",
      examples: ["OCR Text Extraction", "Content Analysis", "Visual Q&A"]
    },
    {
      title: "Speech Processing",
      description: "Generate speech scripts and analyze speech patterns",
      href: "/speech",
      icon: "🎤",
      color: "bg-purple-500",
      examples: ["Speech Scripts", "Voice Assistant", "Speech Analysis"]
    },
    {
      title: "Transcript Analysis",
      description: "Process audio transcripts and extract insights",
      href: "/transcription",
      icon: "🎙️",
      color: "bg-orange-500",
      examples: ["Meeting Summaries", "Action Items", "Transcript Cleanup"]
    },
    {
      title: "Multimodal Processing",
      description: "Process multiple content types simultaneously",
      href: "/multimodal",
      icon: "🔄",
      color: "bg-indigo-500",
      examples: ["Document Analysis", "Code Review", "Content Pipeline"]
    },
    {
      title: "Feature Comparison",
      description: "Compare LangChain.js vs Vercel AI SDK",
      href: "/comparison",
      icon: "⚖️",
      color: "bg-gray-500",
      examples: ["AI Comparison", "Feature Analysis", "Decision Guide"]
    }
  ];

  const quickLinks = [
    { name: "Streaming Examples", href: "/streaming", icon: "🌊" },
    { name: "Tool Calling", href: "/tool-calling", icon: "🔧" },
    { name: "Schema Examples", href: "/simple-chat-llm", icon: "📋" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            LangChain.js Examples
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Complete AI Application with Gemini Integration
          </p>
          <p className="text-lg text-gray-500">
            Explore text generation, image analysis, speech processing, and more
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors mb-3">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {feature.examples.map((example, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔗 Quick Links to Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium text-gray-700">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Quick Start</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-semibold">Set up your environment</p>
                <p className="text-gray-600">Add your Google API key to the .env file</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-semibold">Choose a feature</p>
                <p className="text-gray-600">Click on any feature above to explore its capabilities</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-semibold">Upload files or enter text</p>
                <p className="text-gray-600">Use the UI to interact with Gemini AI models</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🛠️ Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">⚛️</div>
              <p className="font-semibold">Next.js 15</p>
              <p className="text-sm text-gray-600">React Framework</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🔗</div>
              <p className="font-semibold">LangChain.js</p>
              <p className="text-sm text-gray-600">AI Framework</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <p className="font-semibold">Gemini 2.0</p>
              <p className="text-sm text-gray-600">AI Model</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🎨</div>
              <p className="font-semibold">Tailwind CSS</p>
              <p className="text-sm text-gray-600">Styling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}