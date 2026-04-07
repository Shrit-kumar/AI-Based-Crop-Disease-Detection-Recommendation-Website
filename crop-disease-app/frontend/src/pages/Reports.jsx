import React, { useEffect, useState } from 'react';
import { Eye, Calendar, Trash2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getDetectionHistory, deleteDetection } from '../services/api';

const Reports = () => {
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDetection, setSelectedDetection] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (currentUser) {
                try {
                    const response = await getDetectionHistory();
                    setHistory(Array.isArray(response.data) ? response.data : []);
                } catch (err) {
                    setError('Failed to load detection history');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this detection?')) {
            try {
                await deleteDetection(id);
                setHistory(history.filter(item => item.id !== id));
            } catch (err) {
                alert('Failed to delete detection');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-green-50 to-emerald-100'}`}>
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-24">
                <div className="mb-10">
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('reports.title')}</h1>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('reports.subtitle')}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                {history.length === 0 ? (
                    <div className={`text-center py-16 rounded-xl border border-dashed ${isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-300 bg-white/50'}`}>
                        <Eye className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <h3 className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('reports.noDetections')}</h3>
<p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('reports.startAnalysis')}</p>
                    </div>
                ) : (
                    <div className={`backdrop-blur-md shadow-xl overflow-hidden sm:rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/50'}`}>
                        <ul className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200/60'}`}>
                            {history.map((item) => (
                                <li key={item.id}>
                                    <div className={`block transition-all duration-150 ease-in-out ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-white/50'}`}>
                                        <div className="flex items-center px-6 py-5">
                                            <div className="min-w-0 flex-1 flex items-center">
                                                <div className="min-w-0 flex-1 px-6 md:grid md:grid-cols-2 md:gap-4">
                                                    <div>
                                                        <p className={`text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.plant_name}</p>
                                                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Confidence: <span className="font-bold text-green-600">{item.confidence}</span>
                                                        </p>
                                                    </div>
                                                    <div className="hidden md:block">
                                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                                                            {item.description}
                                                        </p>
                                                        <p className={`mt-1 flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            <Calendar className={`flex-shrink-0 mr-1.5 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                                            {new Date(item.detected_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedDetection(item)}
                                                    className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDarkMode ? 'border-blue-600 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'border-blue-300 bg-white text-blue-600 hover:bg-blue-50'}`}
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isDarkMode ? 'border-red-600 bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'border-red-300 bg-white text-red-600 hover:bg-red-50'}`}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Detection Details Modal */}
                {selectedDetection && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <div className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                            {/* Modal Header */}
                            <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('reports.details')}</h3>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedDetection.id);
                                        setSelectedDetection(null);
                                    }}
                                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 max-h-[80vh] overflow-y-auto">
                                <div className={`p-6 rounded-xl mb-6 ${isDarkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-100'}`}>
                                    <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>{selectedDetection.plant_name}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full font-medium ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                                            Confidence: {selectedDetection.confidence}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full font-medium ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                                            Detected: {new Date(selectedDetection.detected_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {selectedDetection.disease && (
                                        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-800'}`}>
                                            <strong>Detected Disease:</strong> {selectedDetection.disease}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Description</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedDetection.description || 'No description available.'}</p>
                                    </div>
                                    <div>
                                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Common Uses</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedDetection.uses || 'No information available.'}</p>
                                    </div>
                                    <div>
                                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Symptoms</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedDetection.symptoms || 'No symptoms recorded.'}</p>
                                    </div>
                                    <div>
                                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cure & Prevention</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedDetection.cure || 'No cure information recorded.'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className={`px-6 py-4 border-t flex justify-end ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                                <button
                                    onClick={() => setSelectedDetection(null)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Reports;
