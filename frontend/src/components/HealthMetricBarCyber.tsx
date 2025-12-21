interface HealthMetricBarCyberProps {
  label: string;
  value: number;
  normalRange: [number, number];
  maxValue: number;
  unit: string;
  icon?: React.ReactNode;
}

export default function HealthMetricBarCyber({
  label,
  value,
  normalRange,
  maxValue,
  unit,
  icon,
}: HealthMetricBarCyberProps) {
  const [min, max] = normalRange;
  const isNormal = value >= min && value <= max;
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  // Neon colors based on risk
  const getColors = () => {
    if (isNormal) return { bar: '#00ffff', glow: 'rgba(0, 255, 255, 0.5)', text: '#00ffff' };
    const deviation = Math.abs(value - (max + min) / 2) / ((max - min) / 2);
    if (deviation > 1.5) return { bar: '#ff0080', glow: 'rgba(255, 0, 128, 0.5)', text: '#ff0080' };
    return { bar: '#ffff00', glow: 'rgba(255, 255, 0, 0.5)', text: '#ffff00' };
  };

  const colors = getColors();

  return (
    <div className="space-y-3 p-4 rounded-lg relative overflow-hidden"
         style={{
           background: 'rgba(0, 0, 0, 0.5)',
           border: `1px solid ${colors.bar}40`,
           boxShadow: `0 0 20px ${colors.glow}`,
         }}>
      
      {/* Scanline effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
           style={{ animation: 'scanHorizontal 2s ease-in-out infinite' }}
      />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {icon && <div style={{ color: colors.text, filter: `drop-shadow(0 0 5px ${colors.text})` }}>{icon}</div>}
          <span className="text-sm font-bold uppercase tracking-wider" style={{ color: colors.text }}>
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono" 
                style={{ 
                  color: colors.text,
                  textShadow: `0 0 10px ${colors.text}`,
                }}>
            {value}
          </span>
          <span className="text-xs text-cyan-400">{unit}</span>
        </div>
      </div>

      {/* Energy bar */}
      <div className="relative h-3 rounded-full overflow-hidden"
           style={{ background: 'rgba(0, 0, 0, 0.8)', border: `1px solid ${colors.bar}30` }}>
        {/* Background grid */}
        <div className="absolute inset-0 opacity-20"
             style={{
               backgroundImage: `repeating-linear-gradient(90deg, ${colors.bar} 0px, transparent 1px, transparent 10px)`,
             }}
        />
        
        {/* Energy fill with flowing effect */}
        <div
          className="relative h-full rounded-full"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${colors.bar}80, ${colors.bar})`,
            boxShadow: `0 0 15px ${colors.glow}, inset 0 0 10px ${colors.bar}`,
            transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Flowing light effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 h-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.bar}, transparent)`,
                animation: 'energyFlow 2s linear infinite',
              }}
            />
          </div>
        </div>

        {/* Pulse dot at the end */}
        <div
          className="absolute top-1/2 h-4 w-4 rounded-full transform -translate-y-1/2"
          style={{
            left: `calc(${percentage}% - 8px)`,
            background: colors.bar,
            boxShadow: `0 0 15px ${colors.glow}, 0 0 30px ${colors.glow}`,
            animation: 'energyPulse 1s ease-in-out infinite',
          }}
        />
      </div>

      {!isNormal && (
        <div className="flex items-center gap-2 text-xs relative z-10">
          <div className="w-2 h-2 rounded-full animate-pulse" 
               style={{ background: colors.bar, boxShadow: `0 0 10px ${colors.glow}` }}
          />
          <span style={{ color: colors.text }}>
            ⚠ OUTSIDE RANGE ({min}-{max}{unit})
          </span>
        </div>
      )}

      <style>{`
        @keyframes energyFlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes energyPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.7; }
        }
        @keyframes scanHorizontal {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(200%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

















