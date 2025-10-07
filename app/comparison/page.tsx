'use client';

import { useState } from 'react';

export default function ComparisonPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateComparison = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create a comprehensive comparison between LangChain.js and Vercel AI SDK. Include:

1. **Core Features Comparison**
   - Text generation capabilities
   - Structured output generation
   - Streaming capabilities
   - Tool calling/function calling
   - State management
   - Multimodal support

2. **Architecture Differences**
   - Design philosophy
   - Learning curve
   - Flexibility vs simplicity

3. **Use Cases**
   - When to use LangChain.js
   - When to use Vercel AI SDK
   - Specific scenarios for each

4. **Code Examples**
   - Side-by-side code comparisons
   - Implementation differences

5. **Pros and Cons**
   - Advantages of each approach
   - Limitations of each

Format this as a detailed markdown-style comparison with clear sections and examples.`
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.content);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            ⚖️ LangChain.js vs Vercel AI SDK Comparison
          </h1>
          
          <div className="mb-6">
            <button
              onClick={handleGenerateComparison}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Comparison...' : 'Generate AI-Powered Comparison'}
            </button>
          </div>

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Comparison Result:</h3>
              <div className="bg-gray-50 p-6 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{result}</pre>
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">🔗 LangChain.js</h3>
              <div className="space-y-2 text-blue-800">
                <p><strong>✅ Pros:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Advanced prompt engineering</li>
                  <li>Extensive tool ecosystem</li>
                  <li>Built-in state management</li>
                  <li>Multimodal capabilities</li>
                  <li>Flexible architecture</li>
                  <li>Enterprise-ready features</li>
                </ul>
                <p className="mt-4"><strong>❌ Cons:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Steeper learning curve</li>
                  <li>More complex setup</li>
                  <li>No built-in UI components</li>
                  <li>Requires more configuration</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-4">⚡ Vercel AI SDK</h3>
              <div className="space-y-2 text-green-800">
                <p><strong>✅ Pros:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Simple and intuitive</li>
                  <li>Built-in React components</li>
                  <li>Quick setup and deployment</li>
                  <li>Excellent TypeScript support</li>
                  <li>Great for prototyping</li>
                  <li>Next.js integration</li>
                </ul>
                <p className="mt-4"><strong>❌ Cons:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Limited advanced features</li>
                  <li>No built-in state management</li>
                  <li>Limited multimodal support</li>
                  <li>Less flexible for complex workflows</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Quick Decision Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Choose LangChain.js if:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Building complex AI workflows</li>
                  <li>• Need advanced prompt engineering</li>
                  <li>• Want extensive tool integration</li>
                  <li>• Building enterprise applications</li>
                  <li>• Need multimodal capabilities</li>
                  <li>• Want fine-grained control</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Choose Vercel AI SDK if:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Building simple chat applications</li>
                  <li>• Need React components out of the box</li>
                  <li>• Want minimal setup and configuration</li>
                  <li>• Building Next.js applications</li>
                  <li>• Need quick prototyping</li>
                  <li>• Want built-in UI components</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
