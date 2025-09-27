import React from 'react';
import { AgendaIcon, CheckCircleIcon } from './icons';

interface AgendaCardProps {
  isLoading: boolean;
  agenda: string;
  selectedSlot: string | null;
  onConclude?: () => void;
  isConcluded?: boolean;
}

const AgendaCard: React.FC<AgendaCardProps> = ({ isLoading, agenda, selectedSlot, onConclude, isConcluded }) => {
  const formattedAgenda = agenda.split('\n').filter(line => line.trim() !== '');

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <AgendaIcon className="h-6 w-6 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-white">AI-Generated Agenda</h2>
      </div>
      {selectedSlot && <p className="text-slate-400 mt-2">For meeting at <span className="font-semibold text-indigo-300">{selectedSlot}</span></p>}

      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
            <span className="ml-4 text-slate-300">Generating with AI...</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {formattedAgenda.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-1">
                  {index + 1}
                </div>
                <p className="text-slate-300">{item.substring(item.indexOf('.') > -1 ? item.indexOf('.') + 1 : 0).trim()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {!isLoading && agenda && onConclude && (
        <div className="mt-8">
            <button
              onClick={onConclude}
              disabled={isConcluded}
              className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform ${
                isConcluded 
                ? 'bg-green-500/30 text-green-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105'
              }`}
            >
              {isConcluded ? <><CheckCircleIcon className="h-5 w-5" /> Meeting Concluded</> : 'Conclude Meeting & Generate Follow-ups'}
            </button>
        </div>
      )}
    </>
  );
};

export default AgendaCard;