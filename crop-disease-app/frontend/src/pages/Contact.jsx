import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';

const Contact = () => {
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold sm:text-5xl">
                            {t('contact.hero.title')}
                        </h1>
                        <p className="mt-4 text-xl text-green-100 max-w-2xl mx-auto">
                            {t('contact.hero.description')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className={`rounded-lg shadow-md p-6 text-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
                            <Phone className="h-6 w-6" />
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('contact.info.phone')}</h3>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>+91 1800-XXX-XXXX</p>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('contact.info.phoneSub')}</p>
                    </div>

                    <div className={`rounded-lg shadow-md p-6 text-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                            <Mail className="h-6 w-6" />
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('contact.info.email')}</h3>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>support@plantguard.com</p>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('contact.info.emailSub')}</p>
                    </div>

                    <div className={`rounded-lg shadow-md p-6 text-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                            <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('contact.info.location')}</h3>
                        <p className="text-gray-600">New Delhi, India</p>
                        <p className="text-sm text-gray-500 mt-1">Headquarters</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                            <Clock className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('contact.info.hours')}</h3>
                        <p className="text-gray-600">Mon - Sat</p>
                        <p className="text-sm text-gray-500 mt-1">9:00 AM - 6:00 PM</p>
                    </div>
                </div>

                {/* Quick Contact Section */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">{t('contact.quickContact.title')}</h2>
                        <p className="mt-2 text-gray-600">{t('contact.quickContact.subtitle')}</p>
                    </div>

                    <form className="max-w-2xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('contact.quickContact.labels.name')}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('contact.quickContact.labels.phone')}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Your phone number"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('contact.quickContact.labels.message')}
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                                {t('contact.quickContact.button')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* CTA to Full Contact Page */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        {t('contact.quickContact.cta.text')}{' '}
                        <Link to="/contactus" className="text-green-600 hover:text-green-700 font-medium">
                            {t('contact.quickContact.cta.link')}
                        </Link>
                    </p>
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

export default Contact;
