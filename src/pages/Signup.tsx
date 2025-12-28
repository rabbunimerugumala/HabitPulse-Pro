import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmail } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { AuthLayout } from '../components/auth/AuthLayout';

export const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerWithEmail(email, password, name);
            navigate('/onboarding');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-pink mb-2">
                        Create Account
                    </h2>
                    <p className="text-gray-400">Join HabitPulse Pro in minutes</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        icon={<FaUser />}
                        required
                        className="bg-surface/50 border-white/10 focus:border-neon-purple"
                    />
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<FaEnvelope />}
                        required
                        className="bg-surface/50 border-white/10 focus:border-neon-purple"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<FaLock />}
                        required
                        minLength={6}
                        className="bg-surface/50 border-white/10 focus:border-neon-purple"
                    />

                    <Button type="submit" className="w-full h-12 text-lg" isLoading={loading}>
                        Sign Up
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-neon-purple hover:text-neon-pink transition-colors font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};
