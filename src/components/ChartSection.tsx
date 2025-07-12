
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 50000 },
  { month: 'Mar', revenue: 48000, target: 50000 },
  { month: 'Apr', revenue: 58000, target: 55000 },
  { month: 'May', revenue: 62000, target: 55000 },
  { month: 'Jun', revenue: 65000, target: 55000 }
];

const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 1580 },
  { month: 'Mar', users: 1920 },
  { month: 'Apr', users: 2150 },
  { month: 'May', users: 2480 },
  { month: 'Jun', users: 2847 }
];

const channelData = [
  { name: 'Organic Search', value: 35, color: '#3B82F6' },
  { name: 'Social Media', value: 25, color: '#10B981' },
  { name: 'Direct', value: 20, color: '#F59E0B' },
  { name: 'Email', value: 15, color: '#8B5CF6' },
  { name: 'Paid Ads', value: 5, color: '#EF4444' }
];

export const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue vs Target</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
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
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#10B981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userGrowthData}>
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
            <Bar dataKey="users" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Traffic Channels */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Channels</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {channelData.map((entry, index) => (
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
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {channelData.map((channel, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: channel.color }}></div>
              <span className="text-sm text-gray-600">{channel.name}</span>
              <span className="text-sm font-medium text-gray-900 ml-auto">{channel.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Insights</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-2">Top Performing Month</h4>
            <p className="text-blue-700">June generated $65,000 in revenue, 18% above target</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <h4 className="font-medium text-green-900 mb-2">User Growth</h4>
            <p className="text-green-700">137% increase in active users since January</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="font-medium text-purple-900 mb-2">Best Channel</h4>
            <p className="text-purple-700">Organic search drives 35% of all traffic</p>
          </div>
        </div>
      </div>
    </div>
  );
};
