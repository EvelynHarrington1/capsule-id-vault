interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  description: string;
  highlight?: boolean;
  trend?: 'up' | 'down';
}

export default function StatsCard({ title, value, icon, description, highlight, trend }: StatsCardProps) {
  return (
    <div className={`glass-effect rounded-xl p-6 transition-all hover:scale-105 ${highlight ? 'gradient-border' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          highlight 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
            : 'bg-slate-700 text-slate-300'
        }`}>
          {title}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        {trend && (
          <span className={`text-sm mb-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div className="text-sm text-slate-400">{description}</div>
    </div>
  );
}

