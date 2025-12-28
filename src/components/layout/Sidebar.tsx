import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaList, FaCalendarAlt, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { clsx } from 'clsx';

const NAV_ITEMS = [
    { icon: FaHome, label: 'Home', path: '/' },
    { icon: FaList, label: 'Habits', path: '/habits' },
    { icon: FaCalendarAlt, label: 'Calendar', path: '/calendar' },
    { icon: FaChartBar, label: 'Analytics', path: '/analytics' },
    { icon: FaCog, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
    const { user, logout } = useAuth();

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-surface/30 border-r border-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-neon-blue/20">
                    HP
                </div>
                <h1 className="text-xl font-bold font-heading tracking-tight">HabitPulse Pro</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                            isActive
                                ? "bg-neon-blue/10 text-neon-blue font-medium shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={clsx(
                                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-neon-blue transition-all duration-300",
                                    isActive ? "opacity-100" : "opacity-0 -translate-x-full"
                                )} />
                                <item.icon className={clsx("text-lg", isActive ? "animate-pulse-slow" : "group-hover:scale-110 transition-transform")} />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-surface border border-white/10 overflow-hidden">
                        {user?.user_metadata?.picture ? (
                            <img src={user.user_metadata.picture} alt={user.user_metadata.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-white/5">{user?.user_metadata?.name?.[0] || user?.email?.[0] || 'U'}</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.user_metadata?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <FaSignOutAlt />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};
