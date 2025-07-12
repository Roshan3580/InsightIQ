import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService, UploadResponse } from '@/services/api';

interface FileUploadProps {
  onUploadSuccess: (dataset: UploadResponse['dataset']) => void;
}

export const FileUpload = ({ onUploadSuccess }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      handleFileUpload(csvFile);
    } else {
      setErrorMessage('Please upload a CSV file');
      setUploadStatus('error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!datasetName.trim()) {
      setErrorMessage('Please enter a dataset name');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const response = await apiService.uploadCSV(file, datasetName, description);
      
      if (response.success) {
        setUploadStatus('success');
        onUploadSuccess(response.dataset);
        
        // Reset form
        setDatasetName('');
        setDescription('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setErrorMessage('Upload failed');
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Data</h3>
        
        {/* Dataset Info Form */}
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="datasetName" className="block text-sm font-medium text-gray-700 mb-2">
              Dataset Name *
            </label>
            <input
              type="text"
              id="datasetName"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              placeholder="e.g., Sales Data 2023"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your dataset..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
            />
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="space-y-4">
            {uploadStatus === 'success' ? (
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            ) : uploadStatus === 'error' ? (
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            )}
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {uploadStatus === 'success' 
                  ? 'Upload Successful!' 
                  : uploadStatus === 'error'
                  ? 'Upload Failed'
                  : 'Upload CSV File'
                }
              </h4>
              
              {uploadStatus === 'success' ? (
                <p className="text-green-600">Your dataset has been uploaded and processed successfully.</p>
              ) : uploadStatus === 'error' ? (
                <p className="text-red-600">{errorMessage}</p>
              ) : (
                <p className="text-gray-600 mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
              )}
            </div>
            
            {uploadStatus !== 'success' && (
              <button
                onClick={triggerFileInput}
                disabled={isUploading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </button>
            )}
          </div>
        </div>

        {/* Upload Status */}
        {isUploading && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800">Processing your CSV file...</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-2">File Requirements:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Only CSV files are supported</li>
            <li>• Maximum file size: 50MB</li>
            <li>• First row should contain column headers</li>
            <li>• Data will be automatically analyzed for schema detection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 