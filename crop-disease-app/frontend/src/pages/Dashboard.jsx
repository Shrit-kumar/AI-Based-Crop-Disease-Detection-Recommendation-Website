import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scan, FileText, Landmark, CloudSun, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle, MapPin, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { getDetectionHistory, getWeather } from '../services/api';

const Dashboard = () => {
    const { isDarkMode } = useTheme();
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            if (currentUser) {
                try {
                    const response = await getDetectionHistory();
                    setHistory(Array.isArray(response.data) ? response.data : []);
                } catch (error) {
                    console.error("Failed to fetch history:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [currentUser]);

    const fetchWeather = async (forceRefresh = false) => {
        setWeatherLoading(true);
        setLocationError('');

        if (forceRefresh) {
            setWeather(null);
        }

        if (!forceRefresh) {
            const cachedWeather = localStorage.getItem('weatherData');
            const cachedTimestamp = localStorage.getItem('weatherTimestamp');

            if (cachedWeather && cachedTimestamp) {
                const now = Date.now();
                const oneHour = 60 * 60 * 1000;

                if (now - parseInt(cachedTimestamp) < oneHour) {
                    setWeather({ ...JSON.parse(cachedWeather) });
                    setWeatherLoading(false);
                    return;
                }
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const response = await getWeather(latitude, longitude);
                        const weatherData = response.data;

                        localStorage.setItem('weatherData', JSON.stringify(weatherData));
                        localStorage.setItem('weatherTimestamp', Date.now().toString());

                        setWeather({ ...weatherData });
                    } catch (error) {
                        console.error("Failed to fetch weather:", error);
                        setLocationError('Failed to fetch weather data');
                    } finally {
                        setWeatherLoading(false);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLocationError('Location access denied. Please enable location to see weather.');
                    setWeatherLoading(false);
                }
            );
        } else {
            setLocationError('Geolocation is not supported by your browser');
            setWeatherLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-24">
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.title')}</h1>
                    <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('dashboard.welcome')}{currentUser?.displayName ? `, ${currentUser.displayName}` : currentUser?.email ? `, ${currentUser.email}` : ''}! {t('dashboard.overview')}
                    </p>
                </div>

                {weatherLoading ? (
                    <div className={`bg-gradient-to-r ${isDarkMode ? 'from-blue-900 to-blue-800' : 'from-blue-500 to-blue-600'} rounded-2xl shadow-lg overflow-hidden mb-8 text-white p-10`}>
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            <span className="ml-3">{t('dashboard.loadingWeather')}</span>
                        </div>
                    </div>
                ) : locationError ? (
                    <div className={`rounded-2xl shadow-lg overflow-hidden mb-8 p-6 ${isDarkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                        <div className="flex items-center">
                            <AlertTriangle className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                            <p className={`ml-3 text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>{locationError || t('dashboard.fetchError')}</p>
                        </div>
                    </div>
                ) : weather && (
                    <div className={`bg-gradient-to-r ${isDarkMode ? 'from-blue-900 to-blue-800' : 'from-blue-500 to-blue-600'} rounded-2xl shadow-lg overflow-hidden mb-8 text-white transition-all duration-300`}>
                        <div className="p-6 sm:p-10">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className={`text-lg font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>{t('dashboard.currentWeather')}</h2>
                                        <button
                                            onClick={() => fetchWeather(true)}
                                            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-400/30 hover:bg-blue-400/50'}`}
                                            title="Refresh weather"
                                        >
                                            <RefreshCw className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex items-baseline">
                                        <span className="text-5xl font-extrabold tracking-tight">{weather.temperature}°C</span>
                                        <span className={`ml-2 text-xl font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>{weather.description}</span>
                                    </div>
                                    <p className={`mt-1 text-sm flex items-center ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {weather.location}
                                    </p>
                                </div>
                                <div className="mt-6 sm:mt-0">
                                    <CloudSun className={`h-20 w-20 ${isDarkMode ? 'text-blue-300' : 'text-blue-200'} opacity-80`} />
                                </div>
                            </div>

                            <div className={`mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t ${isDarkMode ? 'border-blue-700' : 'border-blue-400'}`}>
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-700' : 'bg-blue-400 bg-opacity-30'}`}>
                                        <Wind className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>{t('dashboard.windSpeed')}</p>
                                        <p className="text-lg font-bold">{weather.wind_speed} km/h</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-700' : 'bg-blue-400 bg-opacity-30'}`}>
                                        <Droplets className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>{t('dashboard.humidity')}</p>
                                        <p className="text-lg font-bold">{weather.humidity}%</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-700' : 'bg-blue-400 bg-opacity-30'}`}>
                                        <Thermometer className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>{t('dashboard.feelsLike')}</p>
                                        <p className="text-lg font-bold">{weather.feels_like}°C</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.quickActions')}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Link to="/detect" className={`group relative rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border ${isDarkMode ? 'bg-gray-900 border-gray-700 hover:border-green-600' : 'bg-white border-gray-100 hover:border-green-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.diseaseDetection')}</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('dashboard.scanCrops')}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                <Scan className="h-6 w-6" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/reports" className={`group relative rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border ${isDarkMode ? 'bg-gray-900 border-gray-700 hover:border-blue-600' : 'bg-white border-gray-100 hover:border-blue-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.detectionHistory')}</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('dashboard.viewPast')}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                <FileText className="h-6 w-6" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/schemes" className={`group relative rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border ${isDarkMode ? 'bg-gray-900 border-gray-700 hover:border-purple-600' : 'bg-white border-gray-100 hover:border-purple-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.governmentSchemes')}</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('dashboard.exploreSchemes')}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                <Landmark className="h-6 w-6" />
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.recentDetections')}</h2>
                        <Link to="/reports" className={`text-sm font-medium ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}>
                            {t('dashboard.viewAll')}
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className={`text-center py-12 rounded-xl border border-dashed ${isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-300 bg-white/50'}`}>
                            <Scan className={isDarkMode ? 'mx-auto h-12 w-12 text-gray-600' : 'mx-auto h-12 w-12 text-gray-400'} />
                            <h3 className={isDarkMode ? 'mt-2 text-sm font-medium text-white' : 'mt-2 text-sm font-medium text-gray-900'}>{t('dashboard.noDetections')}</h3>
                            <p className={isDarkMode ? 'mt-1 text-sm text-gray-400' : 'mt-1 text-sm text-gray-500'}>{t('dashboard.analyzeFirst')}</p>
                            <Link to="/detect" className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                {t('dashboard.startDetection')}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {history.slice(0, 3).map((item) => (
                                <div key={item.id} className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.plant_name}</h4>
                                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Confidence: {item.confidence}
                                            </p>
                                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                {new Date(item.detected_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

