import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FaMoon, FaBell, FaDownload, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useHabits } from '../context/HabitContext';

export const Settings = () => {
    const { user, logout } = useAuth();
    const { habits } = useHabits();

    const handleExportData = () => {
        const dataStr = JSON.stringify(habits, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `habit-pulse-data-${new Date().toISOString()}.json`;
        link.click();
    };

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>

                {/* Profile Section */}
                <div className="glass-card p-6 mb-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaUser className="text-neon-blue" /> Profile
                    </h2>
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-20 h-20 rounded-full bg-surface border-2 border-neon-blue/50 flex items-center justify-center text-3xl overflow-hidden">
                            {user?.user_metadata?.picture ? (
                                <img src={user.user_metadata.picture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400">{user?.user_metadata?.name?.[0] || user?.email?.[0]}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{user?.user_metadata?.name || 'User'}</h3>
                            <p className="text-gray-400">{user?.email}</p>
                            <button className="text-sm text-neon-blue mt-1 hover:underline">Change Avatar</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Display Name" defaultValue={user?.user_metadata?.name || ''} />
                        <Input label="Email" defaultValue={user?.email || ''} disabled />
                    </div>
                </div>

                {/* App Preferences */}
                <div className="glass-card p-6 mb-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaMoo className="text-neon-purple" /> Preferences
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                    <FaMoon />
                                </div>
                                <div>
                                    <p className="font-semibold">Dark Mode</p>
                                    <p className="text-sm text-gray-400">Manage theme settings</p>
                                </div>
                            </div>
                            <div className="flex gap-2 text-sm bg-black/20 p-1 rounded-lg">
                                <button className="px-3 py-1 bg-white/10 rounded text-white shadow">On</button>
                                <button className="px-3 py-1 text-gray-500 hover:text-white">off</button>
                                <button className="px-3 py-1 text-gray-500 hover:text-white">System</button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                                    <FaBell />
                                </div>
                                <div>
                                    <p className="font-semibold">Notifications</p>
                                    <p className="text-sm text-gray-400">Daily reminders & updates</p>
                                </div>
                            </div>
                            {/* Toggle Switch Mock */}
                            <div className="w-12 h-6 bg-neon-green/20 rounded-full relative cursor-pointer border border-neon-green/50">
                                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-neon-green rounded-full shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data & Account */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaDownload className="text-neon-green" /> Data & Account
                    </h2>

                    <div className="flex flex-col gap-4">
                        <Button variant="secondary" onClick={handleExportData} className="justify-start">
                            <FaDownload className="mr-3" /> Export My Data (JSON)
                        </Button>

                        <Button variant="ghost" onClick={() => logout()} className="justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <FaSignOutAlt className="mr-3" /> Log Out
                        </Button>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
};
import { FaMoon as FaMoo } from 'react-icons/fa'; // Typo fix alias just in case
