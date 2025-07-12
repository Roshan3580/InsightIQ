
import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { MetricsGrid } from '@/components/MetricsGrid';
import { ChartSection } from '@/components/ChartSection';
import { Header } from '@/components/Header';
import { QueryResults } from '@/components/QueryResults';

const Index = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuerySubmit = async (searchQuery: string) => {
    setIsLoading(true);
    setQuery(searchQuery);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Mock AI response based on query keywords
      const mockResults = generateMockResults(searchQuery);
      setResults(mockResults);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResults = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('churn') || lowerQuery.includes('retention')) {
      return {
        type: 'churn_analysis',
        title: 'Customer Churn Analysis',
        summary: 'Your monthly churn rate is 3.2%, which is within industry standards.',
        data: [
          { month: 'Jan', churn: 2.8, retention: 97.2 },
          { month: 'Feb', churn: 3.1, retention: 96.9 },
          { month: 'Mar', churn: 3.2, retention: 96.8 },
          { month: 'Apr', churn: 2.9, retention: 97.1 },
          { month: 'May', churn: 3.4, retention: 96.6 },
          { month: 'Jun', churn: 3.2, retention: 96.8 }
        ]
      };
    } else if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
      return {
        type: 'revenue_analysis',
        title: 'Revenue Trends',
        summary: 'Revenue has grown 23% compared to last quarter, with strong performance in Q2.',
        data: [
          { month: 'Jan', revenue: 45000, target: 50000 },
          { month: 'Feb', revenue: 52000, target: 50000 },
          { month: 'Mar', revenue: 48000, target: 50000 },
          { month: 'Apr', revenue: 58000, target: 55000 },
          { month: 'May', revenue: 62000, target: 55000 },
          { month: 'Jun', revenue: 65000, target: 55000 }
        ]
      };
    } else {
      return {
        type: 'general_metrics',
        title: 'Business Overview',
        summary: 'Here\'s a comprehensive overview of your key business metrics.',
        data: [
          { metric: 'Active Users', value: 2847 },
          { metric: 'Conversion Rate', value: 4.2 },
          { metric: 'Avg Order Value', value: 127 },
          { metric: 'Customer Satisfaction', value: 8.6 }
        ]
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            InsightIQ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ask questions about your business data in plain English and get instant, visual insights
          </p>
        </div>

        <SearchBar onSubmit={handleQuerySubmit} isLoading={isLoading} />

        {results ? (
          <QueryResults results={results} query={query} />
        ) : (
          <>
            <MetricsGrid />
            <ChartSection />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
