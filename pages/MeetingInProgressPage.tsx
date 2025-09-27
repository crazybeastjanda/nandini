import React, { useState, useEffect, useRef } from 'react';
import AgendaCard from '../components/AgendaCard';
import { 
    VideoCameraIcon, 
    MicrophoneIcon, 
    MicrophoneSlashIcon, 
    VideoCameraSlashIcon,
    ComputerDesktopIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon
} from '../components/icons';

interface MeetingInProgressPageProps {
  agenda: string;
  selectedSlot: string | null;
  onConclude: () => void;
  distributorNickname: string;
  notes: string;
  setNotes: (notes: string) => void;
}

const MeetingControlButton: React.FC<{
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    text: string;
}> = ({ onClick, children, className = '', text }) => (
    <div className="flex flex-col items-center">
        <button
            onClick={onClick}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200 ${className}`}
        >
            {children}
        </button>
        <span className="text-xs text-slate-300 mt-1">{text}</span>
    </div>
);

const MeetingInProgressPage: React.FC<MeetingInProgressPageProps> = ({ agenda, selectedSlot, onConclude, distributorNickname, notes, setNotes }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setCameraError("Camera access denied. Please allow camera permission in your browser settings.");
            }
        }
    };

    if (!isVideoOff) {
        startCamera();
    } else {
         if (videoRef.current && videoRef.current.srcObject) {
            const currentStream = videoRef.current.srcObject as MediaStream;
            currentStream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOff]);

  const toggleVideo = () => {
      setIsVideoOff(prev => !prev);
      setCameraError(null); // Reset error on toggle
  };


  return (
    <div className="page-container w-full h-[90vh] flex flex-col">
      <header className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
            <VideoCameraIcon className="h-8 w-8 text-purple-400" />
            <div>
                <h1 className="text-3xl font-bold text-white">Meeting in Progress</h1>
                <p className="text-slate-400">Scheduled for: {selectedSlot || "Ad-hoc Meeting"}</p>
            </div>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Agenda */}
        <div className="lg:col-span-1 bg-slate-800/50 rounded-xl p-4 ring-1 ring-white/10 flex flex-col">
            <div className="flex-grow overflow-y-auto pr-2">
                 <AgendaCard agenda={agenda} isLoading={false} selectedSlot={null} />
            </div>
        </div>

        {/* Main Video & Controls */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl ring-1 ring-white/10 flex flex-col justify-between text-slate-500 overflow-hidden">
            {/* Main Participant Video */}
            <div className="relative flex-grow flex items-center justify-center bg-black/20">
                <video 
                    src="https://storage.googleapis.com/static.aistudio.google.com/test/meeting_stock_video.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                 {/* Self View */}
                <div className="absolute bottom-4 right-4 w-48 h-32 bg-slate-800 rounded-lg ring-1 ring-white/10 flex items-center justify-center text-sm overflow-hidden z-10">
                    {isVideoOff ? (
                        <div className="flex flex-col items-center text-slate-400">
                             <VideoCameraSlashIcon className="w-8 h-8"/>
                             <span className="mt-1">Video Off</span>
                        </div>
                    ) : cameraError ? (
                        <div className="text-center text-xs text-red-400 p-2">{cameraError}</div>
                    ) : (
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
                    )}
                </div>
                 <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded-lg text-white font-semibold z-10">
                    {distributorNickname}
                </div>
            </div>

            {/* Controls */}
            <div className="flex-shrink-0 bg-slate-800/40 p-4 flex justify-center items-center gap-4 z-10">
                <MeetingControlButton text={isMuted ? "Unmute" : "Mute"} onClick={() => setIsMuted(!isMuted)} className="bg-slate-700 hover:bg-slate-600">
                    {isMuted ? <MicrophoneSlashIcon className="w-6 h-6 text-white" /> : <MicrophoneIcon className="w-6 h-6 text-white" />}
                </MeetingControlButton>
                <MeetingControlButton text={isVideoOff ? "Start Video" : "Stop Video"} onClick={toggleVideo} className="bg-slate-700 hover:bg-slate-600">
                     {isVideoOff ? <VideoCameraSlashIcon className="w-6 h-6 text-white" /> : <VideoCameraIcon className="w-6 h-6 text-white" />}
                </MeetingControlButton>
                 <div className="h-8 w-px bg-slate-600 mx-2"></div>
                <MeetingControlButton text="Participants" className="bg-slate-700 hover:bg-slate-600">
                    <UsersIcon className="w-6 h-6 text-white" />
                </MeetingControlButton>
                <MeetingControlButton text="Chat" className="bg-slate-700 hover:bg-slate-600">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                </MeetingControlButton>
                <MeetingControlButton text="Share" className="bg-slate-700 hover:bg-slate-600">
                    <ComputerDesktopIcon className="w-6 h-6 text-white" />
                </MeetingControlButton>
                <div className="h-8 w-px bg-slate-600 mx-2"></div>
                <MeetingControlButton text="Leave" onClick={onConclude} className="bg-red-600 hover:bg-red-500">
                    <span className="font-bold text-white">Leave</span>
                </MeetingControlButton>
            </div>
        </div>

        {/* Notes */}
        <div className="lg:col-span-1 bg-slate-800/50 rounded-xl p-4 ring-1 ring-white/10 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Meeting Notes</h3>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Start typing your notes here..."
                className="w-full h-full bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition flex-grow resize-none"
            />
        </div>
      </main>
    </div>
  );
};

export default MeetingInProgressPage;