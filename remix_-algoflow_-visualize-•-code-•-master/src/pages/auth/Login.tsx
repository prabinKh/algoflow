import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, LogIn, ArrowRight, Key, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get success message from navigation state (e.g., after registration)
  const successMessage = (location.state as any)?.success;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
     navigate('/');
    } catch (error: any) {
     console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await resetPassword(resetEmail);
      setIsResetSent(true);
    } catch (error: any) {
     console.error('Reset password failed:', error);
      setError(error.message || 'Reset password failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

 return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card variant="default" className="p-8 lg:p-12 shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {!isResetMode ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-6 shadow-xl shadow-indigo-500/20">
                    AF
                  </div>
                  <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h1>
                  <p className="text-slate-500 dark:text-slate-400">Continue your learning journey</p>
                </div>

                {successMessage && (
                  <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    {successMessage}
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    icon={<Mail size={20} />}
                  />

                  <div className="space-y-1">
                    <Input
                      label="Password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      icon={<Lock size={20} />}
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsResetMode(true)}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full py-4 text-lg"
                  >
                    <LogIn size={20} className="mr-2" />
                    Sign In
                  </Button>
                </form>

                <div className="mt-10 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1">
                      Create one <ArrowRight size={14} />
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-6 shadow-xl shadow-indigo-500/20">
                    <Key size={32} />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight mb-2">Reset Password</h1>
                  <p className="text-slate-500 dark:text-slate-400">Enter your email to receive a reset link</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                {isResetSent ? (
                  <div className="text-center space-y-6">
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500/20 rounded-2xl text-emerald-600 flex flex-col items-center gap-4">
                      <CheckCircle2 size={48} />
                      <p className="font-bold">Reset link has been sent to your email address!</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsResetMode(false);
                        setIsResetSent(false);
                        setError('');
                      }}
                      className="w-full py-4"
                    >
                      <ArrowLeft size={20} className="mr-2" />
                      Back to Login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      icon={<Mail size={20} />}
                    />

                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="w-full py-4 text-lg"
                    >
                      Reset Password
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(false);
                        setError('');
                      }}
                      className="w-full text-center text-slate-500 font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={16} />
                      Back to Login
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};
