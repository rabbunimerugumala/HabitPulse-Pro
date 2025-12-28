import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { AuthLayout } from '../components/auth/AuthLayout';

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

    return (
        <AuthLayout>
            <div className="w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-2">
                        Welcome Back
                    </h2>
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
                        className="bg-surface/50 border-white/10 focus:border-neon-blue"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<FaLock />}
                        required
                        className="bg-surface/50 border-white/10 focus:border-neon-blue"
                    />

                    <Button type="submit" className="w-full h-12 text-lg" isLoading={loading}>
                        Sign In
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-neon-blue hover:text-neon-purple transition-colors font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};
