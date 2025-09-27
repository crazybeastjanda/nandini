import React from 'react';
import { allBadges } from '../data/mockData';

interface BadgesShowcaseProps {
  unlockedBadgeIds: string[];
}

const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({ unlockedBadgeIds }) => {
  if (unlockedBadgeIds.length === 0) {
    return null; // Don't render anything if no badges are unlocked
  }

  const unlockedBadges = allBadges.filter(badge => unlockedBadgeIds.includes(badge.id));

  return (
    <div className="mt-12 stagger-children">
      <h3 className="text-2xl font-bold text-center text-slate-200 tracking-tight" style={{ animationDelay: '100ms' }}>Your Achievements</h3>
      <div className="mt-6 flex items-center justify-center gap-6" style={{ animationDelay: '200ms' }}>
        {unlockedBadges.map((badge, index) => (
          <div key={badge.id} className="group relative flex flex-col items-center" style={{ animationDelay: `${300 + index * 100}ms` }}>
            <div className="p-4 bg-slate-800/60 rounded-full ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-500/10 transition-transform duration-300 group-hover:scale-110">
                {badge.icon}
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-300">{badge.name}</p>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 w-48 bg-slate-900 text-slate-300 text-xs text-center rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-white/10 shadow-xl">
              {badge.description}
              <svg className="absolute text-slate-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesShowcase;