
import React from 'react';
import { Radio, Video, Bell } from 'lucide-react';
import { MOCK_NEWS } from '../constants';

export const NewsFeed = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-500/20 rounded-lg"><Radio className="text-pink-400 w-8 h-8" /></div>
        <div>
            <h2 className="text-2xl font-bold text-white">News & Updates</h2>
            <p className="text-slate-400">Latest announcements from the Xrp.co.bw team.</p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_NEWS.map(item => (
            <div key={item.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex gap-4 items-start">
                <div className={`p-3 rounded-full ${item.type === 'Video' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                    {item.type === 'Video' ? <Video size={20} /> : <Bell size={20} />}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold bg-slate-900 text-slate-400 px-2 py-0.5 rounded uppercase">{item.type}</span>
                        <span className="text-xs text-slate-500">{item.datePublished}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-slate-400 mt-2">{item.description}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
