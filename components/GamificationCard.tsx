import React from 'react';
import { ShieldCheckIcon, FireIcon } from './icons';

interface GamificationCardProps {
  streak: number;
  trustScore: number;
}

const GamificationCard: React.FC<GamificationCardProps> = ({ streak, trustScore }) => {
  const circumference = 2 * Math.PI * 52; // 2 * pi * radius
  const strokeDashoffset = circumference - (trustScore / 100) * circumference;

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-500/10 rounded-lg">
          <ShieldCheckIcon className="h-6 w-6 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Partnership Pulse</h2>
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {/* Trust Score */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-700"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-green-400 transition-all duration-1000 ease-in-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold text-white">{trustScore}</span>
            <span className="text-sm text-slate-400">Trust Score</span>
          </div>
        </div>

        {/* Meeting Streak */}
        <div className="flex items-center gap-4 bg-slate-700/50 p-4 rounded-xl">
          <FireIcon className="h-10 w-10 text-orange-400 animate-pulse" />
          <div>
            <p className="text-2xl font-bold text-white">{streak}</p>
            <p className="text-slate-400">Meeting Streak</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamificationCard;