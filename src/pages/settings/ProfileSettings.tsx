import { useState } from 'react';
import toast from 'react-hot-toast';
import { AppLayout } from '../../components/layout/AppLayout';
import { BackButton } from '../../components/ui/BackButton';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../config/supabaseClient';

export const ProfileSettings = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.user_metadata?.name || '',
        bio: user?.user_metadata?.bio || '',
        location: user?.user_metadata?.location || '',
        picture: user?.user_metadata?.picture || ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // 1. Update Auth Metadata (Supabase Auth)
            await updateProfile({
                displayName: formData.displayName,
                photoURL: formData.picture,
                data: {
                    bio: formData.bio,
                    location: formData.location
                }
            });

            // 2. Sync to Profiles Table (Database)
            // This ensures Admin Users page sees the up-to-date display name
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    display_name: formData.displayName,
                    // We can also sync other fields if they exist in profiles table, but display_name is the critical one requested
                })
                .eq('id', user?.id);

            if (profileError) {
                console.error('Error syncing to profiles table:', profileError);
                // We don't throw here to avoid failing the whole save if just the DB sync fails, 
                // but ideally they should be consistent.
                toast.error('Profile saved, but public name might not update everywhere immediately.');
            } else {
                toast.success('Profile updated successfully!');
            }

        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = () => {
        const url = prompt('Enter image URL for avatar:', formData.picture);
        if (url !== null) {
            handleChange('picture', url);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <BackButton fallbackPath="/settings" />
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-surface border-4 border-neon-blue/20 flex items-center justify-center text-4xl overflow-hidden shadow-xl shrink-0">
                            {formData.picture ? (
                                <img src={formData.picture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400">{formData.displayName?.[0] || user?.email?.[0]}</span>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={handleAvatarChange}
                                className="px-4 py-2 bg-neon-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-neon-blue/20"
                            >
                                Change Avatar
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Display Name"
                            value={formData.displayName}
                            onChange={(e) => handleChange('displayName', e.target.value)}
                        />
                        <Input label="Email" value={user?.email || ''} disabled />
                        <Input
                            label="Bio"
                            placeholder="Tell us about yourself..."
                            value={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                        />
                        <Input
                            label="Location"
                            placeholder="City, Country"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                        />
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-[#39ff14]/80 transition-colors shadow-lg shadow-neon-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
