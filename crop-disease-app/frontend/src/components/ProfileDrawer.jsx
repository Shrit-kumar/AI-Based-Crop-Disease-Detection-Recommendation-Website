import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { X, User, LogOut, Edit3, Shield, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfileDrawer = ({ isOpen, onClose }) => {
    const { isDarkMode } = useTheme(); // Use global theme context properly
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const { t } = useTranslation();

    // Smooth animation mounting
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    const handleLogout = async () => {
        try {
            await logout();
            onClose();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    if (!visible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            <div className={`fixed inset-y-0 right-0 max-w-full flex transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="w-screen max-w-md">
                    <div className={`h-full flex flex-col shadow-2xl ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>

                        {/* Header Gradient */}
                        <div className={`relative px-6 py-10 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-green-600 to-emerald-700'}`}>

                            {/* Close Button */}
                            <button
                                type="button"
                                className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                onClick={onClose}
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <div className={`h-24 w-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg border-4 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white text-green-700 border-green-200/50'}`}>
                                        {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <User className="h-10 w-10" />}
                                    </div>
                                    <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-400 border-2 border-white rounded-full"></div>
                                </div>

                                <h2 className="mt-4 text-2xl font-bold text-white tracking-tight">
                                    {currentUser?.displayName || t('profile.defaultUser')}
                                </h2>
                                <p className="text-sm text-green-100 font-medium opacity-90">{currentUser?.email}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 py-6 px-4 sm:px-6 overflow-y-auto">
                            <div className="space-y-6">

                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {t('profile.accountSettings')}
                                    </h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                onClose();
                                                navigate('/edit-profile');
                                            }}
                                            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white hover:shadow-sm'}`}
                                        >
                                            <div className={`p-2 rounded-lg mr-4 ${isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                                <Edit3 className="h-5 w-5" />
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{t('profile.editProfile')}</p>
                                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('profile.editSubtitle')}</p>
                                            </div>
                                        </button>


                                    </div>
                                </div>

                                {/* Logout Section */}
                                <div className="pt-4">
                                    <button
                                        onClick={handleLogout}
                                        className={`w-full flex items-center justify-center p-4 rounded-xl font-medium transition-all duration-200 border ${isDarkMode
                                            ? 'border-red-900/50 text-red-400 hover:bg-red-900/20'
                                            : 'border-red-100 text-red-600 hover:bg-red-50'}`}
                                    >
                                        <LogOut className="mr-2 h-5 w-5" />
                                        {t('profile.signOut')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDrawer;
