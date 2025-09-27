
import React from 'react';
import { LogoIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LogoIcon className="h-10 w-10" />
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-indigo-500 text-transparent bg-clip-text">
          Discusso
        </h1>
      </div>
      <p className="hidden sm:block text-slate-400 font-medium">Your AI Meeting Buddy</p>
    </header>
  );
};

export default Header;