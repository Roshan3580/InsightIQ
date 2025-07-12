
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, AlertCircle, Download, Share2, Save } from 'lucide-react';
import { QueryResponse } from '@/services/api';

interface QueryResultsProps {
  results: QueryResponse;
  query: string;
}

export const QueryResults = ({ results, query }: QueryResultsProps) => {
  const renderChart = () => {
    if (!results.data || results.data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No data available for visualization
        </div>
      );
    }

    if (results.visualization_type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={results.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={Object.keys(results.data[0])[0]} stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            {Object.keys(results.data[0]).slice(1).map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5]} 
                strokeWidth={3}
                dot={{ fill: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5], strokeWidth: 2, r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (results.visualization_type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={results.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={Object.keys(results.data[0])[0]} stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            {Object.keys(results.data[0]).slice(1).map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5]} 
                radius={[4, 4, 0, 0]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (results.visualization_type === 'pie') {
      const data = results.data.map((item, index) => ({
        name: Object.values(item)[0] as string,
        value: Object.values(item)[1] as number,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5]
      }));

      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      // Table view for general data
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(results.data[0]).map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {typeof value === 'number' ? value.toLocaleString() : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const getQueryTypeTitle = () => {
    switch (results.query_type) {
      case 'churn_analysis':
        return 'Customer Churn Analysis';
      case 'revenue_analysis':
        return 'Revenue Analysis';
      case 'user_analysis':
        return 'User Analysis';
      default:
        return 'Data Analysis';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Query Echo */}
      <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">You asked:</h3>
            <p className="text-blue-700 italic">"{query}"</p>
          </div>
        </div>
      </div>

      {/* AI Response */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">{getQueryTypeTitle()}</h2>
        </div>
        
        {results.explanation && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-indigo-800 font-medium">{results.explanation}</p>
            </div>
          </div>
        )}

        {/* Query Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500">Execution Time</h4>
            <p className="text-lg font-semibold text-gray-900">{results.execution_time}ms</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500">Confidence</h4>
            <p className="text-lg font-semibold text-gray-900">{(results.confidence * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500">Results</h4>
            <p className="text-lg font-semibold text-gray-900">{results.data?.length || 0} rows</p>
          </div>
        </div>

        {/* Generated SQL */}
        {results.sql && (
          <div className="bg-gray-900 rounded-lg p-4 mb-8">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Generated SQL:</h4>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{results.sql}</code>
            </pre>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-6">
          {renderChart()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
          <Save className="h-4 w-4" />
          <span>Save to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
