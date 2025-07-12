
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { MetricsGrid } from '@/components/MetricsGrid';
import { ChartSection } from '@/components/ChartSection';
import { Header } from '@/components/Header';
import { QueryResults } from '@/components/QueryResults';
import { FileUpload } from '@/components/FileUpload';
import { apiService, QueryResponse, Dataset } from '@/services/api';
import { Upload, Database, BarChart3, X, AlertCircle } from 'lucide-react';

const Index = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState('');

  // Load datasets on component mount
  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const response = await apiService.getDatasets();
      if (response.success) {
        setDatasets(response.datasets);
        // Auto-select the first dataset if available
        if (response.datasets.length > 0 && !selectedDataset) {
          setSelectedDataset(response.datasets[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load datasets:', error);
      setError('Failed to load datasets');
    }
  };

  const handleQuerySubmit = async (searchQuery: string) => {
    if (!selectedDataset) {
      setError('Please upload a dataset first');
      return;
    }

    setIsLoading(true);
    setQuery(searchQuery);
    setError('');
    
    try {
      const response = await apiService.processQuery({
        query: searchQuery,
        dataset_id: selectedDataset.id
      });
      
      setResults(response);
    } catch (error) {
      console.error('Query failed:', error);
      setError(error instanceof Error ? error.message : 'Query failed');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (dataset: Dataset) => {
    setDatasets(prev => [dataset, ...prev]);
    setSelectedDataset(dataset);
    setShowUpload(false);
  };

  const handleDatasetSelect = (dataset: Dataset) => {
    setSelectedDataset(dataset);
  };

  // If no datasets available, show upload interface
  if (datasets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              InsightIQ
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your data to start asking questions in plain English
            </p>
          </div>

          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </main>
      </div>
    );
  }

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

        {/* Dataset Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Dataset</h3>
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload New</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  onClick={() => handleDatasetSelect(dataset)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDataset?.id === dataset.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{dataset.name}</h4>
                      <p className="text-sm text-gray-500">
                        {dataset.row_count.toLocaleString()} rows • {dataset.column_count} columns
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Upload New Dataset</h3>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          </div>
        )}

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
