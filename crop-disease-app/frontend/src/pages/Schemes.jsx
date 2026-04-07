import React, { useState } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';

const Schemes = () => {
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
const [filter, setFilter] = useState('allCrops');

    const schemes = [
        {
            id: 1,
            title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
            description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss/damage arising out of unforeseen events.',
            eligibility: 'All farmers growing notified crops in notified areas.',
            region: 'National',
            crop: 'All',
            link: 'https://pmfby.gov.in/'
        },
        {
            id: 2,
            title: 'Soil Health Card Scheme',
            description: 'Government provides soil health cards to farmers which will carry crop-wise recommendations of nutrients and fertilizers.',
            eligibility: 'All farmers.',
            region: 'National',
            crop: 'All',
            link: 'https://soilhealth.dac.gov.in/home'
        },
        {
            id: 3,
            title: 'National Horticulture Mission',
            description: 'Promotes holistic growth of the horticulture sector through area based regionally differentiated strategies.',
            eligibility: 'Farmers with land ownership.',
            region: 'National',
crop: 'horticulture',
            link: 'https://nhb.gov.in/'
        },
        {
            id: 4,
            title: 'Paramparagat Krishi Vikas Yojana',
            description: 'Promotes organic farming through adoption of organic village by cluster approach and PGS certification.',
            eligibility: 'Cluster of farmers.',
            region: 'National',
crop: 'organic',
            link: 'https://www.myscheme.gov.in/schemes/pkvy'
        }
    ];

    const filteredSchemes = schemes.filter(scheme => {
const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'allCrops' || scheme.crop === filter;
    return matchesSearch && matchesFilter;
    });

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-green-50 to-emerald-100'}`}>
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-24">
                <div className="mb-10">
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('schemes.title')}</h1>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('schemes.subtitle')}</p>
                </div>

                {/* Search and Filter */}
                <div className={`backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8 flex flex-col sm:flex-row gap-4 border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/50'}`}>
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className={`focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm rounded-xl py-3 border shadow-sm transition-all focus:shadow-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                            placeholder="Search schemes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="sm:w-56">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                className={`focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm rounded-xl py-3 border shadow-sm cursor-pointer transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
<option value="allCrops">{t('categories.allCrops')}</option>
<option value="horticulture">{t('categories.horticulture')}</option>
<option value="organic">{t('categories.organic')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Schemes List */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {filteredSchemes.map((scheme) => (
                        <div key={scheme.id} className={`backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 border hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-white/50'}`}>
                            <div className="px-6 py-8">
                                <div className="flex items-start justify-between">
                                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{scheme.title}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                                        {scheme.region}
                                    </span>
                                </div>
                                <div className={`mt-4 text-base leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <p>{scheme.description}</p>
                                </div>
                                <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                    <div className={`flex items-center text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <span className={`font-semibold mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Eligibility: </span>
                                        {scheme.eligibility}
                                    </div>
                                    <a
                                        href={scheme.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Learn More
                                        <ExternalLink className="ml-2 -mr-1 h-4 w-4" />
                                    </a>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Schemes;
