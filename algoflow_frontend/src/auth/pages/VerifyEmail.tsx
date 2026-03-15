import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { apiFetch } from '../api';
import { useAuth } from '../AuthContext';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const VerifyEmailPage: React.FC = () => {
  const query = useQuery();
  const token = query.get('token');
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Token is missing.');
        return;
      }

      setStatus('verifying');
      setMessage('');

      try {
        const response = await apiFetch('/api/auth/verify-email/', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Email verification failed.');
        }

        setStatus('success');
        setMessage(data.message || 'Email verified successfully! Logging you in...');

        // Refresh auth state (cookies are set by backend)
        await checkAuth();

        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Email verification failed. Please try again.');
      }
    };

    verify();
  }, [token, checkAuth, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card variant="default" className="p-8 lg:p-12 shadow-2xl overflow-hidden text-center">
          {status === 'verifying' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
              <h1 className="text-2xl font-black tracking-tight">Verifying your email...</h1>
              <p className="text-slate-500 dark:text-slate-400">
                Please wait while we confirm your email address.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <h1 className="text-2xl font-black tracking-tight">Email Verified</h1>
              <p className="text-slate-500 dark:text-slate-400">{message}</p>
              <Button
                className="mt-4"
                onClick={() => navigate('/')}
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h1 className="text-2xl font-black tracking-tight">Verification Failed</h1>
              <p className="text-slate-500 dark:text-slate-400">{message}</p>
              <div className="flex flex-col gap-2 w-full mt-4">
                <Button
                  variant="primary"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Go to Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/register')}
                  className="w-full"
                >
                  Create a new account
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
