interface HealthScoreRingProps {
  score: number;
  maxScore: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

export default function HealthScoreRing({ 
  score, 
  maxScore, 
  color, 
  size = 120,
  strokeWidth = 8 
}: HealthScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // For health score, lower is better, so we invert the percentage
  // Score 0 = 100%, Score 1500 = 0%
  const normalizedScore = Math.max(0, Math.min(maxScore, score));
  const percentage = 100 - (normalizedScore / maxScore) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'stroke-green-400';
      case 'blue':
        return 'stroke-blue-400';
      case 'orange':
        return 'stroke-orange-400';
      case 'red':
        return 'stroke-red-400';
      default:
        return 'stroke-blue-400';
    }
  };

  const getGlowClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]';
      case 'blue':
        return 'drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]';
      case 'orange':
        return 'drop-shadow-[0_0_12px_rgba(249,115,22,0.5)]';
      case 'red':
        return 'drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]';
      default:
        return 'drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]';
    }
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-700/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getColorClass(color)} transition-all duration-1000 ease-out ${getGlowClass(color)}`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getColorClass(color).replace('stroke-', 'text-')}`}>
            {score}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Score</div>
        </div>
      </div>
    </div>
  );
}

