'use client';

import { useState } from 'react';

export default function MultimodalPage() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState('document');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() && !file) {
      alert('Please enter text or upload a file');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      let response;

      if (file && analysisType === 'image') {
        // Handle image analysis
        const formData = new FormData();
        formData.append('image', file);
        formData.append('prompt', text || 'Analyze this image and describe what you see');

        response = await fetch('/api/image', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Handle text analysis
        response = await fetch('/api/text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: getAnalysisPrompt()
          }),
        });
      }

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

  const getAnalysisPrompt = () => {
    switch (analysisType) {
      case 'document':
        return `Analyze this business document and extract:
        1. Document type and purpose
        2. Key metrics and numbers
        3. Action items and recommendations
        4. Confidentiality level
        5. Create a summary for executives

        Document: ${text}`;
        
      case 'code':
        return `Analyze this code and provide:
        1. What the code does
        2. Potential issues or improvements
        3. Documentation comments
        4. Test cases
        5. Alternative implementations

        Code: ${text}`;
        
      case 'content':
        return `Create a comprehensive analysis pipeline for this content:
        1. Content Classification
        2. Sentiment Analysis
        3. Topic Extraction
        4. Key Points Summary
        5. Action Recommendations

        Content: ${text}`;
        
      default:
        return text;
    }
  };

  const analysisTypes = [
    {
      value: 'document',
      label: 'Document Analysis',
      description: 'Analyze business documents, reports, and structured text',
      placeholder: 'Paste your document content here...',
      requiresFile: false
    },
    {
      value: 'code',
      label: 'Code Analysis',
      description: 'Analyze code for improvements, documentation, and testing',
      placeholder: 'Paste your code here...',
      requiresFile: false
    },
    {
      value: 'content',
      label: 'Content Analysis',
      description: 'Comprehensive analysis of any text content',
      placeholder: 'Paste your content here...',
      requiresFile: false
    },
    {
      value: 'image',
      label: 'Image Analysis',
      description: 'Analyze images with text descriptions',
      placeholder: 'Describe what you want to analyze about the image...',
      requiresFile: true
    }
  ];

  const selectedType = analysisTypes.find(type => type.value === analysisType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔄 Multimodal Processing with Gemini
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Type
              </label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {analysisTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-600">
                {selectedType?.description}
              </p>
            </div>

            {selectedType?.requiresFile && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedType?.requiresFile ? 'Analysis Prompt' : 'Content'}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={selectedType?.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {analysisType === 'document' && (
                <button
                  type="button"
                  onClick={() => setText(`CONFIDENTIAL REPORT
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
3. Invest in AI-powered customer support`)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  Sample Document
                </button>
              )}
              
              {analysisType === 'code' && (
                <button
                  type="button"
                  onClick={() => setText(`function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
  }
  return total;
}`)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  Sample Code
                </button>
              )}
              
              {analysisType === 'content' && (
                <button
                  type="button"
                  onClick={() => setText("Our new AI-powered customer service platform has revolutionized how we handle customer inquiries. The system can now process 10,000+ requests per hour with 95% accuracy, reducing response time from 24 hours to under 5 minutes.")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  Sample Content
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (!text.trim() && !file)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Process Content'}
            </button>
          </form>

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Result:</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{result}</pre>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">🚀 Multimodal Capabilities:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Process text, images, and documents simultaneously</li>
              <li>• Extract insights from multiple content types</li>
              <li>• Create comprehensive analysis pipelines</li>
              <li>• Generate structured reports from unstructured data</li>
              <li>• Support for complex business workflows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
