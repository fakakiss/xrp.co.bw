
import React, { ReactNode } from 'react';
import { Recycle, LayoutDashboard, Trophy, Settings, Users, LogIn, LogOut, User as UserIcon, Book, Radio } from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  currentUser,
  onLoginClick,
  onLogoutClick
}) => {
  // Admin Tab hidden from standard navigation, accessible via route/URL logic
  const navItems = [
    { id: 'home', label: 'Home', icon: <Recycle className="w-5 h-5" /> },
    { id: 'dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'participants', label: 'All Participants', icon: <Users className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { id: 'kb', label: 'Knowledge Base', icon: <Book className="w-5 h-5" /> },
    { id: 'news', label: 'News & Videos', icon: <Radio className="w-5 h-5" /> },
  ];

  // Note: 'admin' tab is handled via routing/direct access, not displayed in the main menu by default to keep UI clean.

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-brand-primary">
          <Recycle /> xrp.co.bw
        </div>
        <div className="flex gap-2 items-center">
            {currentUser ? (
                <button onClick={onLogoutClick} className="p-2 text-slate-400 hover:text-white">
                    <LogOut size={20} />
                </button>
            ) : (
                <button onClick={onLoginClick} className="p-2 text-brand-secondary font-bold text-sm">
                    Login
                </button>
            )}
        </div>
      </div>

      {/* Mobile Nav Bar (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around p-2 z-50 overflow-x-auto">
        {navItems.slice(0, 5).map(item => (
             <button 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center p-2 min-w-[60px] ${activeTab === item.id ? 'text-brand-secondary' : 'text-slate-500'}`}
            >
                {item.icon}
            </button>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 font-bold text-2xl text-white">
          <span className="text-brand-primary"><Recycle /></span> xrp.co.bw
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' 
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
            {currentUser ? (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border border-slate-500" />
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                            <div className="flex gap-1">
                                <p className="text-[10px] text-brand-secondary uppercase tracking-wider font-bold">{currentUser.role}</p>
                                {currentUser.role === UserRole.PARTICIPANT && (
                                    <p className={`text-[10px] uppercase tracking-wider font-bold ${currentUser.registrationStatus === 'PENDING' ? 'text-amber-500' : 'text-green-500'}`}>
                                        {currentUser.registrationStatus === 'PENDING' ? '(Pending)' : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onLogoutClick}
                        className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded transition-colors"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Guest</p>
                            <p className="text-xs text-slate-500">Not logged in</p>
                        </div>
                    </div>
                    <button 
                        onClick={onLoginClick}
                        className="w-full bg-brand-primary hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
                    >
                        <LogIn size={16} /> Login / Join
                    </button>
                </div>
            )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-114px)] md:h-screen p-4 md:p-8 bg-slate-900 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
};
