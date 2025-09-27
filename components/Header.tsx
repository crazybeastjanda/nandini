
import React, { useState, useRef, useEffect } from 'react';
import { LogoIcon, UserCircleIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from './icons';

interface HeaderProps {
    isAuthenticated: boolean;
    onLogout: () => void;
    setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout, setCurrentPage }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    const navItems = [
        { name: 'Dashboard', page: 'home' },
        { name: 'Gamification', page: 'gamification' },
    ];

    const handleNavClick = (page: string) => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false);
    };

    const handleLogoutClick = () => {
        onLogout();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    }

    const handleAuthClick = () => {
        setCurrentPage('auth');
        setIsMobileMenuOpen(false);
    }

    return (
        <nav className="mb-6 relative z-40">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
                    <LogoIcon className="h-10 w-10" />
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-indigo-500 text-transparent bg-clip-text">
                        Discusso
                    </h1>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {isAuthenticated ? (
                        <>
                            {navItems.map(item => (
                                <button key={item.name} onClick={() => handleNavClick(item.page)} className="font-semibold text-slate-300 hover:text-white transition-colors">
                                    {item.name}
                                </button>
                            ))}
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors">
                                    <UserCircleIcon className="h-8 w-8" />
                                </button>
                                {isProfileOpen && (
                                    <div className="animate-dropdown-in absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg ring-1 ring-white/10 shadow-xl py-1">
                                        <a className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 cursor-pointer">Profile</a>
                                        <button onClick={handleLogoutClick} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50">
                                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button onClick={handleAuthClick} className="font-semibold text-slate-300 hover:text-white transition-colors">Login</button>
                            <button onClick={handleAuthClick} className="font-semibold bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg transition-colors">Register</button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors">
                        {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 ring-1 ring-white/10 animate-dropdown-in">
                    {isAuthenticated ? (
                        <div className="flex flex-col gap-4">
                            {navItems.map(item => (
                                <button key={item.name} onClick={() => handleNavClick(item.page)} className="font-semibold text-slate-200 hover:text-white transition-colors text-left p-2 rounded-md hover:bg-slate-700/50">
                                    {item.name}
                                </button>
                            ))}
                             <a className="font-semibold text-slate-200 hover:text-white transition-colors text-left p-2 rounded-md hover:bg-slate-700/50 cursor-pointer">
                                Profile
                            </a>
                            <hr className="border-slate-700"/>
                            <button onClick={handleLogoutClick} className="font-semibold text-red-400 hover:text-red-300 transition-colors text-left p-2 rounded-md hover:bg-slate-700/50">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                             <button onClick={handleAuthClick} className="font-semibold text-slate-200 hover:text-white transition-colors text-left p-2 rounded-md hover:bg-slate-700/50">Login</button>
                             <button onClick={handleAuthClick} className="font-semibold bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg transition-colors">Register</button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Header;