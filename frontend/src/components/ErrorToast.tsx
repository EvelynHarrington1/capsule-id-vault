import { useEffect } from 'react';
import { X, AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { AppError } from '../hooks/useErrorHandler';

interface ErrorToastProps {
  error: AppError;
  onClose: (id: string) => void;
}

export function ErrorToast({ error, onClose }: ErrorToastProps) {
  useEffect(() => {
    // Auto-close after certain time for non-error types
    if (error.type === 'success' || error.type === 'info') {
      const timer = setTimeout(() => {
        onClose(error.id);
      }, error.type === 'success' ? 5000 : 10000);

      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  const getIcon = () => {
    switch (error.type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (error.type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getBgColor()} shadow-lg max-w-md animate-in slide-in-from-right-2`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm">{error.title}</h4>
          <p className="text-gray-700 text-sm mt-1">{error.message}</p>
          {error.action && (
            <button
              onClick={error.action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
            >
              {error.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onClose(error.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
