import React, { useState, useRef, useEffect } from 'react';
import { User, LogIn, UserPlus, LogOut, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 p-1.5 pr-3 rounded-full transition-all duration-300 border",
          isOpen 
            ? "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20" 
            : "bg-white/5 border-white/10 hover:bg-white/10"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-white shadow-inner",
          isAuthenticated ? "bg-indigo-500" : "bg-slate-700"
        )}>
          {isAuthenticated ? (
            <span className="text-xs font-black uppercase">{user?.name.charAt(0)}</span>
          ) : (
            <User size={16} />
          )}
        </div>
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest hidden sm:block",
          isOpen ? "text-white" : "text-slate-400"
        )}>
          {isAuthenticated ? user?.name.split(' ')[0] : 'Account'}
        </span>
        <ChevronDown size={12} className={cn("transition-transform duration-300", isOpen ? "rotate-180 text-white" : "text-slate-500")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute right-0 mt-3 w-64 z-[100]"
          >
            <Card variant="glass" className="p-2 overflow-hidden shadow-2xl border-white/10">
              {isAuthenticated && (
                <div className="p-4 mb-2 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs font-black text-white uppercase tracking-tight truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{user?.email}</p>
                </div>
              )}

              <div className="space-y-1">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => handleAction('/login')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                    >
                      <LogIn size={16} className="text-indigo-400" />
                      Login
                    </button>
                    <button
                      onClick={() => handleAction('/register')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                    >
                      <UserPlus size={16} className="text-emerald-400" />
                      Sign Up
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500/10 text-rose-400 transition-all"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
