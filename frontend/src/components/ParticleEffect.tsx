import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface ParticleEffectProps {
  color?: 'green' | 'blue' | 'orange' | 'red';
  particleCount?: number;
  enabled?: boolean;
}

export default function ParticleEffect({ 
  color = 'green', 
  particleCount = 20,
  enabled = true 
}: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [enabled, particleCount]);

  const colorConfig = {
    green: { bg: 'bg-green-400', glow: '#00ff00', shadow: '0 0 10px #00ff00' },
    blue: { bg: 'bg-cyan-400', glow: '#00ffff', shadow: '0 0 10px #00ffff' },
    orange: { bg: 'bg-yellow-400', glow: '#ffff00', shadow: '0 0 10px #ffff00' },
    red: { bg: 'bg-pink-400', glow: '#ff0080', shadow: '0 0 10px #ff0080' },
  };

  const config = colorConfig[color];

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const tx = (Math.random() - 0.5) * 100;
        const ty = (Math.random() - 0.5) * 100;
        return (
          <div
            key={particle.id}
            className={`absolute w-2 h-2 ${config.bg} rounded-full`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              boxShadow: config.shadow,
              filter: `blur(${Math.random() * 2}px)`,
              animation: `cyberParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
            } as React.CSSProperties & { '--tx'?: string; '--ty'?: string }}
          />
        );
      })}
      <style>{`
        @keyframes cyberParticle {
          0%, 100% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
          }
          10% { opacity: 1; }
          50% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0.8;
          }
          90% { opacity: 1; }
          100% {
            transform: translate(calc(var(--tx) * 2), calc(var(--ty) * 2)) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

