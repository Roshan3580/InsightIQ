
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const metrics = [
  {
    title: 'Total Revenue',
    value: '$284,750',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'green'
  },
  {
    title: 'Active Users',
    value: '2,847',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'blue'
  },
  {
    title: 'Conversion Rate',
    value: '4.2%',
    change: '-0.3%',
    trend: 'down',
    icon: Target,
    color: 'orange'
  },
  {
    title: 'Growth Rate',
    value: '23.1%',
    change: '+2.1%',
    trend: 'up',
    icon: TrendingUp,
    color: 'purple'
  }
];

export const MetricsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const colorClasses = {
          green: 'bg-green-500 text-green-600 bg-green-50',
          blue: 'bg-blue-500 text-blue-600 bg-blue-50',
          orange: 'bg-orange-500 text-orange-600 bg-orange-50',
          purple: 'bg-purple-500 text-purple-600 bg-purple-50'
        };

        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${colorClasses[metric.color].split(' ')[2]}`}>
                <Icon className={`h-6 w-6 ${colorClasses[metric.color].split(' ')[1]}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{metric.change}</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{metric.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
          </div>
        );
      })}
    </div>
  );
};
