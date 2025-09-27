import React from 'react';
import FeatureCard from '../components/FeatureCard';
import BadgesShowcase from '../components/BadgesShowcase';
import { 
    CalendarDaysIcon, 
    ClipboardDocumentListIcon, 
    BellAlertIcon, 
    ArchiveBoxIcon, 
    TrophyIcon, 
    VideoCameraIcon,
    DocumentTextIcon
} from '../components/icons';

interface HomePageProps {
    setCurrentPage: (page: string) => void;
    isMeetingReady: boolean;
    isMeetingConcluded: boolean;
    resetMeeting: () => void;
    unlockedBadges: string[];
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, isMeetingReady, isMeetingConcluded, resetMeeting, unlockedBadges }) => {

  const features = [
    {
      page: 'schedule',
      title: 'Smart Scheduling',
      description: 'Find the perfect meeting time across time zones with AI-powered suggestions.',
      icon: <CalendarDaysIcon className="h-8 w-8 text-cyan-400" />,
      isDisabled: false,
    },
    {
      page: 'joinMeeting',
      title: 'Join Meeting',
      description: 'Jump into your scheduled meeting or join using a link. The agenda and notes are ready for you.',
      icon: <VideoCameraIcon className="h-8 w-8 text-purple-400" />,
      isDisabled: false, 
    },
    {
      page: 'prep',
      title: 'Meeting Prep',
      description: 'Auto-generated agenda and context based on past meetings and sales data.',
      icon: <ClipboardDocumentListIcon className="h-8 w-8 text-indigo-400" />,
      isDisabled: !isMeetingReady,
    },
    {
      page: 'transcript',
      title: 'Transcript & Summary',
      description: 'Review the full meeting transcript and an AI-generated summary of key points and decisions.',
      icon: <DocumentTextIcon className="h-8 w-8 text-pink-400" />,
      isDisabled: !isMeetingConcluded,
    },
    {
      page: 'followUps',
      title: 'Reminders & Follow-ups',
      description: 'Never miss an action item with smart tracking and notifications.',
      icon: <BellAlertIcon className="h-8 w-8 text-red-400" />,
      isDisabled: false,
    },
    {
      page: 'pastMeetings',
      title: 'Past Meetings',
      description: 'Review notes, outcomes, and track your meeting performance over time.',
      icon: <ArchiveBoxIcon className="h-8 w-8 text-yellow-400" />,
      isDisabled: false,
    },
    {
      page: 'gamification',
      title: 'Gamification',
      description: 'Track your progress and view the badges you have earned.',
      icon: <TrophyIcon className="h-8 w-8 text-green-400" />,
      isDisabled: false,
    },
  ];

  return (
    <div className="page-container">
      <main className="mt-8 relative z-10">
        <div className="text-center mb-12 stagger-children">
            <h2 className="text-4xl font-black tracking-tighter text-slate-100 sm:text-5xl lg:text-6xl" style={{ animationDelay: '100ms' }}>Your All-in-One Meeting Assistant</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400" style={{ animationDelay: '200ms' }}>Automate scheduling, supercharge preparation, and track every outcome effortlessly.</p>
        </div>
        
        <BadgesShowcase unlockedBadgeIds={unlockedBadges} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12 stagger-children">
          {features.map((feature, index) => (
            <div key={feature.page} style={{ animationDelay: `${300 + index * 100}ms` }}>
                <FeatureCard 
                key={feature.page}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                onClick={() => setCurrentPage(feature.page)}
                isDisabled={feature.isDisabled}
                className={'h-full'}
                />
            </div>
          ))}
        </div>
        {(isMeetingReady || isMeetingConcluded) && (
          <div className="mt-12 bg-slate-800/50 rounded-xl p-6 flex flex-col items-center justify-center ring-1 ring-white/10 shadow-lg max-w-md mx-auto stagger-children" style={{ animationDelay: '500ms' }}>
            <h3 className="text-lg font-bold text-cyan-400">{isMeetingConcluded ? 'Meeting Flow Complete!' : 'Meeting Ready!'}</h3>
            <p className="text-slate-400 text-center mt-2">{isMeetingConcluded ? "You can review transcripts and follow-ups, or start a new meeting." : "A meeting is scheduled and the agenda is prepared. You can join now."}</p>
            <button 
              onClick={resetMeeting}
              className="mt-4 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Reset & Schedule New
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;