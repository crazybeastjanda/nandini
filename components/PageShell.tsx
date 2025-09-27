import React from 'react';
import { ArrowLeftIcon } from './icons';

interface PageShellProps {
    title: string;
    description: string;
    icon: React.ReactElement;
    onBack: () => void;
    children: React.ReactNode;
}

const PageShell: React.FC<PageShellProps> = ({ title, description, icon, onBack, children }) => {
    return (
        <div className="page-container w-full">
            <header className="mb-12">
                <div className="stagger-children">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold mb-6" style={{ animationDelay: '100ms' }}>
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Home
                    </button>
                    <div className="flex items-center gap-6" style={{ animationDelay: '200ms' }}>
                        <div className="p-4 bg-slate-800/60 rounded-2xl ring-1 ring-white/10 transition-transform duration-300 ease-in-out hover:scale-110 hover:-rotate-6">
                            {icon}
                        </div>
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-100">{title}</h1>
                            <p className="mt-2 text-lg text-slate-400 max-w-2xl">{description}</p>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}

export default PageShell;