import React from 'react';
import { 
  TrendingUp, Clock, Bell, CheckCircle, AlertCircle
} from 'lucide-react';

interface AnimatedStatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  status?: 'success' | 'warning' | 'info' | 'default';
}

export const AnimatedStatsCard: React.FC<AnimatedStatsCardProps> = ({ 
  icon, title, value, subtitle, color, status = 'default' 
}) => {
  const statusColors = {
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500', 
    info: 'border-l-blue-500',
    default: 'border-l-gray-300'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${statusColors[status]} border-l-4 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer animate-fadeInUp`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} group-hover:rotate-12 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="text-green-600 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-xs">Tốt</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900 transform group-hover:scale-110 transition-transform duration-200">
          {value}
        </p>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, max, color = "bg-blue-600", height = "h-2", label 
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-900">{value}/{max}</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div 
          className={`${color} ${height} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, maxCount = 99 }) => {
  if (count === 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce">
      {displayCount}
    </span>
  );
};

interface WeatherWidgetProps {
  location?: string;
  temperature?: number;
  condition?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  location = "Hà Nội", 
  temperature = 25, 
  condition = "Nắng đẹp" 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{location}</p>
          <p className="text-2xl font-bold">{temperature}°C</p>
          <p className="text-xs opacity-75">{condition}</p>
        </div>
        <div className="text-yellow-300 animate-spin-slow">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface TimelineItemProps {
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
  isLast: boolean;
  index: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ 
  title, description, date, status, isLast, index 
}) => {
  const statusConfig = {
    completed: { 
      color: 'bg-green-100 text-green-600', 
      lineColor: 'bg-green-200',
      icon: <CheckCircle className="h-4 w-4" />
    },
    current: { 
      color: 'bg-blue-100 text-blue-600 ring-4 ring-blue-50 animate-pulse', 
      lineColor: 'bg-blue-200',
      icon: <Clock className="h-4 w-4" />
    },
    pending: { 
      color: 'bg-gray-100 text-gray-400', 
      lineColor: 'bg-gray-200',
      icon: <AlertCircle className="h-4 w-4" />
    }
  };

  return (
    <div 
      className="flex items-start opacity-0 animate-slideInLeft"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col items-center mr-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${statusConfig[status].color} hover:scale-110 transition-transform duration-200 cursor-pointer`}
        >
          {statusConfig[status].icon}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 h-12 mt-2 ${statusConfig[status].lineColor} animate-growHeight`}
            style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium ${status === 'current' ? 'text-blue-600' : 'text-gray-900'}`}
        >
          {title}
        </p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{date}</p>
      </div>
    </div>
  );
};

interface FloatingNotificationProps {
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export const FloatingNotification: React.FC<FloatingNotificationProps> = ({
  message, type, isVisible, onClose
}) => {
  const typeConfig = {
    success: { color: 'bg-green-500', icon: <CheckCircle className="h-5 w-5" /> },
    warning: { color: 'bg-yellow-500', icon: <AlertCircle className="h-5 w-5" /> },
    info: { color: 'bg-blue-500', icon: <Bell className="h-5 w-5" /> },
    error: { color: 'bg-red-500', icon: <AlertCircle className="h-5 w-5" /> }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 ${typeConfig[type].color} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slideInRight`}>
      <div className="flex items-center space-x-2">
        {typeConfig[type].icon}
        <span className="text-sm font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default {
  AnimatedStatsCard,
  ProgressBar,
  NotificationBadge,
  WeatherWidget,
  TimelineItem,
  FloatingNotification
};