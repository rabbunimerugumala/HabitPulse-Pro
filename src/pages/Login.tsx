import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await loginWithEmail(email, password);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Google sign-in failed.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl opacity-30 animate-pulse" />

            <div className="w-full max-w-md p-8 glass-card relative z-10 m-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">Sign in to continue your streak</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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
                        className="bg-surface/50"
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-surface text-gray-500 glass rounded-lg">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        className="w-full mt-6"
                        onClick={handleGoogleLogin}
                        icon={<FaGoogle className="mr-2" />}
                    >
                        <FaGoogle className="mr-2" /> Google
                    </Button>
                </div>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-neon-blue hover:text-neon-purple transition-colors font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
