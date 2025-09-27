import React, { useState, useMemo } from 'react';
import PageShell from '../components/PageShell';
import ScheduleCard from '../components/ScheduleCard';
import { CalendarDaysIcon } from '../components/icons';
import type { CalendarData, CalendarSlot } from '../types';

interface SchedulingPageProps {
  onBack: () => void;
  calendarData: CalendarData;
  onSlotSelect: (slot: string) => void;
}

// A helper to find overlapping free slots (moved from ScheduleCard to be used here)
const findOverlappingSlots = (chennaiSlots: CalendarSlot[], germanySlots: CalendarSlot[]): string[] => {
  const overlaps: string[] = [];
  const germanySlotsUTC = germanySlots.map(slot => ({
    start: new Date(slot.start).getTime(),
    end: new Date(slot.end).getTime()
  }));

  for (const chennaiSlot of chennaiSlots) {
    const chennaiStartUTC = new Date(chennaiSlot.start).getTime();
    const chennaiEndUTC = new Date(chennaiSlot.end).getTime();

    for (const germanySlotUTC of germanySlotsUTC) {
      const overlapStart = Math.max(chennaiStartUTC, germanySlotUTC.start);
      const overlapEnd = Math.min(chennaiEndUTC, germanySlotUTC.end);

      if (overlapEnd - overlapStart >= 30 * 60 * 1000) {
        const overlapDate = new Date(overlapStart);
        const chennaiTime = overlapDate.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
        const germanyTime = overlapDate.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hour12: false });
        overlaps.push(`${chennaiTime} IST / ${germanyTime} CEST`);
      }
    }
  }
  return [...new Set(overlaps)];
};

const SchedulingPage: React.FC<SchedulingPageProps> = ({ onBack, calendarData, onSlotSelect }) => {
    const [activeView, setActiveView] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const availableSlots = useMemo(() => findOverlappingSlots(calendarData.chennai, calendarData.germany), [calendarData]);

    const syncCalendar = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            alert('Calendars synced successfully!');
        }, 1500);
    };

    const autoPickBestTime = () => {
        if (availableSlots.length > 0) {
            onSlotSelect(availableSlots[0]);
        } else {
            alert("No available slots to auto-pick.");
        }
    };
    
    const handleScheduleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const topic = formData.get('topic');
        const priority = formData.get('priority');
        alert(`Meeting scheduled!\nTopic: ${topic}\nPriority: ${priority}`);
        e.currentTarget.reset();
    };

    const actions = [
        { id: 'view_slots', label: 'View Suggested Slots', onClick: () => setActiveView('view_slots') },
        { id: 'schedule_new', label: 'Schedule New Meeting', onClick: () => setActiveView('schedule_new') },
        { id: 'sync_calendar', label: isSyncing ? 'Syncing...' : 'Sync Mock Calendar', onClick: syncCalendar, disabled: isSyncing },
        { id: 'auto_pick', label: 'Auto-Pick Best Time', onClick: autoPickBestTime },
    ];

    return (
        <PageShell
            title="Smart Scheduling"
            description="Find the perfect meeting time across time zones with AI-powered suggestions."
            icon={<CalendarDaysIcon className="h-10 w-10 text-cyan-400" />}
            onBack={onBack}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-3 stagger-children">
                    <h3 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-2" style={{ animationDelay: '300ms' }}>Actions</h3>
                    {actions.map((action, index) => (
                        <button
                            key={action.id}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            style={{ animationDelay: `${400 + index * 100}ms` }}
                            className={`w-full text-left p-3 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                                action.disabled ? 'opacity-50 cursor-not-allowed' : ''
                            } ${
                                activeView === action.id ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800/50 hover:bg-slate-700/70 text-slate-300'}`
                            }
                        >
                            {isSyncing && action.id === 'sync_calendar' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-300"></div>}
                            {action.label}
                        </button>
                    ))}
                </div>
                <div key={activeView} className="md:col-span-2 bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10 min-h-[300px] animate-content-fade-in" style={{ animationDelay: '500ms' }}>
                    {activeView === 'view_slots' && (
                        <ScheduleCard calendarData={calendarData} onSlotSelect={onSlotSelect} availableSlots={availableSlots} />
                    )}
                    {activeView === 'schedule_new' && (
                         <div>
                            <h2 className="text-xl font-bold text-white mb-4">Schedule a New Meeting</h2>
                            <form onSubmit={handleScheduleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-1">Meeting Topic</label>
                                    <input type="text" name="topic" id="topic" required className="w-full bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                                    <select name="priority" id="priority" defaultValue="Medium" className="w-full bg-slate-700/50 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 transition">
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                                    Add Meeting
                                </button>
                            </form>
                        </div>
                    )}
                    {!activeView && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-400">Select an action to begin.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
};

export default SchedulingPage;