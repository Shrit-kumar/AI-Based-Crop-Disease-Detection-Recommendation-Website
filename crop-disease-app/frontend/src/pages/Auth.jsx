import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';

const Auth = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialMode = searchParams.get('mode') || 'login';
    const [mode, setMode] = useState(initialMode);
    const { isDarkMode } = useTheme();
    const { login, signup, resetPassword, googleSignIn, currentUser, loading: authLoading } = useAuth();
    
    // Auth enhancement states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const passwordRef = useRef(null);
    const confirmRef = useRef(null);

    // Password strength calculation
    const calculatePasswordStrength = (password) => {
        if (!password || password.length < 8) {
            return 'weak';
        }
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?{}|<>]/.test(password);
        
        if (hasUpper && hasLower && hasDigit && hasSpecial) {
            return 'strong';
        }
        if (hasUpper || hasLower || hasDigit) {
            return 'medium';
        }
        return 'weak';
    };

    const isFormValid = () => {
        if (mode !== 'signup') {
            return true;
        }
        return passwordsMatch && passwordStrength === 'strong';
    };

    useEffect(() => {
        setMode(searchParams.get('mode') || 'login');
        setError('');
        setMessage('');
    }, [searchParams]);

    // Redirect if already logged in (fixes race condition)
    useEffect(() => {
        if (!authLoading && currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, authLoading, navigate]);

    // Reset validation states on mode change
    useEffect(() => {
        setShowPassword(false);
        setShowConfirmPassword(false);
        setPasswordStrength(null);
        setPasswordsMatch(true);
    }, [mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (mode === 'signup' && !isFormValid()) {
            setError('Password must be strong (8+ chars, upper/lower/number/special) and match confirmation.');
            setLoading(false);
            return;
        }

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        // const name = formData.get('name'); // Name update would require extra step after signup

        try {
            if (mode === 'login') {
                await login(email, password);
                navigate('/dashboard');
            } else if (mode === 'signup') {
                await signup(email, password);
                navigate('/dashboard');
            } else if (mode === 'reset') {
                await resetPassword(email);
                setMessage('Check your inbox for further instructions');
            }
        } catch (err) {
            setError('Failed to ' + (mode === 'login' ? 'log in' : mode === 'signup' ? 'create account' : 'reset password') + ': ' + err.message);
        }

        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await googleSignIn();
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in with Google: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden`}>
            {/* Background Elements */}
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'} -z-20`} />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] rounded-full bg-secondary/20 blur-3xl opacity-50" />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-xl duration-300 pt-[40px]">
                            <Leaf className="h-10 w-10 text-primary" />
                        </div>
                      <span className="font-extrabold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary pt-[40px]">
  PlantGuard
</span>
                    </Link>
                </div>
                <h2 className={`mt-2 text-center text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mode === 'login' && t('auth.login.header')}
                    {mode === 'signup' && t('auth.signup.header')}
                    {mode === 'reset' && t('auth.reset.header')}
                </h2>
                <p className={`mt-2 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {mode === 'login' && (
                        <>
                            {t('auth.login.link')}{' '}
                            <button onClick={() => navigate('/auth?mode=signup')} className="font-semibold text-primary hover:text-emerald-600 transition-colors duration-200">
                                {t('auth.signup.header')}
                            </button>
                        </>
                    )}
                    {mode === 'signup' && (
                        <>
        {t('auth.signup.already')} {' '}
                            <button onClick={() => navigate('/auth?mode=login')} className="font-semibold text-primary hover:text-emerald-600 transition-colors duration-200">
                                {t('auth.login.button')}
                            </button>
                        </>
                    )}

                    {mode === 'reset' && (
                        <>
                            Remember it?{' '}
                            <button onClick={() => navigate('/auth?mode=login')} className="font-semibold text-primary hover:text-emerald-600 transition-colors duration-200">
                                {t('auth.login.button')}
                            </button>
                        
                        </>
                    )}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className={`py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 border border-gray-100'}`}>
                    {error && (
                        <div className="mb-4 bg-red-50/90 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2" role="alert">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-4 bg-green-50/90 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2" role="alert">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            {message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {mode === 'signup' && (
                            <div>
                                <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                    {t('auth.signup.fullName')}
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className={`block w-full pl-10 sm:text-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary py-2.5 ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                {t('auth.common.email')}
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`block w-full pl-10 sm:text-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary py-2.5 ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {mode !== 'reset' && (
                            <div>
                                <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                    {t('auth.common.password')}
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        ref={passwordRef}
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className={`block w-full pl-10 pr-12 sm:text-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary py-2.5 ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                                        placeholder="••••••••"
                                        onInput={(e) => {
                                            if (mode === 'signup') {
                                                setPasswordStrength(calculatePasswordStrength(e.target.value));
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            className={`p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {mode === 'signup' && (
                            <>
                                {/* Password Strength Meter */}
                                {passwordStrength && (
                                    <div className="mt-2 p-2 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium capitalize">
                                                Password Strength
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                                passwordStrength === 'strong' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                                                passwordStrength === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                                                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                                            }`}>
                                                {passwordStrength.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    passwordStrength === 'strong' ? 'bg-green-500' :
                                                    passwordStrength === 'medium' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{
                                                    width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'medium' ? '66%' : '33%'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        {t('auth.signup.confirmPassword')}
                                    </label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            ref={confirmRef}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            className={`block w-full pl-10 pr-12 sm:text-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary py-2.5 ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
                                            placeholder="Confirm your password"
                                            onInput={(e) => {
                                                setPasswordsMatch(e.target.value === passwordRef.current?.value || '');
                                            }}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                className={`p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {!passwordsMatch && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            Passwords do not match
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {mode === 'login' && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className={`h-4 w-4 text-primary focus:ring-primary border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                                    />
                                <label htmlFor="remember-me" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {t('auth.login.remember')}
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/auth?mode=reset')}
                                        className="font-medium text-primary hover:text-emerald-600 transition-colors"
                                    >
                                        {t('auth.login.forgot')}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading || !isFormValid()}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:from-emerald-600 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    mode === 'login' ? t('auth.login.button') : mode === 'signup' ? t('auth.signup.button') : 'Send Reset Link'
                                )}

                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={`px-4 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>{t('auth.common.orContinue')}</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div>
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className={`w-full inline-flex justify-center items-center py-2.5 px-4 border rounded-xl shadow-sm text-sm font-medium transition-all duration-200 ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-gray-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}
                                >
                                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                            </div>
                            <div>
                                <button
                                    disabled={loading}
                                    className={`w-full inline-flex justify-center items-center py-2.5 px-4 border rounded-xl shadow-sm text-sm font-medium transition-all duration-200 ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-gray-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}
                                >
                                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
