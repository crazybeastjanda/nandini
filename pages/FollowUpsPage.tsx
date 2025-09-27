import React, { useState, useMemo } from 'react';
import PageShell from '../components/PageShell';
import FollowUpCard from '../components/FollowUpCard';
import Modal from '../components/Modal';
import { BellAlertIcon } from '../components/icons';
import type { FollowUp } from '../types';

interface FollowUpsPageProps {
  onBack: () => void;
  followUps: FollowUp[];
  isFollowUpsLoading: boolean;
  toggleFollowUp: (task: string) => void;
  addFollowUp: (newFollowUp: Omit<FollowUp, 'completed'>) => void;
}

const FollowUpsPage: React.FC<FollowUpsPageProps> = ({ onBack, followUps, isFollowUpsLoading, toggleFollowUp, addFollowUp }) => {
    const [activeView, setActiveView] = useState<string>('view_tasks');
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    // State for editable email
    const [emailTo, setEmailTo] = useState('German.Distributor@example.com');
    const [emailFrom, setEmailFrom] = useState('your.name@example.com');
    const [emailSubject, setEmailSubject] = useState('Follow-up on our recent meeting');
    
    const emailBodyContent = useMemo(() => {
        const pendingItems = followUps
            .filter(f => !f.completed)
            .map(f => `- ${f.task} (Priority: ${f.priority}, Due: ${f.date})`)
            .join('\n');
        
        return `Hi Team,\n\nHere is a summary of the action items from our discussion:\n${pendingItems}\n\nBest,\nYour Name`;
    }, [followUps]);

    const [emailBody, setEmailBody] = useState(emailBodyContent);

    // Update body if the modal is opened again with new follow-ups
    const openEmailModal = () => {
        setEmailBody(emailBodyContent);
        setIsEmailModalOpen(true);
    };


    const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const task = formData.get('task') as string;
        const priority = formData.get('priority') as 'High' | 'Medium' | 'Low';
        const date = formData.get('date') as string;

        if (task && priority && date) {
            addFollowUp({ task, priority, date });
            e.currentTarget.reset();
            alert('New reminder added!');
        }
    };
    
    const handleSendEmail = () => {
        alert(`Email sent!\n\nTo: ${emailTo}\nFrom: ${emailFrom}\nSubject: ${emailSubject}\n\nBody:\n${emailBody}`);
        setIsEmailModalOpen(false);
    };

    const actions = [
        { id: 'view_tasks', label: 'View Pending Tasks', onClick: () => setActiveView('view_tasks') },
        { id: 'add_reminder', label: 'Add New Reminder', onClick: () => setActiveView('add_reminder') },
        { id: 'send_email', label: 'Send Follow-Up Email', onClick: openEmailModal },
    ];

    return (
        <>
        <PageShell
            title="Reminders & Follow-ups"
            description="Never miss an action item with smart tracking and notifications."
            icon={<BellAlertIcon className="h-10 w-10 text-red-400" />}
            onBack={onBack}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-3 stagger-children">
                    <h3 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-2" style={{ animationDelay: '300ms' }}>Actions</h3>
                    {actions.map((action, index) => (
                        <button
                            key={action.id}
                            onClick={action.onClick}
                            style={{ animationDelay: `${400 + index * 100}ms` }}
                            className={`w-full text-left p-3 rounded-lg transition-colors font-medium ${activeView === action.id ? 'bg-red-500/20 text-red-300' : 'bg-slate-800/50 hover:bg-slate-700/70 text-slate-300'}`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
                <div key={activeView} className="md:col-span-2 bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10 min-h-[300px] animate-content-fade-in" style={{ animationDelay: '500ms' }}>
                    {activeView === 'view_tasks' && (
                       <FollowUpCard followUps={followUps} isLoading={isFollowUpsLoading} onToggle={toggleFollowUp} />
                    )}
                    {activeView === 'add_reminder' && (
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Add a New Reminder</h3>
                            <form onSubmit={handleAddReminder} className="space-y-4">
                                <div>
                                    <label htmlFor="task" className="block text-sm font-medium text-slate-300 mb-1">Task</label>
                                    <input type="text" name="task" id="task" required className="w-full bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 transition" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                                        <select name="priority" id="priority" defaultValue="Medium" className="w-full bg-slate-700/50 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 transition">
                                            <option>High</option>
                                            <option>Medium</option>
                                            <option>Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                                        <input type="date" name="date" id="date" required className="w-full bg-slate-700/50 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 transition" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                                    Add Reminder
                                </button>
                            </form>
                        </div>
                    )}
                     {activeView !== 'view_tasks' && activeView !== 'add_reminder' && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-400">Select an action to begin.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
        
        <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title="Compose Follow-Up Email">
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email-from" className="block text-sm font-medium text-slate-400 mb-1">From:</label>
                        <input type="email" id="email-from" value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} className="w-full bg-slate-700/50 text-white rounded-md px-3 py-2 border border-slate-600 focus:ring-red-500" />
                    </div>
                    <div>
                        <label htmlFor="email-to" className="block text-sm font-medium text-slate-400 mb-1">To:</label>
                        <input type="email" id="email-to" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="w-full bg-slate-700/50 text-white rounded-md px-3 py-2 border border-slate-600 focus:ring-red-500" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="email-subject" className="block text-sm font-medium text-slate-400 mb-1">Subject:</label>
                    <input type="text" id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full bg-slate-700/50 text-white rounded-md px-3 py-2 border border-slate-600 focus:ring-red-500" />
                </div>
                 <div>
                    <label htmlFor="email-body" className="block text-sm font-medium text-slate-400 mb-1">Body:</label>
                    <textarea id="email-body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={8} className="w-full bg-slate-700/50 text-white rounded-md px-3 py-2 border border-slate-600 focus:ring-red-500 resize-none"></textarea>
                </div>
            </div>
            <button
                onClick={handleSendEmail}
                className="mt-6 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
                Send Email
            </button>
        </Modal>
        </>
    );
};

export default FollowUpsPage;