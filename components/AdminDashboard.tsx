
import React, { useState } from 'react';
import { User, Expense, SystemSettings, UserRole } from '../types';
import { AlertCircle, CheckCircle, Settings, Save, User as UserIcon, DollarSign, BarChart3, FilePlus, XCircle } from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  expenses: Expense[];
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onUpdateUserStats: (userId: string, bottles: number, xrp: number) => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onLogCollection: (userId: string, amount: number, adminName: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, 
  expenses, 
  settings, 
  onUpdateSettings,
  onUpdateUserStats,
  onApproveUser,
  onRejectUser,
  onLogCollection
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'manage' | 'approvals' | 'expenses' | 'settings'>('overview');
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  
  // Management State
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [collectionAmount, setCollectionAmount] = useState<string>('');
  
  // Pending Users
  const pendingUsers = users.filter(u => u.registrationStatus === 'PENDING');

  const handleLogCollection = () => {
    if (!selectedUser || !collectionAmount) return;
    const amount = parseInt(collectionAmount);
    if (isNaN(amount) || amount <= 0) return;

    onLogCollection(selectedUser, amount, "Admin Session");
    setCollectionAmount('');
    alert("Collection logged and receipt generated.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Admin Header */}
        <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-red-900/30 rounded-lg">
                    <AlertCircle className="text-red-500 w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-red-100">Admin Command Center</h2>
                    <p className="text-red-300/80 text-sm">Restricted Access: Root & Admins Only</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                {['overview', 'approvals', 'manage', 'expenses', 'settings'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-colors uppercase ${activeTab === tab ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {tab}
                        {tab === 'approvals' && pendingUsers.length > 0 && (
                            <span className="ml-1 bg-red-500 text-white px-1.5 rounded-full text-[10px]">{pendingUsers.length}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-4">Pending Registrations</h3>
                {pendingUsers.length === 0 ? (
                    <p className="text-slate-500 italic">No pending approvals.</p>
                ) : (
                    <div className="space-y-4">
                        {pendingUsers.map(u => (
                            <div key={u.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-white">{u.name}</p>
                                    <p className="text-sm text-slate-400">{u.email} | {u.phonePrimary}</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-600">Method: {u.registrationPaymentMethod}</span>
                                        <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-1 rounded border border-amber-600/30">Fee: P{settings.registrationFeeBWP}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onRejectUser(u.id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded"><XCircle size={20} /></button>
                                    <button onClick={() => onApproveUser(u.id)} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded flex items-center gap-2">
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* MANAGE TAB (Collection Logging) */}
        {activeTab === 'manage' && (
             <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-2xl mx-auto animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FilePlus /> Log Collection & Generate Receipt
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2">Select Participant</label>
                        <select 
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="">-- Select User --</option>
                            {users.filter(u => u.role === UserRole.PARTICIPANT && u.registrationStatus === 'APPROVED').map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.totalBottles} collected)</option>
                            ))}
                        </select>
                    </div>

                    {selectedUser && (
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Bottles Collected Today</label>
                                <input 
                                    type="number" 
                                    value={collectionAmount}
                                    onChange={(e) => setCollectionAmount(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 text-white rounded p-2 text-lg font-bold text-brand-secondary"
                                    placeholder="e.g. 250"
                                />
                            </div>
                            <button 
                                onClick={handleLogCollection}
                                className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 rounded flex justify-center items-center gap-2"
                            >
                                <Save size={18} /> Save & Send Receipt
                            </button>
                        </div>
                    )}
                </div>
             </div>
        )}

        {/* EXPENSES TAB */}
        {activeTab === 'expenses' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-4">Project Expenses</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Description</th>
                                <th className="p-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {expenses.map(exp => (
                                <tr key={exp.id}>
                                    <td className="p-3 text-slate-400">{exp.date}</td>
                                    <td className="p-3"><span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded capitalize">{exp.category}</span></td>
                                    <td className="p-3 text-white">{exp.description}</td>
                                    <td className="p-3 text-right text-red-400 font-mono">- P {exp.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 p-4 bg-slate-900 rounded-lg text-right">
                    <span className="text-slate-400 mr-4">Total Expenses:</span>
                    <span className="text-2xl font-bold text-red-400">P {expenses.reduce((a,b) => a + b.amount, 0).toFixed(2)}</span>
                </div>
            </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-3xl mx-auto animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings /> System Configuration
                    </h3>
                    <button 
                        onClick={() => onUpdateSettings(localSettings)}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
                {/* Simplified Settings View for brevity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Registration Fee (P)</label>
                        <input 
                            type="number" 
                            value={localSettings.registrationFeeBWP} 
                            onChange={(e) => setLocalSettings({...localSettings, registrationFeeBWP: parseFloat(e.target.value)})}
                            className="w-full bg-slate-900 border border-slate-600 text-white rounded p-2" 
                        />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Payment Number</label>
                         <input 
                             type="text" 
                             value={localSettings.paymentPhoneNumber} 
                             onChange={(e) => setLocalSettings({...localSettings, paymentPhoneNumber: e.target.value})}
                             className="w-full bg-slate-900 border border-slate-600 text-white rounded p-2" 
                         />
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
