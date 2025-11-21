
import React from 'react';
import { Book, ChevronRight } from 'lucide-react';
import { MOCK_KB_ARTICLES } from '../constants';

export const KnowledgeBase = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-500/20 rounded-lg"><Book className="text-indigo-400 w-8 h-8" /></div>
        <div>
            <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
            <p className="text-slate-400">Guides, Rules, and Crypto Education.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_KB_ARTICLES.map(article => (
            <div key={article.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all group cursor-pointer">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">{article.category}</span>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{article.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{article.summary}</p>
                <div className="flex items-center text-xs text-slate-500">
                    <span>By {article.author}</span>
                    <span className="mx-2">•</span>
                    <span>{article.dateCreated}</span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
