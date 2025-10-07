'use client';

import { useState } from 'react';

export default function TranscriptionPage() {
  const [transcript, setTranscript] = useState('');
  const [analysisType, setAnalysisType] = useState('summary');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transcript.trim()) {
      alert('Please enter a transcript to analyze');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/transcription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          analysisType,
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

  const analysisTypes = [
    {
      value: 'summary',
      label: 'Conversation Summary',
      description: 'Get a summary with key topics, speakers, and important quotes',
      placeholder: 'Paste your audio transcript here...'
    },
    {
      value: 'action_items',
      label: 'Extract Action Items',
      description: 'Identify tasks, responsibilities, and deadlines from meeting transcripts',
      placeholder: 'Paste your meeting transcript here...'
    },
    {
      value: 'improve',
      label: 'Improve Transcript Quality',
      description: 'Clean up transcripts with filler words and improve readability',
      placeholder: 'Paste transcript with filler words to clean up...'
    }
  ];

  const selectedType = analysisTypes.find(type => type.value === analysisType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🎙️ Transcript Processing with Gemini
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Transcript
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={selectedType?.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTranscript(`Speaker 1: Hi, welcome to our podcast about artificial intelligence.
Speaker 2: Thanks for having me. I'm excited to discuss the latest developments in AI.
Speaker 1: Can you tell us about your work in machine learning?
Speaker 2: Sure, I've been working on natural language processing models for the past five years.`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Sample Podcast
              </button>
              <button
                type="button"
                onClick={() => setTranscript(`John: We need to finish the project by next Friday.
Sarah: I'll handle the frontend development.
Mike: I can work on the backend API.
John: Great, let's schedule a review meeting for Wednesday.
Sarah: I'll send out the calendar invite.`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Sample Meeting
              </button>
              <button
                type="button"
                onClick={() => setTranscript("um so like we need to uh finish the project and stuff you know")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Sample with Fillers
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !transcript.trim()}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Transcript'}
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
            <h4 className="font-semibold text-blue-900 mb-2">🔧 Integration with Speech-to-Text:</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>Google Speech-to-Text:</strong> Use for high-quality audio transcription</p>
              <p><strong>Whisper API:</strong> OpenAI's speech recognition service</p>
              <p><strong>Azure Speech:</strong> Microsoft's speech services</p>
              <p><strong>AssemblyAI:</strong> Specialized transcription service</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <h4 className="font-semibold text-green-900 mb-2">💡 Use Cases:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Meeting minutes and action item extraction</li>
              <li>• Podcast and interview analysis</li>
              <li>• Customer service call analysis</li>
              <li>• Lecture and training content processing</li>
              <li>• Legal deposition analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
