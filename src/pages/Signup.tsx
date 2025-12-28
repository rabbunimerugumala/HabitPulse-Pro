import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FaGoogle, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

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

    const handleGoogleSignup = async () => {
        try {
            await loginWithGoogle();
            navigate('/onboarding'); // Redirect to onboarding for new users
        } catch (err) {
            console.error(err);
            setError('Google sign-up failed.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl opacity-30 animate-pulse" />

            <div className="w-full max-w-md p-8 glass-card relative z-10 m-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-pink mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-400">Join HabitPulse Pro today</p>
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
                        className="bg-surface/50"
                    />
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<FaEnvelope />}
                        required
                        className="bg-surface/50"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<FaLock />}
                        required
                        minLength={6}
                        className="bg-surface/50"
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign Up
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-surface text-gray-500 glass rounded-lg">Or sign up with</span>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        className="w-full mt-6"
                        onClick={handleGoogleSignup}
                        icon={<FaGoogle className="mr-2" />}
                    >
                        <FaGoogle className="mr-2" /> Google
                    </Button>
                </div>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-neon-purple hover:text-neon-pink transition-colors font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
