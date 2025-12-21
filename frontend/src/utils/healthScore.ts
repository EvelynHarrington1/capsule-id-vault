export type HealthScoreLevel = 'excellent' | 'good' | 'fair' | 'poor';

export interface HealthScoreInfo {
  level: HealthScoreLevel;
  color: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  icon: string;
  message: string;
  suggestion: string;
  percentage: number; // 0-100 for progress ring
}

export function getHealthScoreInfo(score: number): HealthScoreInfo {
  if (score <= 500) {
    return {
      level: 'excellent',
      color: 'green',
      bgGradient: 'from-transparent to-transparent',
      borderColor: 'border-green-500/15',
      textColor: 'text-green-400',
      icon: '',
      message: 'Status: Optimal',
      suggestion: 'All metrics within optimal range. Continue current health protocol.',
      percentage: Math.min(100, (500 - score) / 500 * 100),
    };
  } else if (score <= 750) {
    return {
      level: 'good',
      color: 'blue',
      bgGradient: 'from-transparent to-transparent',
      borderColor: 'border-blue-500/15',
      textColor: 'text-blue-400',
      icon: '',
      message: 'Status: Normal',
      suggestion: 'Metrics within acceptable range. Regular monitoring recommended.',
      percentage: Math.min(100, (750 - score) / 250 * 100 + 60),
    };
  } else if (score <= 1000) {
    return {
      level: 'fair',
      color: 'orange',
      bgGradient: 'from-transparent to-transparent',
      borderColor: 'border-orange-500/20',
      textColor: 'text-orange-400',
      icon: '',
      message: 'Status: Monitoring',
      suggestion: 'Elevated metrics detected. Lifestyle adjustments advised.',
      percentage: Math.min(100, (1000 - score) / 250 * 100 + 30),
    };
  } else {
    return {
      level: 'poor',
      color: 'red',
      bgGradient: 'from-transparent to-transparent',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      icon: '',
      message: 'Status: Attention Required',
      suggestion: 'Critical metrics identified. Medical consultation recommended.',
      percentage: Math.min(100, Math.max(0, (1500 - score) / 500 * 100)),
    };
  }
}

export function getHealthScoreClass(score: number): string {
  if (score <= 500) return 'health-score-excellent';
  if (score <= 750) return 'health-score-good';
  if (score <= 1000) return 'health-score-fair';
  return 'health-score-poor';
}

