import React from 'react';
import { Flame, SunMedium, Snowflake } from 'lucide-react';
import { LeadCategory } from '../types';

interface ScoreGaugeProps {
  score?: number;
  category?: LeadCategory;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  category,
  size = 'md',
  showLabel = true,
}) => {
  const currentScore = typeof score === 'number' ? score : 0;
  const determinedCategory: LeadCategory =
    category || (currentScore >= 80 ? 'Hot' : currentScore >= 50 ? 'Warm' : 'Cold');

  const getColorTheme = () => {
    switch (determinedCategory) {
      case 'Hot':
        return {
          text: 'text-rose-500',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          gradient: 'from-rose-500 to-amber-500',
          icon: Flame,
          label: 'Hot Lead',
          badgeBg: 'bg-rose-500 text-white',
        };
      case 'Warm':
        return {
          text: 'text-amber-500',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          gradient: 'from-amber-500 to-yellow-400',
          icon: SunMedium,
          label: 'Warm Lead',
          badgeBg: 'bg-amber-500 text-white',
        };
      case 'Cold':
      default:
        return {
          text: 'text-sky-500',
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/30',
          gradient: 'from-sky-500 to-blue-400',
          icon: Snowflake,
          label: 'Cold Lead',
          badgeBg: 'bg-sky-500 text-white',
        };
    }
  };

  const theme = getColorTheme();
  const Icon = theme.icon;

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${theme.bg} ${theme.border} ${theme.text}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{score !== undefined ? `${score}/100` : theme.label}</span>
      </div>
    );
  }

  // Circular gauge for medium/large
  const radius = size === 'lg' ? 42 : 28;
  const stroke = size === 'lg' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg
          className={`transform -rotate-90 ${size === 'lg' ? 'w-28 h-28' : 'w-20 h-20'}`}
        >
          {/* Background circle */}
          <circle
            cx={size === 'lg' ? 56 : 40}
            cy={size === 'lg' ? 56 : 40}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx={size === 'lg' ? 56 : 40}
            cy={size === 'lg' ? 56 : 40}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className={`${theme.text} transition-all duration-1000 ease-out`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-extrabold ${size === 'lg' ? 'text-2xl' : 'text-base'} text-slate-900 dark:text-white`}>
            {score !== undefined ? score : '--'}
          </span>
          <span className="text-[10px] text-slate-500 font-medium -mt-1">/100</span>
        </div>
      </div>

      {showLabel && (
        <div className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${theme.bg} ${theme.text} border ${theme.border}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{theme.label}</span>
        </div>
      )}
    </div>
  );
};
