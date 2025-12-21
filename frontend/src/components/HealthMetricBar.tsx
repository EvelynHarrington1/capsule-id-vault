interface HealthMetricBarProps {
  label: string;
  value: number;
  maxValue: number;
  unit: string;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  icon?: React.ReactNode;
}

export default function HealthMetricBar({
  label,
  value,
  maxValue,
  unit,
  color = 'blue',
  icon,
}: HealthMetricBarProps) {
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/20',
      bar: 'bg-gradient-to-r from-blue-500 to-blue-400',
      text: 'text-blue-400',
      glow: 'shadow-[0_0_12px_rgba(59,130,246,0.4)]',
    },
    purple: {
      bg: 'bg-purple-500/20',
      bar: 'bg-gradient-to-r from-purple-500 to-purple-400',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.4)]',
    },
    green: {
      bg: 'bg-green-500/20',
      bar: 'bg-gradient-to-r from-green-500 to-green-400',
      text: 'text-green-400',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    },
    orange: {
      bg: 'bg-orange-500/20',
      bar: 'bg-gradient-to-r from-orange-500 to-orange-400',
      text: 'text-orange-400',
      glow: 'shadow-[0_0_12px_rgba(249,115,22,0.4)]',
    },
    red: {
      bg: 'bg-red-500/20',
      bar: 'bg-gradient-to-r from-red-500 to-red-400',
      text: 'text-red-400',
      glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className={colors.text}>{icon}</div>}
          <span className="text-xs font-medium text-slate-400">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-base font-semibold ${colors.text}`}>
            {value}
          </span>
          <span className="text-xs text-slate-500">{unit}</span>
        </div>
      </div>
      <div className={`h-2 rounded-full ${colors.bg} overflow-hidden`}>
        <div
          className={`h-full ${colors.bar} ${colors.glow} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

