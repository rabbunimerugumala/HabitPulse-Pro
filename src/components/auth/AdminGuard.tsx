import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaLock } from 'react-icons/fa';

export const AdminGuard = ({ children }: { children: React.ReactElement }) => {
    const { user, loading } = useAuth();

    // Hardcoded admin check as per requirements
    const isAdmin = user?.email === 'rabbuni144@gmail.com';

    if (loading) return null; // Or a loading spinner

    if (!user || !isAdmin) {
        return (
            <div className="h-[calc(100vh-theme(spacing.20))] flex items-center justify-center p-4">
                <div className="text-center max-w-md w-full p-8 rounded-3xl bg-surface/50 border border-white/10 backdrop-blur-xl shadow-2xl">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <FaLock className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Admin Access Required</h1>
                    <p className="text-gray-400 mb-8">
                        You do not have permission to view this page. Please contact the administrator if you believe this is an error.
                    </p>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs font-mono text-gray-500 break-all">
                        Current user: {user?.email || 'Not logged in'}
                    </div>
                </div>
            </div>
        );
    }

    return children;
};
