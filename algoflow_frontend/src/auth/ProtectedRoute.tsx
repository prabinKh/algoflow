/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication and/or specific permissions.
 * 
 * USAGE:
 * 
 * // Require authentication (default)
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * // Require email verification
 * <ProtectedRoute requireVerified>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * // Require staff or superuser
 * <ProtectedRoute requireStaff>
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * // Require superuser only
 * <ProtectedRoute requireSuperuser>
 *   <SuperAdminPanel />
 * </ProtectedRoute>
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStaff?: boolean;
  requireSuperuser?: boolean;
  requireVerified?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireStaff = false,
  requireSuperuser = false,
  requireVerified = true,
}) => {
  const { isAuthenticated, isStaff, isAdmin, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if email is verified
  if (requireVerified && !user?.email_verified) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card variant="glass" className="p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6 border border-amber-500/20">
            <Mail size={40} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-4 uppercase">
            Email Not Verified
          </h1>
          <div className="flex items-center justify-center gap-2 text-amber-400 mb-6">
            <AlertTriangle size={20} />
            <p className="font-bold">Please verify your email</p>
          </div>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            You need to verify your email address before accessing this page. 
            Please check your inbox for the verification link.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Check superuser requirement first (more restrictive)
  if (requireSuperuser && !isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card variant="glass" className="p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6 border border-rose-500/20">
            <Shield size={40} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-4 uppercase">
            Access Denied
          </h1>
          <div className="flex items-center justify-center gap-2 text-rose-400 mb-6">
            <AlertTriangle size={20} />
            <p className="font-bold">Superuser privileges required</p>
          </div>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            This page is restricted to administrators only. Your current account 
            does not have the necessary permissions to access this resource.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Check staff requirement
  if (requireStaff && !isStaff && !isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card variant="glass" className="p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6 border border-amber-500/20">
            <Shield size={40} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-4 uppercase">
            Access Denied
          </h1>
          <div className="flex items-center justify-center gap-2 text-amber-400 mb-6">
            <AlertTriangle size={20} />
            <p className="font-bold">Staff privileges required</p>
          </div>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            This page is restricted to staff members only. Your current account 
            does not have the necessary permissions to access this resource.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Access granted
  return <>{children}</>;
};
