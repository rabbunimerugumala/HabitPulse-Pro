import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import toast from 'react-hot-toast';

interface Completion {
    id: string;
    habit_id: string;
}

interface Habit {
    id: string;
    user_id: string;
    completions: Completion[];
}

interface UserProfile {
    id: string;
    email: string | null;
    full_name: string | null;
}

interface UserData extends UserProfile {
    habits: Habit[];
}

export const AdminUsersPage = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [debugError, setDebugError] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setDebugError(null);

            // 1. Fetch Profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*');

            if (profilesError) throw new Error(`Profiles Error: ${profilesError.message}`);

            // 2. Fetch Habits
            const { data: habits, error: habitsError } = await supabase
                .from('habits')
                .select('*');

            if (habitsError) throw new Error(`Habits Error: ${habitsError.message}`);

            // 3. Fetch Completions
            // Optimization: We could join completions on habits, but let's be safe and separate if needed. 
            // Actually, habits -> completions is usually safe standard relation. Let's try select('*, completions(*)') first for habits.
            // If that fails, we can separate. But normally habits have direct FK to completions.

            const { data: habitsWithCompletions, error: habitsJoinError } = await supabase
                .from('habits')
                .select('*, completions(*)');

            // If habits->completions join works, great. If not, fallback? 
            // Let's assume the previous error was profiles->habits relation missing.

            if (habitsJoinError) throw new Error(`Habits+Completions Error: ${habitsJoinError.message}`);

            // 4. Manual Join
            const combinedData: UserData[] = (profiles || []).map(profile => {
                const userHabits = (habitsWithCompletions || []).filter((h: any) => h.user_id === profile.id);
                return {
                    ...profile,
                    habits: userHabits
                };
            });

            setUsers(combinedData);
        } catch (error: any) {
            console.error('Error loading users:', error);
            setDebugError(error.message || 'Unknown error');
            toast.error(error.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const deleteUser = async (userId: string) => {
        if (!confirm('Delete this user + ALL their habits/completions? This action cannot be undone.')) return;

        try {
            const { error } = await supabase.rpc('delete_user_and_data', { p_user_id: userId });
            if (error) throw error;

            toast.success('User + data deleted');
            loadUsers();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast.error(`Failed to delete: ${error.message}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">👥 User Management</h1>
                    <p className="text-gray-400">Manage registered users and their data</p>
                </div>
                <button
                    onClick={loadUsers}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium text-gray-300"
                >
                    Refresh List
                </button>
            </div>

            {debugError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-mono text-xs overflow-auto">
                    <strong>Debug Error:</strong> {debugError}
                    <br />
                    <span className="opacity-75">Please check your Supabase RLS policies and Table names.</span>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-xl shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-5 text-left text-sm font-semibold text-gray-300">User Details</th>
                                <th className="p-5 text-left text-sm font-semibold text-gray-300">Total Habits</th>
                                <th className="p-5 text-left text-sm font-semibold text-gray-300">Total Completions</th>
                                <th className="p-5 text-right text-sm font-semibold text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 text-white font-medium">
                                                    {user.full_name?.[0] || user.email?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white group-hover:text-primary-300 transition-colors">{user.full_name || 'Unnamed User'}</div>
                                                    <div className="text-gray-500 text-xs font-mono">{user.email || 'No email'}</div>
                                                    <div className="text-gray-600 text-[10px] font-mono mt-0.5 opacity-50">{user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="inline-flex items-center px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
                                                {user.habits?.length || 0} habits
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="inline-flex items-center px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                                                {user.habits?.reduce((sum, h) => sum + (h.completions?.length || 0), 0) || 0} completions
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                                                title="This will permanently delete the user and all their data"
                                            >
                                                Delete User + Data
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
