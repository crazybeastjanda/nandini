
import React, { useState, useEffect } from 'react';
import PageShell from '../components/PageShell';
import AgendaCard from '../components/AgendaCard';
import PastMeetingsCard from '../components/PastMeetingsCard';
import { ClipboardDocumentListIcon } from '../components/icons';
import type { Meeting } from '../types';

interface MeetingPrepPageProps {
  onBack: () => void;
  agenda: string;
  setAgenda: (agenda: string) => void;
  isAgendaLoading: boolean;
  generateAgenda: () => void;
  pastMeetings: Meeting[];
  onStartMeeting: () => void;
  isMeetingReady: boolean;
}

const MeetingPrepPage: React.FC<MeetingPrepPageProps> = ({ onBack, agenda, setAgenda, isAgendaLoading, generateAgenda, pastMeetings, onStartMeeting, isMeetingReady }) => {
    const [activeView, setActiveView] = useState<string>('generate_agenda');
    const [customItem, setCustomItem] = useState('');

    useEffect(() => {
        if (activeView === 'generate_agenda' && isMeetingReady) {
            generateAgenda();
        }
    }, [activeView, isMeetingReady]);

    const handleAddCustomItem = () => {
        if (customItem.trim()) {
            const newItem = `${agenda.split('\n').filter(line => line.trim() && !line.startsWith("Error:")).length + 1}. (Custom) ${customItem.trim()}`;
            const currentAgenda = agenda.startsWith("Error:") ? "" : agenda;
            setAgenda(`${currentAgenda}\n${newItem}`);
            setCustomItem('');
            alert('Custom item added to agenda!');
        }
    };
    
    const downloadAgenda = () => {
        if (!agenda || agenda.startsWith("Error:")) {
            alert("No agenda to download. Please generate one first.");
            return;
        }
        const blob = new Blob([`Meeting Agenda\n\n${agenda}`], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'meeting-agenda.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isAgendaError = agenda.startsWith("Error:");

    const actions = [
        { id: 'generate_agenda', label: 'Auto-Generate Agenda', onClick: () => setActiveView('generate_agenda'), disabled: !isMeetingReady },
        { id: 'view_notes', label: 'View Last Meeting Notes', onClick: () => setActiveView('view_notes') },
        { id: 'add_items', label: 'Add Custom Items', onClick: () => setActiveView('add_items') },
        { id: 'download', label: 'Download Agenda', onClick: downloadAgenda },
    ];

    return (
        <PageShell
            title="Meeting Prep"
            description="Auto-generated agenda and context based on past meetings and sales data."
            icon={<ClipboardDocumentListIcon className="h-10 w-10 text-indigo-400" />}
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
                            className={`w-full text-left p-3 rounded-lg transition-colors font-medium ${
                                action.disabled ? 'opacity-50 cursor-not-allowed' : 
                                activeView === action.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800/50 hover:bg-slate-700/70 text-slate-300'
                            }`}
                        >
                            {action.label}
                             {action.disabled && <span className="text-xs block text-yellow-500">(Schedule a meeting first)</span>}
                        </button>
                    ))}
                     {isMeetingReady && (
                        <button
                            onClick={onStartMeeting}
                            disabled={isAgendaError || !agenda}
                            className="w-full mt-4 text-center p-3 rounded-lg transition-colors font-bold bg-green-600 hover:bg-green-500 text-white transform hover:scale-105 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ animationDelay: `${400 + actions.length * 100}ms` }}
                        >
                            Start Meeting
                        </button>
                    )}
                </div>
                <div key={activeView} className="md:col-span-2 bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10 min-h-[300px] animate-content-fade-in" style={{ animationDelay: '500ms' }}>
                    {!isMeetingReady && activeView === 'generate_agenda' && (
                        <div className="flex items-center justify-center h-full text-center">
                            <p className="text-slate-400">Please schedule a meeting from the Home or Scheduling page to generate an agenda.</p>
                        </div>
                    )}
                    {isMeetingReady && activeView === 'generate_agenda' && (
                        <>
                        {isAgendaError && (
                            <div className="bg-red-500/10 text-red-300 p-4 rounded-lg mb-4">
                                <h4 className="font-bold">Agenda Generation Failed</h4>
                                <pre className="text-sm whitespace-pre-wrap mt-2 font-mono">{agenda}</pre>
                            </div>
                        )}
                        <AgendaCard isLoading={isAgendaLoading} agenda={isAgendaError ? "" : agenda} selectedSlot={null} />
                        </>
                    )}
                    {activeView === 'view_notes' && (
                        <PastMeetingsCard meetings={pastMeetings} />
                    )}
                    {activeView === 'add_items' && (
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Add a Custom Agenda Item</h3>
                            <p className="text-slate-400 mb-4">This will be added to the current agenda.</p>
                            <textarea
                                value={customItem}
                                onChange={(e) => setCustomItem(e.target.value)}
                                placeholder="e.g., Discuss Q4 budget allocation..."
                                className="w-full h-32 bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 transition resize-none"
                            />
                            <button 
                                onClick={handleAddCustomItem}
                                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                            >
                                Add to Agenda
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
};

export default MeetingPrepPage;