import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { supabase } from '../config/supabaseClient';
import { logout as authLogout } from '../services/authService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    updateProfile: (updates: { displayName?: string; photoURL?: string; data?: any }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    updateProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await authLogout();
        setUser(null);
    };

    const updateProfile = async (updates: { displayName?: string; photoURL?: string; data?: any }) => {
        try {
            const { data, error } = await supabase.auth.updateUser({
                data: {
                    name: updates.displayName,
                    picture: updates.photoURL,
                    ...updates.data
                }
            });

            if (error) throw error;
            if (data.user) setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
