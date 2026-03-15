import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiFetch } from '../../lib/api';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const ResetPasswordPage: React.FC = () => {
  const query = useQuery();
  const token = query.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Token is missing.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset link. Token is missing.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch('/api/auth/password-reset/confirm/', {
        method: 'POST',
        body: JSON.stringify({
          token,
          password,
          password2: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const message =
          data.errors?.password?.[0] ||
          data.errors?.password2?.[0] ||
          data.errors?.token ||
          data.message ||
          'Password reset failed. Please try again.';
        throw new Error(message);
      }

      setSuccess('Password reset successfully! You can now log in.');

      setTimeout(() => {
        navigate('/login', {
          state: { success: 'Password reset successfully! Please log in.' },
        });
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please try again.');
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
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-6 shadow-xl shadow-indigo-500/20">
              <Key size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Set New Password</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Choose a strong password for your account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="Confirm New Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-lg"
              disabled={!token}
            >
              Update Password
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Back to Login
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

