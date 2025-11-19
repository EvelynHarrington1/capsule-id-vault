import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { BarChart3, Zap, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

export function PerformanceDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const { getAverageMetrics, clearMetrics } = usePerformanceMonitor();

  const metrics = getAverageMetrics();

  const handleClearMetrics = () => {
    clearMetrics();
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Performance
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Performance Monitor</CardTitle>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <CardDescription>
            FHE operations performance metrics
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Zap className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <div className="font-semibold text-blue-700">
                {metrics.avgEncryptionTime.toFixed(0)}ms
              </div>
              <div className="text-gray-600">FHE Encrypt</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Clock className="w-4 h-4 mx-auto mb-1 text-green-500" />
              <div className="font-semibold text-green-700">
                {metrics.avgContractCallTime.toFixed(0)}ms
              </div>
              <div className="text-gray-600">Contract Call</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-purple-500" />
              <div className="font-semibold text-purple-700">
                {metrics.avgDecryptionTime.toFixed(0)}ms
              </div>
              <div className="text-gray-600">FHE Decrypt</div>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <BarChart3 className="w-4 h-4 mx-auto mb-1 text-orange-500" />
              <div className="font-semibold text-orange-700">
                {metrics.avgTotalTime.toFixed(0)}ms
              </div>
              <div className="text-gray-600">Total Time</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-gray-600">
              Total Operations: <span className="font-semibold">{metrics.totalOperations}</span>
            </div>
            <Button
              onClick={handleClearMetrics}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Monitor FHE operation performance and gas usage in real-time.
            Metrics are collected from user interactions.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
