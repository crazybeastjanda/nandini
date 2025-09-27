
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

import { generateAgenda, generateFollowUps, generateTranscriptAndSummary } from './services/geminiService';
import { 
  mockCalendar, 
  mockPastMeetings, 
  mockSalesRecords, 
  mockFollowUps,
  allBadges,
  mockParticipants
} from './data/mockData';
import type { Meeting, FollowUp, CalendarData, Badge, Participant } from './types';

// Main application component
export default function App(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const [agenda, setAgenda] = useState<string>('');
  const [isAgendaLoading, setIsAgendaLoading] = useState<boolean>(false);

  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps);
  const [isFollowUpsLoading, setIsFollowUpsLoading] = useState<boolean>(false);
  const [meetingNotes, setMeetingNotes] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [summary, setSummary] = useState<string>('');


  const [meetingStreak, setMeetingStreak] = useState<number>(3);
  const [trustScore, setTrustScore] = useState<number>(78);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  const pastMeetings = useMemo(() => mockPastMeetings, []);
  const salesRecords = useMemo(() => mockSalesRecords, []);
  const calendarData = useMemo(() => mockCalendar, []);

  // Effect to check for badge unlocks
  useEffect(() => {
    const checkBadges = () => {
        const newBadges: string[] = [];
        
        // Streak Starter Badge
        if (meetingStreak >= 3 && !unlockedBadges.includes('streak-starter')) {
            newBadges.push('streak-starter');
        }
        // Task Master Badge
        const completedCount = followUps.filter(f => f.completed).length;
        if (completedCount >= 3 && !unlockedBadges.includes('task-master')) {
            newBadges.push('task-master');
        }
        // Trusted Partner Badge
        if (trustScore >= 90 && !unlockedBadges.includes('trusted-partner')) {
            newBadges.push('trusted-partner');
        }

        if (newBadges.length > 0) {
            setUnlockedBadges(prev => [...prev, ...newBadges]);
            // Optional: Show an alert or a more sophisticated notification
            const unlockedBadgeNames = newBadges.map(id => allBadges.find(b => b.id === id)?.name).join(', ');
            alert(`New Badge Unlocked: ${unlockedBadgeNames}!`);
        }
    };
    checkBadges();
  }, [meetingStreak, trustScore, followUps, unlockedBadges]);


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
    // 1. Generate Follow-ups
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

    // 2. Generate Transcript & Summary
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
    // Optionally give points for adding a task
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
    switch(currentPage) {
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
                />;
      case 'inProgress':
        return <MeetingInProgressPage
                  agenda={agenda}
                  distributorNickname={"German Distributor"} // This can be dynamic based on participants
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
      <div key={currentPage}>
        {renderPage()}
      </div>
    </div>
  );
}