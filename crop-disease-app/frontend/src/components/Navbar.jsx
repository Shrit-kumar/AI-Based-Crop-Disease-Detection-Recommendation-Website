import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, User, LogOut, Menu, X, Moon, Sun, Globe } from 'lucide-react';
import ProfileDrawer from './ProfileDrawer';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { t, language, switchLanguage } = useTranslation();
  const isAuthenticated = !!currentUser;
  const [activeSection, setActiveSection] = useState('home');

    // Handle scroll spy for landing page
    useEffect(() => {
        if (location.pathname !== '/') return;

        const handleScroll = () => {
            const sections = ['features', 'about'];
            const scrollPosition = window.scrollY + 100;

            // Default to home
            let current = 'home';

            // Check if we've scrolled past the hero/home section (approx 500px or when features starts)
            // Or better, check specific elements
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition) {
                    current = section;
                }
            }

            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    useEffect(() => {
        // Reset active section when path changes
        if (location.pathname !== '/') {
            setActiveSection('');
        } else {
            setActiveSection('home');
        }
    }, [location.pathname]);

    useEffect(() => {
        // Close mobile menu when route changes
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                if (id === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const element = document.getElementById(id);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            if (id === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const isActive = (path) => {
        if (location.pathname === '/' && path.startsWith('/#')) {
            // For hash links on landing page
            const section = path.substring(2); // remove '/#'
            return activeSection === section;
        }
        if (location.pathname === '/' && path === '/') {
            return activeSection === 'home';
        }
        return location.pathname === path;
    };

    const getNavLinkClass = (path) => {
        const isActiveLink = isActive(path);
        const baseClass = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative";

        if (isActiveLink) {
            return `${baseClass} bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20`;
        }

        return isDarkMode
            ? `${baseClass} text-gray-300 hover:text-white hover:bg-white/5`
            : `${baseClass} text-gray-600 hover:text-primary hover:bg-green-50`;
    };

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isDarkMode ? 'bg-dark/80 border-b border-gray-800 backdrop-blur-md' : 'bg-white/80 border-b border-gray-200 backdrop-blur-md'} shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <Leaf className="h-8 w-8 text-primary" />
                                <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">PlantGuard</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-6 md:flex md:items-center md:space-x-6">
                            {isAuthenticated ? (
                                // Authenticated Navigation
                                <>
                                    {/* Home link removed for authenticated users */}
                                    <Link to="/dashboard" className={getNavLinkClass('/dashboard')}>
                                        {t('navbar.dashboard')}
                                    </Link>
                                    <Link to="/detect" className={getNavLinkClass('/detect')}>
                                        {t('navbar.detect')}
                                    </Link>
                                    <Link to="/reports" className={getNavLinkClass('/reports')}>
                                        {t('navbar.reports')}
                                    </Link>
                                    <Link to="/schemes" className={getNavLinkClass('/schemes')}>
                                        {t('navbar.schemes')}
                                    </Link>
                                </>
                            ) : (
                                // Public Navigation
                                <>
                                        <a href="/" className={getNavLinkClass('/')} onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                                        {t('navbar.public.home')}
                                    </a>
                                    <button
                                        onClick={() => scrollToSection('features')}
                                        className={`${getNavLinkClass('/#features')} focus:outline-none`}
                                    >
                                        {t('navbar.public.features')}
                                    </button>
                                    <button
                                        onClick={() => scrollToSection('about')}
                                        className={`${getNavLinkClass('/#about')} focus:outline-none`}
                                    >
                                        {t('navbar.public.about')}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Right Side - Theme Toggle & User Menu */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-all duration-300 ${isDarkMode
                                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                aria-label="Toggle theme"
                            >
                                {isDarkMode ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </button>

                            {/* Language Switcher */}
                            <div className="relative">
                              <button
                                onClick={() => switchLanguage(language === 'en' ? 'hi' : 'en')}
                                className={`p-2 rounded-full transition-all duration-300 flex items-center gap-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                                  isDarkMode 
                                    ? 'text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-blue-400'
                                    : 'text-gray-600 bg-gray-100 border border-gray-300 hover:bg-gray-200 hover:text-blue-600'
                                }`}
                                title="Toggle Language"
                              >
                                <Globe className="h-4 w-4" />
                                <span className="text-xs font-medium">
                                  {language === 'en' ? 'EN' : 'हिं'}
                                </span>
                              </button>
                            </div>

                            {/* User Profile / Login - Desktop */}
                            <div className="hidden sm:flex items-center">
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => setIsDrawerOpen(true)}
                                        className={`p-2 rounded-full transition-all duration-200 ${isDarkMode
                                            ? 'bg-gray-800 text-gray-300 hover:text-primary hover:bg-gray-700'
                                            : 'bg-gray-100 text-gray-500 hover:text-primary hover:bg-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <User className="h-6 w-6" />
                                    </button>
                                ) : (
                                        <Link
                                            to="/auth"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                                        >
                                            {t('navbar.login')}
                                        </Link>
                                )}
                            </div>

                            {/* Mobile Profile Icon - Show on mobile only */}
                            {isAuthenticated && (
                                <button
                                    onClick={() => setIsDrawerOpen(true)}
                                    className={`sm:hidden p-2 rounded-full transition-all duration-200 ${isDarkMode
                                        ? 'bg-gray-800 text-gray-300 hover:text-primary hover:bg-gray-700'
                                        : 'bg-gray-100 text-gray-500 hover:text-primary hover:bg-gray-200'
                                        }`}
                                    aria-label="Open user menu"
                                >
                                    <User className="h-6 w-6" />
                                </button>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`md:hidden p-2 rounded-lg transition-all duration-200 ${isDarkMode
                                    ? 'text-gray-300 hover:bg-gray-800'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className={`md:hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                        <div className={`px-2 pt-2 pb-3 space-y-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            {isAuthenticated ? (
                                // Authenticated Mobile Navigation
                                <>
                                    {/* Home link removed for authenticated users */}
                                    <Link
                                        to="/dashboard"
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/dashboard')
                                            ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-primary font-bold underline`
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-primary hover:bg-gray-700'
                                                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                            }`}
                                    >
                                        {t('navbar.dashboard')}
                                    </Link>
                                    <Link
                                        to="/detect"
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/detect')
                                            ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-primary font-bold underline`
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-primary hover:bg-gray-700'
                                                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                            }`}
                                    >
                                        {t('navbar.detect')}
                                    </Link>
                                    <Link
                                        to="/reports"
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/reports')
                                            ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-primary font-bold underline`
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-primary hover:bg-gray-700'
                                                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                            }`}
                                    >
                                        {t('navbar.reports')}
                                    </Link>
                                    <Link
                                        to="/schemes"
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/schemes')
                                            ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-primary font-bold underline`
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-primary hover:bg-gray-700'
                                                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                            }`}
                                    >
                                        {t('navbar.schemes')}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center gap-2 ${isDarkMode
                                            ? 'text-red-400 hover:bg-gray-700 hover:text-red-300'
                                            : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                                            }`}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        {t('navbar.logout')}
                                    </button>
                                </>
                            ) : (
                                // Public Mobile Navigation
                                <>
                                    <Link
                                        to="/"
                                        onClick={() => scrollToSection('home')}
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/')
                                            ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-primary font-bold underline`
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-primary hover:bg-gray-700'
                                                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                            }`}
                                    >
                                        {t('navbar.public.home')}
                                    </Link>
                                    <button
                                        onClick={() => scrollToSection('features')}
                                        className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/#features')
                                            ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-primary font-bold underline`
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-primary hover:bg-gray-700'
                                                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                            }`}
                                    >
                                        {t('navbar.public.features')}
                                    </button>
                                    <button
                                        onClick={() => scrollToSection('about')}
                                        className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive('/#about')
                                            ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-primary font-bold underline`
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-primary hover:bg-gray-700'
                                                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                            }`}
                                    >
                                        {t('navbar.public.about')}
                                    </button>
                                    <div className="px-3 py-2">
                                        <Link
                                            to="/auth"
                                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-green-700 transition-all duration-200"
                                        >
                                            {t('navbar.login')}
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            <ProfileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </>
    );
};

export default Navbar;
