interface EnergyRingProps {
  score: number;
  maxScore: number;
  size?: number;
}

export default function EnergyRing({ score, maxScore, size = 200 }: EnergyRingProps) {
  const percentage = Math.min(100, (score / maxScore) * 100);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (score <= 500) return { primary: '#00ff00', secondary: '#00ffff' };
    if (score <= 750) return { primary: '#00ffff', secondary: '#0080ff' };
    if (score <= 1000) return { primary: '#ffff00', secondary: '#ff8800' };
    return { primary: '#ff0080', secondary: '#ff00ff' };
  };

  const colors = getColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, transparent 60%, ${colors.primary}20 70%, transparent 80%)`,
          animation: 'rotate 10s linear infinite',
        }}
      />
      
      {/* Middle ring */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 transform -rotate-90"
        style={{ filter: `drop-shadow(0 0 20px ${colors.primary}80)` }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`${colors.primary}30`}
          strokeWidth={4}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${score})`}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 15px ${colors.primary})`,
            transition: 'stroke-dashoffset 2s ease-out',
          }}
        />
        <defs>
          <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        </defs>
      </svg>

      {/* Inner energy particles */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: colors.primary,
              boxShadow: `0 0 10px ${colors.primary}`,
              left: '50%',
              top: '50%',
              animation: `orbit ${5 + i}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(${radius}px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(${radius}px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}

















