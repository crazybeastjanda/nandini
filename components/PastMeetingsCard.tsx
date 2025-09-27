
import React, { useState } from 'react';
import type { Meeting, Participant } from '../types';

interface PastMeetingsCardProps {
  meetings: Meeting[];
  participant?: Participant;
}

const PastMeetingsCard: React.FC<PastMeetingsCardProps> = ({ meetings, participant }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMeetings = meetings.filter(meeting =>
    meeting.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.outcome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock function to generate important notes based on meeting
  const getImportantNotes = (meeting: Meeting): string => {
      if (!participant) return "General notes from the meeting.";
      if (meeting.topic.includes('Sales Review')) {
          return `Crucial discussion point with ${participant.name} about targeting enterprise clients. They stressed the need for better marketing materials to close deals.`;
      }
      if (meeting.topic.includes('Feedback')) {
          return `${participant.name} provided critical UI feedback. They will consolidate a report from their team, which is a key dependency for the v2.2 patch.`;
      }
      return `Standard sync-up with ${participant.name}. Agreed on the main action items.`;
  }

  return (
    <>
      <div className="mb-6">
        <input
            type="text"
            placeholder={participant ? `Search through ${participant.name}'s meetings...` : 'Search meetings...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 text-white placeholder-slate-400 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
        />
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {filteredMeetings.length > 0 ? (
          <div className="stagger-children">
            {filteredMeetings.map((meeting, index) => (
              <div key={index} style={{ animationDelay: `${index * 100}ms` }} className="p-4 bg-slate-700/50 rounded-lg">
                <p className="font-semibold text-slate-200">{meeting.topic}</p>
                <p className="text-xs text-slate-400 mt-1">{meeting.date}</p>
                <p className="text-sm text-slate-300 mt-2 border-l-2 border-slate-500 pl-3">
                  <span className="font-medium text-slate-400">Outcome:</span> {meeting.outcome}
                </p>
                {/* Important Notes Panel - only shows if a participant is selected */}
                {participant && (
                    <div className="mt-3 p-3 bg-yellow-500/10 rounded-md border-l-4 border-yellow-400 animate-content-fade-in">
                        <h4 className="font-bold text-sm text-yellow-300">Important Notes regarding {participant.nickname || participant.name}</h4>
                        <p className="text-sm text-yellow-200/80 mt-1">{getImportantNotes(meeting)}</p>
                    </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-slate-400">{participant ? 'No meetings found for this participant.' : 'No meetings found.'}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PastMeetingsCard;