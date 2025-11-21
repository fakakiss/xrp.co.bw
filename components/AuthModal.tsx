
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, CreditCard, Recycle, Eye, EyeOff } from 'lucide-react';
import { PaymentMethod } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (identifier: string) => void;
  onRegister: (name: string, email: string, phone: string, paymentMethod: PaymentMethod) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<number>(1); // 1: Details, 2: Payment
  
  // Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrimary, setPhonePrimary] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginIdentifier);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phonePrimary) {
        setStep(2);
    }
  };

  const handleRegisterSubmit = () => {
    onRegister(name, email, phonePrimary, paymentMethod);
    // Reset
    setStep(1);
    setName('');
    setPhonePrimary('');
    setEmail('');
    setPassword('');
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
  );

  const FacebookIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900/90 rounded-2xl border border-cyan-500/30 w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(8,145,178,0.2)]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            {mode === 'login' ? 'Access Terminal' : 'Join the Challenge'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-cyan-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {mode === 'login' ? (
             // LOGIN FORM
             <>
                <div className="space-y-3 mb-6">
                    <button 
                    onClick={() => onLogin('google-user@example.com')}
                    className="w-full bg-white hover:bg-gray-100 text-slate-900 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                    >
                        <GoogleIcon />
                        Login with Gmail
                    </button>
                    <button 
                    onClick={() => onLogin('facebook-user@example.com')}
                    className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                    >
                        <span className="bg-white rounded-full p-0.5"><FacebookIcon /></span>
                        Login with Facebook
                    </button>
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-slate-500">Or continue with credentials</span></div>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-cyan-400 uppercase">Email or Phone</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                            <input 
                                type="text" 
                                required 
                                value={loginIdentifier} 
                                onChange={(e) => setLoginIdentifier(e.target.value)} 
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4" 
                                placeholder="name@example.com or 70000000" 
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-cyan-400 uppercase">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-10" 
                                placeholder="••••••••" 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg mt-4">Initialize Session</button>
                </form>
                <div className="mt-6 text-center text-sm text-slate-400">
                    <p>New challenger? <button onClick={() => { setMode('register'); setStep(1); }} className="text-cyan-400 hover:underline font-bold">Start Here</button></p>
                </div>
             </>
          ) : (
             // REGISTER FORM
             <>
                {step === 1 && (
                    <>
                    <div className="space-y-3 mb-6">
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => onLogin('google-user@example.com')} // Simulating quick auth
                                className="w-full bg-white hover:bg-gray-100 text-slate-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs"
                            >
                                <GoogleIcon /> Gmail
                            </button>
                            <button 
                                onClick={() => onLogin('facebook-user@example.com')} // Simulating quick auth
                                className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs"
                            >
                                <span className="bg-white rounded-full w-4 h-4 flex items-center justify-center"><FacebookIcon /></span> Facebook
                            </button>
                        </div>
                    </div>
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-slate-500">Or register manually</span></div>
                    </div>
                    <form onSubmit={handleNextStep} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-cyan-400 uppercase">Nickname / Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4" placeholder="Enter your alias" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-cyan-400 uppercase">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4" placeholder="email@example.com" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-cyan-400 uppercase">Primary Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <input type="tel" required value={phonePrimary} onChange={(e) => setPhonePrimary(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4" placeholder="+267 70 000 000" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg mt-4">Next: Registration Fee</button>
                    </form>
                    </>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white">Registration Fee: P 100.00</h3>
                            <p className="text-sm text-slate-400">Select your payment method to initialize your account.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setPaymentMethod('CASH')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'CASH' ? 'border-cyan-500 bg-cyan-900/20' : 'border-slate-700 hover:bg-slate-800'}`}
                            >
                                <CreditCard className={paymentMethod === 'CASH' ? 'text-cyan-400' : 'text-slate-400'} />
                                <span className="font-bold text-sm">Cash / Mobile</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('BOTTLES')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'BOTTLES' ? 'border-green-500 bg-green-900/20' : 'border-slate-700 hover:bg-slate-800'}`}
                            >
                                <Recycle className={paymentMethod === 'BOTTLES' ? 'text-green-400' : 'text-slate-400'} />
                                <span className="font-bold text-sm">100 Bottles</span>
                            </button>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            {paymentMethod === 'CASH' ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-300 font-bold">Instructions:</p>
                                    <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                                        <li>Send P100.00 to <span className="text-cyan-400 font-mono font-bold text-sm">74470304</span></li>
                                        <li>Keep your transaction reference.</li>
                                        <li>Account status will be <b>PENDING</b> until admin verification.</li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-300 font-bold">Instructions:</p>
                                    <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                                        <li>Deliver 100 bottles to a collection center.</li>
                                        <li>Inform the admin this is for "Registration".</li>
                                        <li>100 Bottles will be deducted from your first deposit.</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold">Back</button>
                            <button onClick={handleRegisterSubmit} className="flex-[2] bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold">
                                Confirm & Register
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-slate-400">
                    <p>Already active? <button onClick={() => { setMode('login'); setStep(1); }} className="text-cyan-400 hover:underline font-bold">Login</button></p>
                </div>
             </>
          )}
        </div>
      </div>
    </div>
  );
};
