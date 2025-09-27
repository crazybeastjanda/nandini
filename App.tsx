

import React, { useState, useEffect, useMemo } from 'react';

import HomePage from './pages/HomePage';
import SchedulingPage from './pages/SchedulingPage';
import MeetingPrepPage from './pages/MeetingPrepPage';
import FollowUpsPage from './pages/FollowUpsPage';
import PastMeetingsPage from './pages/PastMeetingsPage';
import GamificationPage from './pages/GamificationPage';
import MeetingInProgressPage from './pages/MeetingInProgressPage';
import JoinMeetingPage from './pages/JoinMeetingPage';
import TranscriptPage from './pages/TranscriptPage';
import Header from './components/Header';
import { CheckCircleIcon } from './components/icons';

import { generateAgenda, generateFollowUps, generateTranscriptAndSummary } from './services/geminiService';
import { allBadges } from './data/mockData';
import { getUserData, saveUserData, initializeUser, getCalendarData, UserData } from './data/storage';
import type { Meeting, FollowUp, CalendarData, Badge, Participant, SalesRecord } from './types';

// =================================================================
// START: Inlined Toast Component
// =================================================================
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
        }, 2500);

        const fadeOutTimer = setTimeout(() => {
            onClose();
        }, 3000); // 2500ms visible + 500ms fade-out animation

        return () => {
            clearTimeout(timer);
            clearTimeout(fadeOutTimer);
        };
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90';

    return (
        <div 
            className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} ${isFadingOut ? 'animate-toast-out' : 'animate-toast-in'}`}
            role="alert"
        >
            <CheckCircleIcon className="w-6 h-6 mr-3"/>
            <span className="font-semibold">{message}</span>
        </div>
    );
};
// =================================================================
// END: Inlined Toast Component
// =================================================================


// =================================================================
// START: Inlined AuthPage Component
// =================================================================
interface AuthPageProps {
  onLogin: (token: string) => void;
  onRegister: (token: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin(`mock-token-for-${email}`);
    } else {
      onRegister(`mock-token-for-${email}`);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-slate-800/50 rounded-2xl p-8 ring-1 ring-white/10 shadow-2xl animate-content-fade-in">
        <h1 className="text-4xl font-black tracking-tighter text-center bg-gradient-to-r from-cyan-400 to-indigo-500 text-transparent bg-clip-text mb-2">
          {isLoginView ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-slate-400 text-center mb-8">
          {isLoginView ? 'Log in to access your meeting dashboard.' : 'Join Discusso to streamline your meetings.'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="mt-1 block w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="mt-1 block w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-transform transform hover:scale-105">
            {isLoginView ? 'Log In' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-cyan-400 hover:text-cyan-300 ml-2">
            {isLoginView ? 'Register' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};
// =================================================================
// END: Inlined AuthPage Component
// =================================================================


// Main application component
export default function App(): React.ReactElement {
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [currentPage, setCurrentPage] = useState<string>('home');
  // User-scoped state
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [agenda, setAgenda] = useState<string>('');
  const [isAgendaLoading, setIsAgendaLoading] = useState<boolean>(false);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isFollowUpsLoading, setIsFollowUpsLoading] = useState<boolean>(false);
  const [meetingNotes, setMeetingNotes] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [meetingStreak, setMeetingStreak] = useState<number>(0);
  const [trustScore, setTrustScore] = useState<number>(75);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([]);
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);

  const calendarData = useMemo(() => getCalendarData(), []);

  // Effect to load user data when auth token changes (on login/refresh)
  useEffect(() => {
    if (authToken) {
      const data = getUserData(authToken);
      setParticipants(data.participants);
      setFollowUps(data.followUps);
      setMeetingStreak(data.meetingStreak);
      setTrustScore(data.trustScore);
      setUnlockedBadges(data.unlockedBadges);
      setPastMeetings(data.pastMeetings);
      setSalesRecords(data.salesRecords);
      setSelectedSlot(data.selectedSlot);
      setAgenda(data.agenda);
      setMeetingNotes(data.meetingNotes);
      setTranscript(data.transcript);
      setSummary(data.summary);
    }
  }, [authToken]);

  // Create a memoized object of the current user's data
  const currentUserData = useMemo((): UserData => ({
    participants,
    pastMeetings,
    salesRecords,
    followUps,
    meetingStreak,
    trustScore,
    unlockedBadges,
    selectedSlot,
    agenda,
    meetingNotes,
    transcript,
    summary,
  }), [
      participants, pastMeetings, salesRecords, followUps, meetingStreak, trustScore,
      unlockedBadges, selectedSlot, agenda, meetingNotes, transcript, summary
  ]);

  // Effect to save data to localStorage whenever it changes for the logged-in user
  useEffect(() => {
    if (authToken) {
      saveUserData(authToken, currentUserData);
    }
  }, [authToken, currentUserData]);

  // Effect to check for badge unlocks
  useEffect(() => {
    const checkBadges = () => {
        const newBadges: string[] = [];
        
        if (meetingStreak >= 3 && !unlockedBadges.includes('streak-starter')) {
            newBadges.push('streak-starter');
        }
        const completedCount = followUps.filter(f => f.completed).length;
        if (completedCount >= 3 && !unlockedBadges.includes('task-master')) {
            newBadges.push('task-master');
        }
        if (trustScore >= 90 && !unlockedBadges.includes('trusted-partner')) {
            newBadges.push('trusted-partner');
        }

        if (newBadges.length > 0) {
            setUnlockedBadges(prev => [...prev, ...newBadges]);
            const unlockedBadgeNames = newBadges.map(id => allBadges.find(b => b.id === id)?.name).join(', ');
            setToast({ message: `New Badge Unlocked: ${unlockedBadgeNames}!`, type: 'success' });
        }
    };
    if (authToken) {
        checkBadges();
    }
  }, [meetingStreak, trustScore, followUps, unlockedBadges, authToken]);


  const generateAndSetAgenda = async () => {
    if (!agenda) {
        setIsAgendaLoading(true);
        try {
          const generatedAgenda = await generateAgenda(pastMeetings, salesRecords);
          setAgenda(generatedAgenda);
        } catch (error) {
          console.error("Failed to generate agenda:", error);
          setAgenda("Could not generate agenda. Please try again.");
        } finally {
          setIsAgendaLoading(false);
        }
    }
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setCurrentPage('prep');
  };

  const handleMeetingConclude = async () => {
    setCurrentPage('followUps');
    setIsFollowUpsLoading(true);
    try {
        const latestMeetingSummary = "The meeting focused on Q3 sales performance and the new 'QuantumLeap' product launch. Discussed increasing marketing budget for the DACH region and addressing customer feedback on UI improvements.";
        const generatedFollowUps = await generateFollowUps(latestMeetingSummary);
        const newFollowUps: FollowUp[] = generatedFollowUps.map(fu => ({...fu, completed: false}));
        setFollowUps(prev => [...newFollowUps, ...prev]);
        
        setMeetingStreak(s => s + 1);
        setTrustScore(t => Math.min(100, t + 5));

    } catch (error) {
        console.error("Failed to generate follow-ups:", error);
    } finally {
        setIsFollowUpsLoading(false);
    }

    try {
        const { transcript, summary } = await generateTranscriptAndSummary(agenda, meetingNotes);
        setTranscript(transcript);
        setSummary(summary);
    } catch (error) {
        console.error("Failed to generate transcript/summary:", error);
        setSummary("Could not generate summary.");
        setTranscript("Could not generate transcript.");
    }
  };
  
  const resetMeeting = () => {
      setSelectedSlot(null);
      setAgenda('');
      setMeetingNotes('');
      setTranscript('');
      setSummary('');
      setCurrentPage('home');
  }

  const handleLogin = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    setCurrentPage('home');
    setToast({ message: 'Logged in successfully!', type: 'success' });
  };

  const handleRegister = (token: string) => {
    initializeUser(token);
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    setCurrentPage('home');
    setToast({ message: 'Registration successful!', type: 'success' });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    // Reset all application state to initial values
    setParticipants([]);
    setSelectedSlot(null);
    setAgenda('');
    setFollowUps([]);
    setMeetingNotes('');
    setTranscript('');
    setSummary('');
    setMeetingStreak(0);
    setTrustScore(75);
    setUnlockedBadges([]);
    setPastMeetings([]);
    setSalesRecords([]);
    setCurrentPage('home');
    setToast({ message: 'Logged out successfully.', type: 'success' });
  };

  const claimBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
        setUnlockedBadges(prev => [...prev, badgeId]);
        const badge = allBadges.find(b => b.id === badgeId);
        if (badge) {
            setToast({ message: `Reward Claimed: ${badge.name}!`, type: 'success' });
        }
    }
  };

  const toggleFollowUp = (task: string) => {
    setFollowUps(currentFollowUps =>
      currentFollowUps.map(fu =>
        fu.task === task ? { ...fu, completed: !fu.completed } : fu
      )
    );
    const wasCompleted = followUps.find(fu => fu.task === task)?.completed;
    if(!wasCompleted) {
        setTrustScore(t => Math.min(100, t + 2));
    } else {
        setTrustScore(t => Math.max(0, t - 2));
    }
  };

  const addFollowUp = (newFollowUp: Omit<FollowUp, 'completed'>) => {
    setFollowUps(prev => [{ ...newFollowUp, completed: false }, ...prev]);
    setTrustScore(t => Math.min(100, t + 1));
  };

  const updateParticipantNickname = (participantId: string, nickname: string) => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === participantId ? { ...p, nickname } : p
      )
    );
  };

  const renderPage = () => {
    const protectedPages = ['schedule', 'prep', 'followUps', 'pastMeetings', 'gamification', 'inProgress', 'joinMeeting', 'transcript'];
    const isProtected = protectedPages.includes(currentPage);

    if (isProtected && !authToken) {
      return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
    }
    
    switch(currentPage) {
      case 'auth':
        if (authToken) {
          return <HomePage 
            setCurrentPage={setCurrentPage} 
            isMeetingReady={!!selectedSlot && !!agenda}
            isMeetingConcluded={!!summary}
            resetMeeting={resetMeeting}
            unlockedBadges={unlockedBadges}
          />;
        }
        return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
      case 'schedule':
        return <SchedulingPage 
                  onBack={() => setCurrentPage('home')} 
                  calendarData={calendarData} 
                  onSlotSelect={handleSlotSelect} 
                />;
      case 'prep':
        return <MeetingPrepPage 
                  onBack={() => setCurrentPage('home')}
                  agenda={agenda}
                  setAgenda={setAgenda}
                  isAgendaLoading={isAgendaLoading}
                  generateAgenda={generateAndSetAgenda}
                  pastMeetings={pastMeetings}
                  onStartMeeting={() => setCurrentPage('inProgress')}
                  isMeetingReady={!!selectedSlot}
                />;
      case 'followUps':
        return <FollowUpsPage 
                  onBack={() => setCurrentPage('home')}
                  followUps={followUps}
                  isFollowUpsLoading={isFollowUpsLoading}
                  toggleFollowUp={toggleFollowUp}
                  addFollowUp={addFollowUp}
                />;
      case 'pastMeetings':
        return <PastMeetingsPage
                  onBack={() => setCurrentPage('home')}
                  meetings={pastMeetings}
                  participants={participants}
                  updateNickname={updateParticipantNickname}
                />;
      case 'gamification':
        return <GamificationPage
                  onBack={() => setCurrentPage('home')}
                  unlockedBadges={unlockedBadges}
                  meetingStreak={meetingStreak}
                  trustScore={trustScore}
                  claimBadge={claimBadge}
                />;
      case 'inProgress':
        return <MeetingInProgressPage
                  agenda={agenda}
                  distributorNickname={"German Distributor"}
                  selectedSlot={selectedSlot}
                  onConclude={handleMeetingConclude}
                  notes={meetingNotes}
                  setNotes={setMeetingNotes}
                />;
      case 'joinMeeting':
        return <JoinMeetingPage
                  onBack={() => setCurrentPage('home')}
                  isMeetingReady={!!selectedSlot && !!agenda}
                  onJoinMeeting={() => setCurrentPage('inProgress')}
                  onScheduleNew={() => setCurrentPage('schedule')}
               />;
      case 'transcript':
        return <TranscriptPage
                  onBack={() => setCurrentPage('home')}
                  transcript={transcript}
                  summary={summary}
               />;
      case 'home':
      default:
        if (!authToken && currentPage === 'home') {
            return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
        }
        return <HomePage 
                  setCurrentPage={setCurrentPage} 
                  isMeetingReady={!!selectedSlot && !!agenda}
                  isMeetingConcluded={!!summary}
                  resetMeeting={resetMeeting}
                  unlockedBadges={unlockedBadges}
                />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 animate-gradient-xy -z-10"></div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Header 
        isAuthenticated={!!authToken}
        onLogout={handleLogout}
        setCurrentPage={setCurrentPage}
      />
      <div key={currentPage}>
        {renderPage()}
      </div>
    </div>
  );
}
