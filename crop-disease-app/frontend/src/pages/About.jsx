    import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';

const About = () => {
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();
    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                            {t('about.hero.title')}
                        </h1>
                        <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
                            {t('about.hero.description')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                    <div>
                        <h2 className={`text-3xl font-extrabold sm:text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {t('landing.about.mission')}
                        </h2>
                        <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            At PlantGuard, we're committed to revolutionizing agriculture through technology. Our mission is to provide farmers with accessible, accurate, and actionable insights to protect their crops from diseases.
                        </p>
                        <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            By leveraging advanced artificial intelligence and machine learning, we help farmers detect crop diseases early, receive treatment recommendations, and make informed decisions that lead to healthier crops and better yields.
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
            </div>

            {/* Values Section */}
            <div className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className={`text-3xl font-extrabold sm:text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {t('landing.about.values.title')}
                        </h2>
                        <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t('landing.about.values.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center">
                            <div className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-4 ${isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('landing.about.values.farmerCentric.title')}</h3>
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {t('landing.about.values.farmerCentric.description')}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-4 ${isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                <Target className="h-8 w-8" />
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('landing.about.values.accuracy.title')}</h3>
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {t('landing.about.values.accuracy.description')}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-4 ${isDarkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                                <Award className="h-8 w-8" />
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('landing.about.values.innovation.title')}</h3>
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {t('landing.about.values.innovation.description')}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-4 ${isDarkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'}`}>
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

            {/* Team Section */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl font-extrabold sm:text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('landing.about.impact.title')}
                    </h2>
                    <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('landing.about.impact.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <div className={`rounded-lg shadow-md p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t('landing.about.impact.farmers')}</div>
                    </div>
                    <div className={`rounded-lg shadow-md p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t('landing.about.impact.accuracy')}</div>
                    </div>
                    <div className={`rounded-lg shadow-md p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t('landing.about.impact.diseases')}</div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-green-700">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            {t('landing.about.cta.title')}
                        </h2>
                        <p className="mt-4 text-lg text-green-100">
                            {t('landing.about.cta.description')}
                        </p>
                        <div className="mt-8">
                            <Link
                                to="/auth"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-colors duration-200"
                            >
                                {t('landing.about.cta.button')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
<p className="text-center text-sm sm:text-base text-gray-400 py-4 sm:py-6">
{t('landing.about.footer')}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default About;
