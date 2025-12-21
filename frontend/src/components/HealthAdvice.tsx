import { getHealthScoreInfo } from '../utils/healthScore';

interface HealthAdviceProps {
  score: number;
  bmi: number;
  bloodSugar: number;
  heartRate: number;
}

export default function HealthAdvice({ score, bmi, bloodSugar, heartRate }: HealthAdviceProps) {
  const scoreInfo = getHealthScoreInfo(score);
  const suggestions: string[] = [];

  // BMI analysis
  if (bmi < 18.5) {
    suggestions.push('BMI below reference range. Nutritional assessment recommended.');
  } else if (bmi > 25) {
    suggestions.push('BMI above reference range. Lifestyle modification advised.');
  }

  // Blood sugar analysis
  if (bloodSugar > 100) {
    suggestions.push('Elevated glucose levels detected. Dietary adjustment recommended.');
  } else if (bloodSugar < 70) {
    suggestions.push('Low glucose levels detected. Frequent monitoring advised.');
  }

  // Heart rate analysis
  if (heartRate > 100) {
    suggestions.push('Elevated heart rate observed. Cardiovascular assessment advised.');
  } else if (heartRate < 60) {
    suggestions.push('Low heart rate observed. Clinical correlation recommended.');
  }

  // General health analysis based on score
  if (score > 750) {
    suggestions.push('Multiple parameters outside optimal range. Comprehensive evaluation recommended.');
  }

  const allSuggestions = [scoreInfo.suggestion, ...suggestions].slice(0, 3);

  const getNeonColor = () => {
    if (score <= 500) return '#00ff00';
    if (score <= 750) return '#00ffff';
    if (score <= 1000) return '#ffff00';
    return '#ff0080';
  };

  const neonColor = getNeonColor();

  return (
    <div className="glass-effect rounded-xl p-6 relative overflow-hidden"
         style={{
           border: `2px solid ${neonColor}40`,
           boxShadow: `0 0 30px ${neonColor}30`,
         }}>
      
      {/* Corner decorations */}
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 opacity-30"
           style={{ borderColor: neonColor }}
      />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 opacity-30"
           style={{ borderColor: neonColor }}
      />

      <div className="relative z-10">
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full animate-pulse"
                 style={{ 
                   background: neonColor,
                   boxShadow: `0 0 15px ${neonColor}`,
                 }}
            />
            <h4 className="text-sm font-black uppercase tracking-[0.2em]"
                style={{
                  color: neonColor,
                  textShadow: `0 0 15px ${neonColor}`,
                }}>
              ⚡ SYSTEM ANALYSIS
            </h4>
          </div>
          <p className="text-base font-bold"
             style={{ color: neonColor }}>
            {scoreInfo.message}
          </p>
        </div>
        
        <div className="space-y-3">
          {allSuggestions.map((suggestion, index) => (
            <div key={index} 
                 className="flex items-start gap-3 p-2 rounded"
                 style={{
                   background: `${neonColor}10`,
                   border: `1px solid ${neonColor}20`,
                 }}>
              <div className="flex-shrink-0 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: neonColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm text-cyan-100 leading-relaxed">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

