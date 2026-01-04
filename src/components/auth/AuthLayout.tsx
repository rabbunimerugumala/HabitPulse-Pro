import React from 'react';
import { FaMoon, FaRocket, FaShieldAlt } from 'react-icons/fa';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#020312] p-4 font-sans relative overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-neon-purple/10 blur-[100px] animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-neon-blue/10 blur-[100px] animate-pulse delay-1000" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#210635]/20 blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-5xl rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
                {/* Left: About app - Hidden on mobile */}
                <section className="hidden md:flex md:w-[55%] px-8 py-10 md:p-12 bg-gradient-to-b from-[#210635]/80 to-[#020312] flex-col justify-center relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
                    <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl opacity-40 animate-pulse" />

                    <div className="relative z-10 space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7B337E] to-[#6667AB] mb-4">
                                HabitPulse Pro
                            </h1>
                            <h2 className="text-xl md:text-2xl text-white/90 font-medium">
                                Build consistent habits with a premium tracker.
                            </h2>
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                            A premium daily habit tracker with streaks, calendar, and analytics that helps you stay consistent and see your progress at a glance.
                        </p>

                        <ul className="space-y-4">
                            {[
                                { icon: <FaMoon className="text-neon-purple" />, text: "Track daily/weekly habits with color‑coded cards" },
                                { icon: <FaRocket className="text-neon-blue" />, text: "Visualize progress with calendar and 30‑day charts" },
                                { icon: <FaShieldAlt className="text-neon-green" />, text: "Modern glassmorphism design" }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-gray-300">
                                    <span className="p-2 rounded-lg bg-white/5 border border-white/10 shadow-sm shrink-0">
                                        {item.icon}
                                    </span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-8 mt-auto">
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                <FaShieldAlt className="w-3 h-3" /> Secure email sign‑in powered by Supabase Auth
                            </p>
                        </div>
                    </div>
                </section>

                {/* Right: Auth form */}
                <section className="w-full md:w-[45%] px-6 py-8 md:p-12 bg-black/40 flex flex-col justify-center relative">
                    {/* Mobile Header */}
                    <div className="md:hidden mb-8 text-center">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
                            HabitPulse Pro
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Build consistent habits</p>
                    </div>

                    {children}
                </section>
            </div>
        </main>
    );
};
