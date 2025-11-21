import React from 'react';
import { User, UserRank } from '../types';
import { getRank } from '../constants';
import { Trophy, Medal, Coins } from 'lucide-react';

interface LeaderboardProps {
  users: User[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  // Sort users by total bottles descending
  const sortedUsers = [...users].sort((a, b) => b.totalBottles - a.totalBottles);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-slate-800 to-slate-800/50">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-brand-accent" /> Top Recyclers
            </h2>
            <p className="text-slate-400 text-sm mt-1">Competing for the highest XRP contribution</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4">Rank</th>
              <th className="p-4">Participant</th>
              <th className="p-4 text-right">Bottles (Total)</th>
              <th className="p-4 text-right">Contribution (BWP)</th>
              <th className="p-4 text-right">XRP Held</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedUsers.map((user, index) => {
              const rank = getRank(user.totalBottles);
              let rankIcon = null;
              if (index === 0) rankIcon = <Medal className="w-5 h-5 text-yellow-400" />;
              if (index === 1) rankIcon = <Medal className="w-5 h-5 text-slate-300" />;
              if (index === 2) rankIcon = <Medal className="w-5 h-5 text-amber-600" />;

              return (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 font-mono text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="w-6 text-center">{index + 1}</span>
                        {rankIcon}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      <span className="font-medium text-slate-200">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-brand-secondary font-bold">
                    {user.totalBottles.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-slate-300">
                    P {user.totalCashBWP.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-right font-mono text-brand-primary font-bold">
                    {user.totalXRP.toFixed(2)} XRP
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                      rank === UserRank.WHALE ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' :
                      rank === UserRank.MASTER ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
                      rank === UserRank.CONTRIBUTOR ? 'bg-green-900/30 text-green-400 border-green-500/30' :
                      'bg-slate-700 text-slate-400 border-slate-600'
                    }`}>
                      {rank}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
