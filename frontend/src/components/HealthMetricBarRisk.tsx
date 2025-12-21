interface HealthMetricBarRiskProps {
  label: string;
  value: number;
  normalRange: [number, number];
  maxValue: number;
  unit: string;
  icon?: React.ReactNode;
}

export default function HealthMetricBarRisk({
  label,
  value,
  normalRange,
  maxValue,
  unit,
  icon,
}: HealthMetricBarRiskProps) {
  const [min, max] = normalRange;
  const isNormal = value >= min && value <= max;
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  // Calculate risk severity
  const midpoint = (max + min) / 2;
  const range = (max - min) / 2;
  const deviation = Math.abs(value - midpoint) / range;
  const isHighRisk = deviation > 1.5;
  
  // Risk-based styling
  const barColor = isNormal 
    ? 'bg-slate-600' 
    : isHighRisk 
      ? 'bg-red-500' 
      : 'bg-orange-500';
  
  const valueColor = isNormal 
    ? 'text-slate-400' 
    : isHighRisk 
      ? 'text-red-400' 
      : 'text-orange-400';
  
  const labelColor = isNormal ? 'text-slate-500' : 'text-slate-300';
  
  const glowEffect = !isNormal && isHighRisk 
    ? 'shadow-[0_0_12px_rgba(239,68,68,0.15)]' 
    : '';
  
  const elevationClass = !isNormal && isHighRisk 
    ? 'transform -translate-y-0.5' 
    : '';

  return (
    <div className={`space-y-2 transition-all duration-300 ${elevationClass} ${isNormal ? 'opacity-60' : 'opacity-100'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className={valueColor}>{icon}</div>}
          <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-base font-semibold font-mono ${valueColor}`}>
            {value}
          </span>
          <span className="text-xs text-slate-500">{unit}</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-slate-800/50 overflow-hidden">
        <div
          className={`h-full ${barColor} ${glowEffect} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!isNormal && (
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span className={valueColor}>●</span>
          <span>Outside normal range ({min}-{max}{unit})</span>
        </div>
      )}
    </div>
  );
}

















