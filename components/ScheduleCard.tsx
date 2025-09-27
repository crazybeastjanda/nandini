import React from 'react';
import type { CalendarData } from '../types';
import { ClockIcon, GlobeIcon } from './icons';

interface ScheduleCardProps {
  calendarData: CalendarData;
  onSlotSelect: (slot: string) => void;
  availableSlots: string[];
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ onSlotSelect, availableSlots }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <ClockIcon className="h-6 w-6 text-cyan-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Suggested Time Slots</h2>
      </div>
      <p className="text-slate-400 mt-2">
        AI has found the best times for Chennai and Germany.
      </p>

      <div className="mt-6 space-y-4 stagger-children">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => onSlotSelect(slot)}
              className="w-full text-left p-4 bg-slate-700/50 rounded-lg flex items-center justify-between group transition-all duration-300 hover:bg-cyan-500/20 hover:ring-cyan-500 ring-1 ring-transparent"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <GlobeIcon className="h-5 w-5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
                <span className="font-semibold text-slate-200 group-hover:text-white">{slot}</span>
              </div>
              <span className="text-sm font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Book</span>
            </button>
          ))
        ) : (
          <div className="text-center p-4 bg-slate-700/50 rounded-lg">
            <p className="text-slate-300">No overlapping slots found for the selected day.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ScheduleCard;