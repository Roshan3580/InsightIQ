
import { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar = ({ onSubmit, isLoading }: SearchBarProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
    }
  };

  const suggestions = [
    "What's our churn rate this month?",
    "Show me revenue trends for Q2",
    "How many active users do we have?",
    "What's our customer satisfaction score?"
  ];

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            ) : (
              <Search className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your business data..."
            className="w-full pl-16 pr-16 py-6 text-lg bg-white rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-500 shadow-lg"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              setInput(suggestion);
              onSubmit(suggestion);
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-white hover:bg-blue-50 text-gray-700 text-sm rounded-full border border-gray-200 hover:border-blue-300 transition-all duration-200 disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
