

import React from 'react';
import PageShell from '../components/PageShell';
import GamificationCard from '../components/GamificationCard';
import { TrophyIcon, CheckCircleIcon } from '../components/icons';
import { allBadges } from '../data/mockData';

interface GamificationPageProps {
  onBack: () => void;
  unlockedBadges: string[];
  meetingStreak: number;
  trustScore: number;
  claimBadge: (badgeId: string) => void;
}

const GamificationPage: React.FC<GamificationPageProps> = ({ onBack, unlockedBadges, meetingStreak, trustScore, claimBadge }) => {

    return (
        <PageShell
            title="Your Achievements"
            description="Track your progress and view the badges you have earned by being a great partner."
            icon={<TrophyIcon className="h-10 w-10 text-green-400" />}
            onBack={onBack}
        >
            <div className="space-y-8">
                <div className="bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10 animate-content-fade-in">
                    <GamificationCard streak={meetingStreak} trustScore={trustScore} />
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10 animate-content-fade-in" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-2xl font-bold text-white mb-6">Badge Collection</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allBadges.map(badge => {
                            const isUnlocked = unlockedBadges.includes(badge.id);
                            const isClaimable = badge.id === 'task-master' && !isUnlocked;
                            return (
                                <div
                                    key={badge.id}
                                    className={`p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ring-1 ${
                                        isUnlocked
                                            ? 'bg-green-500/10 ring-green-400/50 shadow-lg shadow-green-500/10'
                                            : isClaimable
                                            ? 'bg-purple-500/10 ring-purple-400/50 shadow-lg shadow-purple-500/10'
                                            : 'bg-slate-700/50 ring-slate-600 opacity-70'
                                    }`}
                                >
                                    <div className={`relative mb-4 ${isUnlocked ? 'animate-pulse' : ''}`}>
                                        {badge.icon}
                                        {isUnlocked && (
                                            <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full">
                                                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{badge.name}</h3>
                                    <p className="text-sm text-slate-400 mt-2 flex-grow">{badge.description}</p>
                                    {isUnlocked ? (
                                        <p className="text-xs font-bold text-green-300 mt-4 uppercase tracking-wider">Unlocked</p>
                                    ) : isClaimable ? (
                                        <button 
                                            onClick={() => claimBadge(badge.id)}
                                            className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                                        >
                                            Claim for Free
                                        </button>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default GamificationPage;
