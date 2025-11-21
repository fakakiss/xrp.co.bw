import React, { useState } from 'react';
import { User, UserRank } from '../types';
import { getRank } from '../constants';
import { Search, TrendingUp, Recycle } from 'lucide-react';

interface ParticipantsListProps {
  users: User[];
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">All Participants</h2>
          <p className="text-slate-400">The {users.length} pioneers building a greener Botswana.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => {
          const rank = getRank(user.totalBottles);
          return (
            <div key={user.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-brand-primary/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold ${
                  rank === UserRank.WHALE ? 'bg-purple-900 text-purple-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  {rank}
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-20 h-20 rounded-full border-4 border-slate-700 group-hover:border-brand-primary transition-colors object-cover" 
                  />
                  <div className="absolute -bottom-2 bg-slate-900 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-700">
                    Joined {new Date(user.joinDate).getFullYear()}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-white truncate w-full">{user.name}</h3>
                <p className="text-slate-400 text-xs mb-4">ID: {user.id}</p>

                <div className="grid grid-cols-2 w-full gap-2 text-left bg-slate-900/50 p-3 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Recycle size={10} /> Bottles</p>
                    <p className="text-sm font-bold text-brand-secondary">{user.totalBottles.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><TrendingUp size={10} /> XRP</p>
                    <p className="text-sm font-bold text-brand-primary">{user.totalXRP.toFixed(1)}</p>
                  </div>
                </div>
                
                <div className="mt-4 w-full">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Monthly Goal</span>
                        <span>{Math.round((user.bottlesThisMonth / 250) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-secondary" style={{ width: `${Math.min((user.bottlesThisMonth / 250) * 100, 100)}%` }}></div>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};