
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Leaderboard } from './components/Leaderboard';
import { ParticipantsList } from './components/ParticipantsList';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { KnowledgeBase } from './components/KnowledgeBase';
import { NewsFeed } from './components/NewsFeed';
import { MOCK_USERS, INITIAL_SYSTEM_SETTINGS } from './constants';
import { User, Expense, UserRole, SystemSettings, PaymentMethod } from './types';
import { Lock } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', description: 'Truck Fuel - Gaborone North', amount: 450, category: 'transport', date: '2023-10-05' },
    { id: '2', description: 'Sacks & Gloves', amount: 200, category: 'collection', date: '2023-10-02' },
  ]);

  // Route Detection for Admin CMS
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (path === '/cms' || path === '/admin' || hash === '#admin' || hash === '#cms') {
      setActiveTab('admin');
    }
  }, []);

  // Admin Actions
  const handleUpdateUserStats = (userId: string, bottles: number, xrp: number) => {
    setUsers(prev => prev.map(u => {
        if (u.id === userId) {
            return { ...u, totalBottles: bottles, totalXRP: xrp };
        }
        return u;
    }));
  };

  const handleApproveUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, registrationStatus: 'APPROVED' } : u));
  };

  const handleRejectUser = (userId: string) => {
     setUsers(prev => prev.map(u => u.id === userId ? { ...u, registrationStatus: 'REJECTED' } : u));
  };

  const handleLogCollection = (userId: string, amount: number, adminName: string) => {
    const date = new Date().toISOString().split('T')[0];
    setUsers(prev => prev.map(u => {
        if (u.id === userId) {
            const newValue = u.totalBottles + amount;
            // Update history and total XRP estimate
            return {
                ...u,
                totalBottles: newValue,
                bottlesThisMonth: u.bottlesThisMonth + amount,
                collectionRecords: [
                    {
                        id: `col-${Date.now()}`,
                        date,
                        amount,
                        valueBWP: amount * systemSettings.defaultBottleValueBWP,
                        verifiedBy: adminName
                    },
                    ...u.collectionRecords
                ]
            };
        }
        return u;
    }));
  };

  // Auth
  const handleLogin = (identifier: string) => {
    // Login with Email OR Primary Phone
    const existingUser = users.find(u => 
        u.email.toLowerCase() === identifier.toLowerCase() || 
        u.phonePrimary.replace(/\s/g, '') === identifier.replace(/\s/g, '')
    );

    if (existingUser) {
        setCurrentUser(existingUser);
        setIsAuthModalOpen(false);
        // If user is admin/root, default to admin dashboard, else dashboard
        if (existingUser.role === UserRole.ROOT || existingUser.role === UserRole.ADMIN) {
            setActiveTab('admin');
        } else {
            setActiveTab('dashboard');
        }
    } else {
        alert("User not found. Please register or check your details.");
    }
  };

  const handleRegister = (name: string, email: string, phone: string, paymentMethod: PaymentMethod) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      role: UserRole.PARTICIPANT,
      name, email, phonePrimary: phone,
      avatar: `https://picsum.photos/seed/${Date.now()}/200/200`,
      registrationStatus: 'PENDING',
      registrationPaymentMethod: paymentMethod,
      totalBottles: 0, bottlesThisMonth: 0, totalCashBWP: 0, totalXRP: 0,
      joinDate: new Date().toISOString().split('T')[0],
      history: [],
      collectionRecords: []
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const renderContent = () => {
    switch (activeTab) {
        case 'home':
            return <LandingPage users={users} settings={systemSettings} onJoinClick={() => setIsAuthModalOpen(true)} />;
        case 'dashboard':
            return currentUser ? <ParticipantDashboard user={currentUser} settings={systemSettings} /> : (
                <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center space-y-6 animate-fade-in">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full">
                        <Lock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                        <p className="text-slate-400 mb-6">Please log in to view your dashboard.</p>
                        <button onClick={() => setIsAuthModalOpen(true)} className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg">Log In / Register</button>
                    </div>
                </div>
            );
        case 'participants':
            return <ParticipantsList users={users} />;
        case 'leaderboard':
            return <Leaderboard users={users.filter(u => u.role === UserRole.PARTICIPANT)} />;
        case 'kb':
            return <KnowledgeBase />;
        case 'news':
            return <NewsFeed />;
        case 'admin':
            return currentUser && (currentUser.role === UserRole.ROOT || currentUser.role === UserRole.ADMIN) ? (
                <AdminDashboard 
                    users={users}
                    expenses={expenses}
                    settings={systemSettings}
                    onUpdateSettings={setSystemSettings}
                    onUpdateUserStats={handleUpdateUserStats}
                    onApproveUser={handleApproveUser}
                    onRejectUser={handleRejectUser}
                    onLogCollection={handleLogCollection}
                />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <Lock className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white">Unauthorized Access</h2>
                    <p className="text-slate-400 mt-2">You do not have permission to view the CMS.</p>
                    {!currentUser && (
                        <button onClick={() => setIsAuthModalOpen(true)} className="mt-6 text-brand-primary hover:underline">Login as Admin</button>
                    )}
                </div>
            );
        default:
            return <LandingPage users={users} settings={systemSettings} onJoinClick={() => setIsAuthModalOpen(true)} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      currentUser={currentUser}
      onLoginClick={() => setIsAuthModalOpen(true)}
      onLogoutClick={handleLogout}
    >
      {renderContent()}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </Layout>
  );
};

export default App;
