
import { BarChart3, Settings, User, Bell } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">InsightIQ</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Analytics</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Reports</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Data Sources</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
