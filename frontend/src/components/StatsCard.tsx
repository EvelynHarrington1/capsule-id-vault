interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  description: string;
  highlight?: boolean;
  trend?: 'up' | 'down';
}

export default function StatsCard({ title, value, icon, description, highlight, trend }: StatsCardProps) {
  const getIconComponent = () => {
    if (icon === '📊') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    }
    if (icon === '🔒') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`glass-effect rounded-xl p-6 card-hover relative overflow-hidden group ${
      highlight ? 'border border-blue-500/20' : ''
    }`}>
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-blue-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            highlight 
              ? 'bg-gradient-to-br from-blue-500/15 to-purple-600/15 border border-blue-400/25 text-blue-400' 
              : 'bg-slate-700/30 border border-slate-600/30 text-slate-400'
          } transition-transform duration-300 group-hover:scale-110`}>
            {getIconComponent()}
          </div>
          <div className={`px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm ${
            highlight 
              ? 'bg-blue-500/10 border border-blue-400/20 text-blue-300' 
              : 'bg-slate-700/40 border border-slate-600/40 text-slate-400'
          }`}>
            {title}
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className={`text-3xl font-semibold tracking-tight animate-count-up ${
            highlight ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent' : 'text-white'
          }`}>
            {value}
          </div>
          {trend && (
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend === 'up' ? '↗' : '↘'}
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 font-normal">{description}</div>
      </div>
    </div>
  );
}

