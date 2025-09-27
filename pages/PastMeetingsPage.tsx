
import React, { useState, useEffect, useMemo } from 'react';
import PageShell from '../components/PageShell';
import PastMeetingsCard from '../components/PastMeetingsCard';
import Modal from '../components/Modal';
import { ArchiveBoxIcon, EditIcon, ArrowDownTrayIcon, SparklesIcon } from '../components/icons';
import type { Meeting, Participant } from '../types';
import { generateRelationshipSummary } from '../services/geminiService';

interface PastMeetingsPageProps {
  onBack: () => void;
  meetings: Meeting[];
  participants: Participant[];
  updateNickname: (participantId: string, nickname: string) => void;
}

const PastMeetingsPage: React.FC<PastMeetingsPageProps> = ({ onBack, meetings, participants, updateNickname }) => {
    const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
    const [nicknameInput, setNicknameInput] = useState('');
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [relationshipSummary, setRelationshipSummary] = useState('');

    const selectedParticipant = useMemo(() => 
        participants.find(p => p.id === selectedParticipantId), 
        [participants, selectedParticipantId]
    );

    useEffect(() => {
        setNicknameInput(selectedParticipant?.nickname || '');
    }, [selectedParticipant]);

    const handleSaveNickname = () => {
        if (selectedParticipantId) {
            updateNickname(selectedParticipantId, nicknameInput);
            alert('Nickname saved!');
        }
    };

    const filteredMeetings = useMemo(() => {
        if (!selectedParticipantId) return [];
        return meetings.filter(m => m.participants.includes(selectedParticipantId)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [meetings, selectedParticipantId]);

    const handleDownloadHistory = () => {
        if (!selectedParticipant || filteredMeetings.length === 0) {
            alert('No meeting history to download for this participant.');
            return;
        }

        const headers = ['Date', 'Topic', 'Outcome'];
        const csvContent = [
            headers.join(','),
            ...filteredMeetings.map(m => [
                `"${m.date}"`,
                `"${m.topic.replace(/"/g, '""')}"`,
                `"${m.outcome.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedParticipant.name}_meeting_history.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGenerateSummary = async () => {
        if (!selectedParticipant) return;
        
        setIsSummaryModalOpen(true);
        setIsSummaryLoading(true);
        try {
            const summary = await generateRelationshipSummary(selectedParticipant, filteredMeetings);
            setRelationshipSummary(summary);
        } catch (error) {
            console.error(error);
            setRelationshipSummary('Failed to generate summary. Please check the console for details.');
        } finally {
            setIsSummaryLoading(false);
        }
    };

    return (
        <>
            <PageShell
                title="Past Meetings"
                description="Review meeting history and notes for specific team members."
                icon={<ArchiveBoxIcon className="h-10 w-10 text-yellow-400" />}
                onBack={onBack}
            >
                <div className="bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10 animate-content-fade-in">
                    {/* Controls Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 p-4 bg-slate-900/50 rounded-lg">
                        {/* Member Selection & Nickname */}
                        <div className="flex flex-col sm:flex-row items-end gap-4">
                            <div className="w-full">
                                <label htmlFor="participant-select" className="block text-sm font-medium text-slate-300 mb-1">Select Member</label>
                                <select
                                    id="participant-select"
                                    value={selectedParticipantId}
                                    onChange={e => setSelectedParticipantId(e.target.value)}
                                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 transition"
                                >
                                    <option value="">-- Select a Participant --</option>
                                    {participants.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full">
                                <label htmlFor="nickname-input" className="block text-sm font-medium text-slate-300 mb-1">Nickname</label>
                                <div className="relative">
                                    <input
                                        id="nickname-input" type="text" value={nicknameInput}
                                        onChange={e => setNicknameInput(e.target.value)}
                                        disabled={!selectedParticipantId} placeholder={!selectedParticipantId ? "Select a member first" : "Enter a nickname"}
                                        className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 transition disabled:opacity-50"
                                    />
                                    <EditIcon className="w-5 h-5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                             <button onClick={handleSaveNickname} disabled={!selectedParticipantId} className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Save
                            </button>
                        </div>
                        {/* Actions */}
                        <div className="flex flex-col items-start gap-4">
                             <h3 className="text-sm font-medium text-slate-300">Actions</h3>
                             <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <button onClick={handleGenerateSummary} disabled={!selectedParticipantId} className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <SparklesIcon className="w-5 h-5" />
                                    Generate AI Summary
                                </button>
                                <button onClick={handleDownloadHistory} disabled={!selectedParticipantId} className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                    Download History (CSV)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    <div key={selectedParticipantId} className="animate-content-fade-in">
                    {selectedParticipantId ? (
                        <PastMeetingsCard meetings={filteredMeetings} participant={selectedParticipant} />
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-slate-400">Please select a participant to view their meeting history.</p>
                        </div>
                    )}
                    </div>
                </div>
            </PageShell>

            <Modal isOpen={isSummaryModalOpen} onClose={() => setIsSummaryModalOpen(false)} title={`AI Summary for ${selectedParticipant?.name}`}>
                {isSummaryLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
                        <span className="ml-4 text-slate-300">Analyzing relationship...</span>
                    </div>
                ) : (
                    <div className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {relationshipSummary}
                    </div>
                )}
            </Modal>
        </>
    );
};

export default PastMeetingsPage;