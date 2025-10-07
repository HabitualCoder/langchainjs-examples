'use client';

import { useState } from 'react';

export default function SpeechProcessingPage() {
  const [text, setText] = useState('');
  const [processingType, setProcessingType] = useState('speech_script');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      alert('Please enter some text to process');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          processingType,
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

  const processingTypes = [
    {
      value: 'speech_script',
      label: 'Generate Speech Script',
      description: 'Create a natural-sounding speech script for presentations',
      placeholder: 'Enter your topic (e.g., "benefits of AI in healthcare")'
    },
    {
      value: 'speech_friendly',
      label: 'Convert to Speech-Friendly',
      description: 'Convert formal text to conversational, speech-friendly format',
      placeholder: 'Enter formal text to convert...'
    },
    {
      value: 'speech_analysis',
      label: 'Analyze Speech Patterns',
      description: 'Analyze speech for filler words and improvements',
      placeholder: 'Enter speech sample to analyze...'
    },
    {
      value: 'voice_assistant',
      label: 'Voice Assistant Responses',
      description: 'Create natural responses for voice assistants',
      placeholder: 'Enter user query (e.g., "What\'s the weather like?")'
    }
  ];

  const selectedType = processingTypes.find(type => type.value === processingType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🎤 Speech Processing with Gemini
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Type
              </label>
              <select
                value={processingType}
                onChange={(e) => setProcessingType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {processingTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-600">
                {selectedType?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={selectedType?.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setText("The implementation of artificial intelligence technologies in healthcare systems has demonstrated significant improvements in diagnostic accuracy and treatment efficiency.")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Sample Formal Text
              </button>
              <button
                type="button"
                onClick={() => setText("So, um, I think that, you know, we should probably, like, consider the options and stuff.")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Sample Speech
              </button>
              <button
                type="button"
                onClick={() => setText("What's the weather like?")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Sample Query
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Process Speech'}
            </button>
          </form>

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Result:</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{result}</pre>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Integration Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use Google Text-to-Speech API to convert results to audio</li>
              <li>• Integrate with voice assistants like Google Assistant</li>
              <li>• Use for podcast script generation and speech coaching</li>
              <li>• Perfect for creating conversational AI responses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
