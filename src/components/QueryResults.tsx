
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

interface QueryResultsProps {
  results: any;
  query: string;
}

export const QueryResults = ({ results, query }: QueryResultsProps) => {
  const renderChart = () => {
    if (results.type === 'churn_analysis') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={results.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="churn" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="retention" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (results.type === 'revenue_analysis') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={results.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-6">
          {results.data.map((item: any, index: number) => (
            <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <h4 className="font-medium text-gray-700 mb-2">{item.metric}</h4>
              <p className="text-3xl font-bold text-blue-600">{item.value}</p>
            </div>
          ))}
        </div>
      );
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
          <h2 className="text-2xl font-bold text-gray-900">{results.title}</h2>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <p className="text-indigo-800 font-medium">{results.summary}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          {renderChart()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
          Export Report
        </button>
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
          Ask Follow-up
        </button>
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
          Save to Dashboard
        </button>
      </div>
    </div>
  );
};
