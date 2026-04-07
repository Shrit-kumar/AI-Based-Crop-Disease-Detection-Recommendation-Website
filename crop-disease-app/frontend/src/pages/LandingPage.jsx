import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, Smartphone, Camera, Users, Target, Award, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { useEffect } from 'react';

const LandingPage = () => {
    const { isDarkMode } = useTheme();
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const isAuthenticated = !!currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const features = [
        {
            icon: ShieldCheck,
            title: t('landing.features.title'),
            description: t('landing.features.description'),
            color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
        },
        {
            icon: Zap,
            title: t('landing.features.treatment.title'),
            description: t('landing.features.treatment.description'),
            color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
        },
        {
            icon: BarChart3,
            title: t('landing.features.history.title'),
            description: t('landing.features.history.description'),
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
        },
        {
            icon: Smartphone,
            title: t('landing.features.schemes.title'),
            description: t('landing.features.schemes.description'),
            color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
        },
        {
            icon: Camera,
            title: t('landing.features.upload.title'),
            description: t('landing.features.upload.description'),
            color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
        }
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'} -z-20`} />

                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] rounded-full bg-secondary/20 blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-1/2 lg:max-w-none lg:pb-28 xl:pb-32 pt-24 px-4 sm:px-6 lg:px-8 lg:pr-20">
                        <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in-up">
{t('landing.hero.tagline')}
                                </div>
                                <h1 className={`text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                                    <span className="block xl:inline">{t('landing.hero.title.part1')}</span>{' '}
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary xl:inline">{t('landing.hero.title.part2')}</span>
                                </h1>
                                    <p className={`mt-3 text-base sm:mt-5 sm:text-lg md:mt-5 md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                                    {t('landing.hero.description')}
                                </p>
                                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                                    {!isAuthenticated ? (
                                        <Link
                                            to="/auth"
                                            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-emerald-600 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
                                        >
                                            {t('landing.hero.cta.getStarted')}
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/dashboard"
                                            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-emerald-600 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
                                        >
                                            {t('landing.hero.cta.dashboard')}
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                                        className={`mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl md:py-4 md:text-lg md:px-10 transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} shadow-md hover:shadow-lg`}
                                    >
                                        {t('landing.hero.cta.learnMore')}
                                    </button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 overflow-hidden">
                    <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 z-10"></div>
                        <img
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                            alt="Smart Farming"
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className={`py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {features.map((feature, index) => (
                                <div key={index} className={`rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'}`}>
                                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-md ${feature.color} mb-4`}>
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {feature.description}
                                    </p>
                                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div id="about" className={`py-12 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mission */}
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center mb-16">
                        <div>
                            <h3 className={`text-2xl font-extrabold sm:text-3xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {t('landing.about.empowering')}
                            </h3>
                            <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {t('landing.about.description1')}
                            </p>
                            <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {t('landing.about.description2')}
                            </p>
                        </div>
                        <div className="mt-10 lg:mt-0">
                            <img
                                className="rounded-lg shadow-xl"
                                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                                alt="Farmer in field"
                            />
                        </div>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 mx-auto mb-4">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('landing.about.values.farmerCentric.title')}</h3>
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {t('landing.about.values.farmerCentric.description')}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 mx-auto mb-4">
                                <Target className="h-8 w-8" />
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('landing.about.values.accuracy.title')}</h3>
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {t('landing.about.values.accuracy.description')}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400 mx-auto mb-4">
                                <Award className="h-8 w-8" />
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('landing.about.values.innovation.title')}</h3>
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {t('landing.about.values.innovation.description')}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 mx-auto mb-4">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('landing.about.values.accessibility.title')}</h3>
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {t('landing.about.values.accessibility.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-800'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
<p className="text-center text-sm sm:text-base text-gray-400 py-4 sm:py-6">
{t('landing.about.footer')}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
