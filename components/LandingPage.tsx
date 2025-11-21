
import React, { useState, useEffect } from 'react';
import { User, SystemSettings, UserRole, UserRank } from '../types';
import { Trophy, Medal, TrendingUp, Zap, ChevronRight, Users, Star, Play, Globe, Leaf, Search, ArrowUpDown, Recycle } from 'lucide-react';
import { getRank } from '../constants';

interface LandingPageProps {
  users: User[];
  settings: SystemSettings;
  onJoinClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ users, settings, onJoinClick }) => {
  // FILTER: Only Participants for Public Data (Strictly exclude Admins/Root)
  const participantUsers = users.filter(u => u.role === UserRole.PARTICIPANT);
  
  // Stats for Hero
  const totalBottles = participantUsers.reduce((acc, u) => acc + u.totalBottles, 0);
  const activePioneers = participantUsers.length;
  const co2Offset = (totalBottles * 0.08).toFixed(1); // Mock CO2 calc

  // Carousel Logic
  const sortedByBottlesForCarousel = [...participantUsers].sort((a, b) => b.totalBottles - a.totalBottles);
  const topThree = sortedByBottlesForCarousel.slice(0, 3);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Live Price Logic
  const [liveXrpPrice, setLiveXrpPrice] = useState<number | null>(null);

  // Public Grid Sorting State
  const [sortBy, setSortBy] = useState<'bottles' | 'xrp' | 'name'>('bottles');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting Logic
  const sortedGridUsers = [...participantUsers]
    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let valA: any = a.totalBottles;
      let valB: any = b.totalBottles;

      if (sortBy === 'name') {
        valA = a.name;
        valB = b.name;
      } else if (sortBy === 'xrp') {
        valA = a.totalXRP;
        valB = b.totalXRP;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const topUser = sortedByBottlesForCarousel[0];

  // Fetch Live XRP Price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd,bwp');
        const data = await response.json();
        if (data && data.ripple) {
            setLiveXrpPrice(settings.xrpDisplayCurrency === 'USD' ? data.ripple.usd : data.ripple.bwp);
        }
      } catch (error) {
        console.error("Failed to fetch XRP price", error);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, [settings.xrpDisplayCurrency]);

  // Auto-rotate carousel
  useEffect(() => {
    if (topThree.length > 0) {
        const interval = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % topThree.length);
        }, 4000);
        return () => clearInterval(interval);
    }
  }, [topThree.length]);

  const handleSort = (criteria: 'bottles' | 'xrp' | 'name') => {
    if (sortBy === criteria) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder(criteria === 'name' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="space-y-16 animate-fade-in pb-20">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-slate-900 group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        
        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
             <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                    <Zap size={12} /> Public Live Data
                </div>
                {liveXrpPrice && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        1 XRP = {settings.xrpDisplayCurrency === 'USD' ? '$' : 'P'} {liveXrpPrice.toFixed(4)}
                    </div>
                )}
             </div>

             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                {settings.siteTitle}
             </h1>
             <p className="text-xl text-slate-400 max-w-lg border-l-2 border-cyan-500 pl-4">
                {settings.heroTagline}
             </p>
             <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={onJoinClick} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2">
                   JOIN THE PIONEERS <ChevronRight size={20} />
                </button>
             </div>
          </div>

          {/* Rotating Top 3 Player Carousel */}
          {topThree.length > 0 && (
            <div className="w-full md:w-80 h-96 relative hidden lg:block">
                {topThree.map((user, idx) => (
                    <div 
                    key={user.id}
                    className={`absolute inset-0 transition-all duration-700 transform ${
                        idx === carouselIndex 
                        ? 'opacity-100 translate-x-0 scale-100 z-20' 
                        : 'opacity-0 translate-x-10 scale-95 z-10'
                    }`}
                    >
                    <div className="h-full bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                        <div className="absolute top-4 right-4">
                            <Medal className={`w-8 h-8 ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : 'text-amber-600'}`} />
                        </div>
                        
                        <div className="relative mb-6">
                            <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-slate-900 relative z-10 object-cover" />
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-xs font-mono text-cyan-400 whitespace-nowrap">
                                RANK #{idx + 1}
                            </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
                        <div className="grid grid-cols-2 gap-2 w-full bg-slate-900/50 p-3 rounded-xl mt-4">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Bottles</p>
                                <p className="text-lg font-mono font-bold text-cyan-400">{user.totalBottles.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">XRP Held</p>
                                <p className="text-lg font-mono font-bold text-purple-400">{user.totalXRP.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Community Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-full text-green-400"><Leaf /></div>
              <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Total Bottles</p>
                  <p className="text-2xl font-bold text-white">{totalBottles.toLocaleString()}</p>
              </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full text-blue-400"><Globe /></div>
              <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">CO2 Offset</p>
                  <p className="text-2xl font-bold text-white">{co2Offset} kg</p>
              </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-full text-purple-400"><Users /></div>
              <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Active Pioneers</p>
                  <p className="text-2xl font-bold text-white">{activePioneers} / 100</p>
              </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full text-orange-400"><TrendingUp /></div>
              <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Cycle Progress</p>
                  <p className="text-2xl font-bold text-white">Month {settings.cycleMonth}/{settings.totalCycleMonths}</p>
              </div>
          </div>
      </div>

      {/* YouTube Embed */}
      {settings.youtubeVideoId && (
          <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
             <div className="aspect-video">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${settings.youtubeVideoId}?modestbranding=1&rel=0`} 
                    title="Gemini 3 Challenge Intro" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
             </div>
             <div className="bg-slate-900 p-4 flex items-center gap-3 border-t border-slate-800">
                <Play className="text-cyan-500 fill-cyan-500 w-5 h-5" />
                <p className="text-sm font-bold text-slate-300">Featured: Challenge Briefing & Strategy</p>
             </div>
          </div>
      )}

      {/* MVP Highlight - Optional */}
      {topUser && (
        <div className="bg-gradient-to-r from-yellow-900/20 to-transparent border-l-4 border-yellow-500 p-6 rounded-r-xl">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img src={topUser.avatar} alt="MVP" className="w-16 h-16 rounded-full border-2 border-yellow-500" />
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-slate-900 p-1 rounded-full"><Star size={12} fill="currentColor" /></div>
                </div>
                <div>
                    <p className="text-yellow-500 text-xs font-bold uppercase tracking-wider">Current MVP</p>
                    <h3 className="text-xl font-bold text-white">{topUser.name}</h3>
                    <p className="text-slate-400 text-sm">{topUser.totalBottles.toLocaleString()} Bottles Contributed</p>
                </div>
            </div>
        </div>
      )}

      {/* PUBLIC PARTICIPANT GRID */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Trophy className="text-brand-primary" /> Challenge Standings
                </h2>
                <p className="text-slate-400">Real-time data of all active pioneers.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search participant..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:ring-2 focus:ring-brand-primary w-full md:w-48"
                    />
                </div>

                {/* Sort Buttons */}
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button 
                        onClick={() => handleSort('bottles')}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${sortBy === 'bottles' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Bottles <ArrowUpDown size={10} />
                    </button>
                    <button 
                        onClick={() => handleSort('xrp')}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${sortBy === 'xrp' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        XRP <ArrowUpDown size={10} />
                    </button>
                    <button 
                        onClick={() => handleSort('name')}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${sortBy === 'name' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Name <ArrowUpDown size={10} />
                    </button>
                </div>
            </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedGridUsers.map((user) => {
                const rank = getRank(user.totalBottles);
                return (
                    <div key={user.id} className="bg-slate-800 rounded-xl border border-slate-700 p-4 hover:border-brand-primary/50 transition-all group relative overflow-hidden flex flex-col">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="relative">
                                <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    className="w-12 h-12 rounded-full border-2 border-slate-600 group-hover:border-brand-primary transition-colors object-cover" 
                                />
                                <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 border border-slate-700 text-[8px] font-bold uppercase px-1 ${
                                    rank === UserRank.WHALE ? 'text-purple-400' :
                                    rank === UserRank.MASTER ? 'text-blue-400' : 'text-slate-400'
                                }`}>
                                    {rank === UserRank.WHALE ? 'Whale' : rank === UserRank.MASTER ? 'Pro' : 'Novice'}
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-white truncate text-sm">{user.name}</h3>
                                <p className="text-[10px] text-slate-500">Joined: {user.joinDate}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-2 rounded-lg mt-auto">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase flex items-center gap-1"><Recycle size={8} /> Bottles</p>
                                <p className="text-sm font-mono font-bold text-brand-secondary">{user.totalBottles.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase flex items-center justify-end gap-1">XRP <TrendingUp size={8} /></p>
                                <p className="text-sm font-mono font-bold text-brand-primary">{user.totalXRP.toFixed(1)}</p>
                            </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-between items-center">
                             <span className="text-[10px] text-slate-400">Est. Value</span>
                             <span className="text-xs font-bold text-green-400">
                                P {(user.totalXRP * (liveXrpPrice || 32.5)).toLocaleString(undefined, {maximumFractionDigits: 0})}
                             </span>
                        </div>
                    </div>
                );
            })}
        </div>
        
        {sortedGridUsers.length === 0 && (
            <div className="text-center p-10 text-slate-500">
                No participants found matching your search.
            </div>
        )}
      </div>
    </div>
  );
};
