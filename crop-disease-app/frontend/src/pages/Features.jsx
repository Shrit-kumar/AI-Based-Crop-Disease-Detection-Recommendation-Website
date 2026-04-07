import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, Smartphone, Camera, Cloud, Bell, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';

const Features = () => {
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();
    const features = [
        {
            icon: ShieldCheck,
            title: t('landing.features.title'),
            description: t('landing.features.description'),
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: Zap,
            title: t('landing.features.treatment.title'),
            description: t('landing.features.treatment.description'),
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            icon: BarChart3,
            title: t('landing.features.history.title'),
            description: t('landing.features.history.description'),
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: Smartphone,
            title: t('landing.features.schemes.title'),
            description: t('landing.features.schemes.description'),
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: Camera,
            title: t('landing.features.upload.title'),
            description: t('landing.features.upload.description'),
            color: 'bg-red-100 text-red-600'
        },
        {
            icon: Cloud,
            title: t('features.cloud.title'),
            description: t('features.cloud.description'),
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            icon: Bell,
            title: t('features.notifications.title'),
            description: t('features.notifications.description'),
            color: 'bg-pink-100 text-pink-600'
        },
        {
            icon: TrendingUp,
            title: t('features.yield.title'),
            description: t('features.yield.description'),
            color: 'bg-teal-100 text-teal-600'
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                            {t('features.hero.title')}
                        </h1>
                        <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
                            {t('features.hero.description')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {features.map((feature, index) => (
                        <div key={index} className={`rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 ${isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white'}`}>
                            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-md ${feature.color} mb-4`}>
                                <feature.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {feature.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="bg-green-700 rounded-lg shadow-xl overflow-hidden">
                        <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                    {t('features.cta.title')}
                                </h2>
                                <p className="mt-3 max-w-3xl text-lg text-green-100">
                                    {t('features.cta.description')}
                                </p>
                            </div>
                            <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-colors duration-200"
                                >
                                    {t('features.cta.button')}
                                </Link>
                            </div>
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

export default Features;
