import React from 'react';

export function QuickAnswer({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 my-6 shadow-sm">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
        Quick Answer
      </p>
      <p className="font-semibold text-gray-800 mb-2">{question}</p>
      <p className="text-gray-700 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}
