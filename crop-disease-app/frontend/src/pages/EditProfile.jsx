import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { updateProfile, updatePassword } from 'firebase/auth';


const EditProfile = () => {
        const { t } = useTranslation();
        const navigate = useNavigate();
        const { isDarkMode } = useTheme();
        const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: currentUser?.displayName || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Update display name if changed
            if (formData.name !== currentUser.displayName) {
                await updateProfile(currentUser, {
                    displayName: formData.name
                });
            }

            // Update password if provided
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                if (formData.newPassword.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                await updatePassword(currentUser, formData.newPassword);
            }

            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
            <main className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mt-11 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`inline-flex items-center text-sm mb-4 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ArrowLeft className="h-9 w-4 mr-1" />
                        Back to Dashboard
                    </button>
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('editprofile.title')}</h1>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('editprofile.subtitle')}</p>
                </div>

                {/* Profile Form */}
                <div className={`rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                {success}
                            </div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t('editprofile.labels.fullName')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`pl-10 w-full px-4 py-3 rounded-md border ${isDarkMode
                                            ? 'bg-gray-800 border-gray-600 text-white focus:ring-green-500 focus:border-green-500'
                                            : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500'
                                        } focus:ring-2 focus:outline-none`}
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t('editprofile.labels.email')}
                            </label>
                            <input
                                type="email"
                                value={currentUser?.email || ''}
                                disabled
                                className={`w-full px-4 py-3 rounded-md border ${isDarkMode
                                        ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            />
                        </div>

                        {/* Password Change Section */}
                        <div className={`border-t pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('editprofile.labels.changePassword')}</h3>
                            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('editprofile.labels.currentPassword')}</p>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="newPassword" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t('editprofile.labels.newPassword')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className={`pl-10 w-full px-4 py-3 rounded-md border ${isDarkMode
                                                    ? 'bg-gray-800 border-gray-600 text-white focus:ring-green-500 focus:border-green-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500'
                                                } focus:ring-2 focus:outline-none`}
                                            placeholder="Enter new password (min 6 characters)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t('editprofile.confirmPassword')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`pl-10 w-full px-4 py-3 rounded-md border ${isDarkMode
                                                    ? 'bg-gray-800 border-gray-600 text-white focus:ring-green-500 focus:border-green-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500'
                                                } focus:ring-2 focus:outline-none`}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className={`px-6 py-3 rounded-md text-sm font-medium border transition-colors ${isDarkMode
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium text-white transition-colors ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                            >
                                <Save className="h-5 w-5" />
                                {loading ? t('common.saving') : t('common.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditProfile;
