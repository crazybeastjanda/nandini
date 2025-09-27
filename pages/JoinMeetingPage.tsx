import React from 'react';
import PageShell from '../components/PageShell';
import { VideoCameraIcon } from '../components/icons';

interface JoinMeetingPageProps {
  onBack: () => void;
  isMeetingReady: boolean;
  onJoinMeeting: () => void;
  onScheduleNew: () => void;
}

const JoinMeetingPage: React.FC<JoinMeetingPageProps> = ({ onBack, isMeetingReady, onJoinMeeting, onScheduleNew }) => {
    
    const handleJoinWithId = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const meetingId = (formData.get('meeting-id') as string);
        
        if (meetingId) {
            // In a real app, you'd validate this ID. Here, we just proceed.
            // This now navigates to our simulated meeting page.
            onJoinMeeting();
        } else {
            alert("Please enter a valid Meeting ID.");
        }
    };

    return (
        <PageShell
            title="Join a Meeting"
            description="Start your scheduled meeting or join another one with an ID."
            icon={<VideoCameraIcon className="h-10 w-10 text-purple-400" />}
            onBack={onBack}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Start Scheduled Meeting */}
                <div className={`bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10 text-center flex flex-col items-center justify-center transition-opacity ${!isMeetingReady ? 'opacity-50' : ''}`}>
                    <h3 className="text-2xl font-bold text-white">Start Scheduled Meeting</h3>
                    <p className="text-slate-400 mt-2 mb-6">
                        {isMeetingReady 
                            ? "Your AI-prepared meeting is ready to go."
                            : "You don't have a meeting scheduled and prepped yet."
                        }
                    </p>
                    <button
                        onClick={isMeetingReady ? onJoinMeeting : onScheduleNew}
                        className={`w-full max-w-xs font-bold py-3 px-4 rounded-lg transition-all duration-300 transform ${
                            isMeetingReady 
                                ? 'bg-green-600 hover:bg-green-500 text-white hover:scale-105'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:scale-105'
                        }`}
                    >
                        {isMeetingReady ? 'Start Meeting Now' : 'Schedule a Meeting'}
                    </button>
                </div>

                {/* Join with ID */}
                <div className="bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10">
                    <h3 className="text-2xl font-bold text-white text-center">Join with ID/Link</h3>
                     <p className="text-slate-400 mt-2 mb-6 text-center">
                        Enter the details for the meeting you want to join.
                    </p>
                    <form onSubmit={handleJoinWithId} className="space-y-4">
                        <div>
                            <label htmlFor="meeting-id" className="block text-sm font-medium text-slate-300 mb-1">Meeting ID</label>
                            <input type="text" name="meeting-id" id="meeting-id" required className="w-full bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 transition" placeholder="e.g., 123 456 7890" />
                        </div>
                         <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password (optional)</label>
                            <input type="password" name="password" id="password" className="w-full bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 transition" />
                        </div>
                        <button
                            type="submit"
                            className="w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 transform bg-purple-600 hover:bg-purple-500 text-white hover:scale-105"
                        >
                            Join Meeting
                        </button>
                    </form>
                </div>
            </div>
        </PageShell>
    );
};

export default JoinMeetingPage;