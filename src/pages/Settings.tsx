import { useNavigate } from 'react-router-dom';
import { FaDownload, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { useHabits } from '../context/HabitContext';

export const Settings = () => {
    const { user, logout } = useAuth();
    const { habits } = useHabits();
    const navigate = useNavigate();

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
                <div
                    onClick={() => navigate('/settings/profile')}
                    className="glass-card p-6 mb-8 cursor-pointer hover:border-neon-blue/50 transition-colors group"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FaUser className="text-neon-blue" /> Profile
                        </h2>
                        <span className="text-sm text-gray-400 group-hover:text-neon-blue transition-colors">Edit Profile →</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-surface border-2 border-neon-blue/50 flex items-center justify-center text-2xl overflow-hidden">
                            {user?.user_metadata?.picture ? (
                                <img src={user.user_metadata.picture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400">{user?.user_metadata?.name?.[0] || user?.email?.[0]}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{user?.user_metadata?.name || 'User'}</h3>
                            <p className="text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* App Preferences */}


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
