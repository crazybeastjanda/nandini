import React from 'react';
import type { FollowUp } from '../types';
import { FollowUpIcon, CheckIcon } from './icons';

interface FollowUpCardProps {
  followUps: FollowUp[];
  isLoading: boolean;
  onToggle: (task: string) => void;
}

const priorityStyles = {
  High: 'bg-red-500/20 text-red-300',
  Medium: 'bg-yellow-500/20 text-yellow-300',
  Low: 'bg-sky-500/20 text-sky-300',
};

const FollowUpCard: React.FC<FollowUpCardProps> = ({ followUps, isLoading, onToggle }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <FollowUpIcon className="h-6 w-6 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Pending Tasks</h2>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && (
            <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
                <span className="ml-3 text-slate-300">Generating...</span>
            </div>
        )}
        {followUps.map((item, index) => (
          <div
            key={index}
            onClick={() => onToggle(item.task)}
            className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-300 ${item.completed ? 'bg-slate-700/40' : 'bg-slate-700/70 hover:bg-slate-700'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${item.completed ? 'bg-green-500 border-green-400' : 'border-slate-500'}`}>
                {item.completed && <CheckIcon className="w-4 h-4 text-white" />}
              </div>
              <div>
                <p className={`text-sm font-medium ${item.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{item.task}</p>
                <p className={`text-xs mt-1 ${item.completed ? 'text-slate-600' : 'text-slate-400'}`}>{item.date}</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${priorityStyles[item.priority]}`}>{item.priority}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default FollowUpCard;