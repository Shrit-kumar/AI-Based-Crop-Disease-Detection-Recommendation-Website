import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, CheckCircle, AlertTriangle, X, ShieldCheck, Leaf, Camera, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';
import { identifyPlant } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DiseaseDetection = () => {
    // Existing states - preserve for upload flow
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // Camera states
    const [showCamera, setShowCamera] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [videoReady, setVideoReady] = useState(false);
    const [facingMode, setFacingMode] = useState('environment'); // Bonus: rear cam default

    // Refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const { isDarkMode } = useTheme();
    const { t, language } = useTranslation();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Existing upload handlers - UNCHANGED
    const handleFileChange = useCallback((e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validation
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Please select JPG or PNG image only');
                return;
            }
            if (selectedFile.size > maxSize) {
                setError('File size must be less than 5MB');
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError('');
            setShowCamera(false); // Close camera if open
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile && handleFileChange({ target: { files: [selectedFile] }}) === undefined) {
            setResult(null);
            setError('');
            setShowCamera(false);
        }
    }, [handleFileChange]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    // NEW: Camera functions
    const startCamera = useCallback(async () => {
        try {
            setError('');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for video ready
                videoRef.current.onloadedmetadata = () => setVideoReady(true);
            }
        } catch (err) {
            console.error('Camera error:', err);
            setError('Camera access denied. Please check permissions and try again.');
        }
    }, [facingMode]);

    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setVideoReady(false);
        setShowCamera(false);
    }, [cameraStream]);

    const captureImage = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.videoWidth === 0) {
            setError('Video not ready for capture');
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) {
                const capturedFile = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
                setFile(capturedFile);
                setPreview(URL.createObjectURL(capturedFile));
                setResult(null);
                setError('');
                stopCamera(); // Auto close camera after capture
            }
        }, 'image/jpeg', 0.9);
    }, [stopCamera]);

    // Toggle camera facing mode (bonus)
    const toggleCamera = useCallback(() => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
        setVideoReady(false);
        // Restart camera with new facing mode
        if (cameraStream) stopCamera();
        startCamera();
    }, [facingMode, cameraStream, stopCamera, startCamera]);

    // Cleanup camera stream
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    // Existing detect - UNCHANGED
    const handleDetect = async () => {
        if (!file) return;
        if (!currentUser) {
            navigate('/auth?mode=login');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
        const response = await identifyPlant(formData, language);
            const data = response.data;
            if (data.error) {
                setError(data.message || 'Failed to analyze image');
            } else {
                setResult({
                    plant_name: data.plant_name,
                    disease: data.disease,
                    confidence: data.confidence,
                    description: data.description,
                    uses: data.uses,
                    symptoms: data.symptoms,
                    cure: data.cure,
                    search_results: data.search_results
                });
            }
        } catch (err) {
            setError('API communication error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-green-50 to-emerald-100'}`}>
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-24">
                <div className="text-center mb-10">
                    <h1 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('diseaseDetection.title')}</h1>
                    <p className={`mt-3 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('diseaseDetection.subtitle')}</p>
                </div>

                {/* Upload/Camera Section */}
                <div className={`backdrop-blur-md rounded-2xl shadow-xl p-8 border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/50'}`}>
                    
                    {/* Preview (final image from upload OR camera) */}
                    {preview && (
                        <div className="relative group mb-6">
                            <img src={preview} alt="Preview" className="w-full max-h-96 rounded-xl shadow-lg object-cover mx-auto block" />
                            <button
                                onClick={() => { 
                                    setFile(null); 
                                    setPreview(null); 
                                    setResult(null); 
                                    setError(''); 
                                }}
                                className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {/* Upload OR Camera UI */}
                    {!preview && (
                        <>
                            {/* Toggle Buttons */}
                            <div className="flex justify-center gap-2 mb-8 p-2 bg-white/20 backdrop-blur rounded-full max-w-max mx-auto">
                                <button
                                    onClick={() => {
                                        setShowCamera(false);
                                    }}
                                    className={`p-3 rounded-full transition-all duration-300 flex items-center gap-2 font-medium ${
                                        !showCamera 
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105' 
                                            : isDarkMode 
                                                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                                    }`}
                                >
                                    <Upload className="h-5 w-5" />
<span className="hidden sm:inline">{t('buttons.upload')}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCamera(true);
                                        startCamera();
                                    }}
                                    className={`p-3 rounded-full transition-all duration-300 flex items-center gap-2 font-medium ${
                                        showCamera 
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105' 
                                            : isDarkMode 
                                                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                                    }`}
                                >
                                    <Camera className="h-5 w-5" />
<span className="hidden sm:inline">{t('buttons.camera')}</span>
                                </button>
                            </div>

                            {/* UPLOAD UI (existing + validation) */}
                            {!showCamera ? (
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer group transition-all duration-300 hover:scale-[1.02] ${
                                        isDarkMode
                                            ? 'border-green-600/50 hover:border-green-400 hover:bg-green-900/20'
                                            : 'border-green-300 hover:border-green-500 hover:bg-green-50/50'
                                    }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 p-6 group-hover:scale-110 transition-all duration-300 ${
                                        isDarkMode ? 'bg-green-900/70 text-green-300' : 'bg-green-100 text-green-600'
                                    }`}>
                                        <Upload className="h-12 w-12" />
                                    </div>
                                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {t('upload.title')}
                                    </p>
                                    <p className={`mt-2 text-lg opacity-75 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {t('upload.subtitle')}
                                    </p>
                                    <input
                                        id="file-upload"
                                        ref={(el) => el?.focus()}
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            ) : (
                                /* CAMERA UI - New & Production Ready */
                                <div className="space-y-6">
                                    {/* Live Video Preview */}
                                    <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl p-4">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted
                                            playsInline
                                            className="w-full max-h-96 rounded-xl object-cover block mx-auto"
                                        />
                                        <canvas ref={canvasRef} className="hidden" />
                                        
                                        {/* Camera Flip Toggle - BONUS */}
                                        {videoReady && (
                                            <button
                                                onClick={toggleCamera}
                                                className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
                                                title="Toggle Front/Rear Camera"
                                            >
                                                <Camera className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Camera Controls */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center p-6 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <button
                                            onClick={captureImage}
                                            disabled={!videoReady}
                                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 mx-auto sm:mx-0 ${
                                                videoReady
                                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25'
                                                    : 'bg-gray-400 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            <Camera className="h-6 w-6" />
{videoReady ? t('buttons.capture') : t('buttons.capture')}
                                        </button>

                                        <button
                                            onClick={stopCamera}
                                            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 mx-auto sm:mx-0 bg-white/70 hover:bg-white hover:shadow-xl hover:scale-105 hover:shadow-gray-400/25 backdrop-blur-sm border border-gray-200"
                                        >
                                            <X className="h-6 w-6" />
                                            {t('buttons.closeCamera')}
                                        </button>
                                    </div>

                                    {facingMode === 'environment' && (
                                        <div className="text-center text-sm opacity-75">
                                            🔄 Rear camera active (best for plants)
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="mt-6 p-6 bg-red-500/10 border-2 border-red-500/30 text-red-800 rounded-2xl flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                            <span>{error}</span>
                            <button
                                onClick={() => setError('')}
                                className="ml-auto text-red-600 hover:text-red-800 font-medium"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* Detect Button */}
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleDetect}
                            disabled={!file || loading}
                            className={`px-12 py-5 rounded-3xl text-white font-bold text-xl shadow-2xl transform transition-all duration-300 ${
                                !file || loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:to-teal-700 hover:scale-[1.05] hover:shadow-2xl hover:shadow-green-500/50'
                            }`}
                        >
                            {loading ? t('detect.loading') : t('detect.button')}
                        </button>
                    </div>
                </div>

                {/* Results Section - UNCHANGED */}
                {result && (
                    <div className={`mt-12 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-gray-800/95 border-gray-600' : 'bg-white/95 border-emerald-200/50'}`}>
                        <div className={`p-8 border-b ${isDarkMode ? 'bg-emerald-900/40 border-emerald-700/50' : 'bg-emerald-50 border-emerald-200'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl shadow-lg ${isDarkMode ? 'bg-emerald-900/80' : 'bg-emerald-100/80'}`}>
                                    <CheckCircle className={`h-10 w-10 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-black ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                                        {result.plant_name}
                                    </h2>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className={`px-10 py-1  font-bold text-sm ${result.disease === 'None' || !result.disease ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                            Disease: {result.disease || 'None'}
                                        </span>
                                        <span className="text-lg font-semibold opacity-90">
                                            Confidence: {result.confidence}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className={`text-xl font-bold flex items-center gap-3 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <div className={`p-3 rounded-xl shadow-md ${isDarkMode ? 'bg-blue-900/70' : 'bg-blue-100'}`}>
                                            <ShieldCheck className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                        </div>
                                        Description
                                    </h3>
                                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {result.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className={`text-xl font-bold flex items-center gap-3 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <div className={`p-3 rounded-xl shadow-md ${isDarkMode ? 'bg-purple-900/70' : 'bg-purple-100'}`}>
                                            <Leaf className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                        </div>
                                        Common Uses
                                    </h3>
                                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {result.uses}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className={`text-xl font-bold flex items-center gap-3 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <div className={`p-3 rounded-xl shadow-md ${isDarkMode ? 'bg-orange-900/70' : 'bg-orange-100'}`}>
                                            <AlertTriangle className={`h-6 w-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                                        </div>
                                        Symptoms
                                    </h3>
                                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {result.symptoms}
                                    </p>
                                </div>

                                <div>
                                    <h3 className={`text-xl font-bold flex items-center gap-3 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <div className={`p-3 rounded-xl shadow-md ${isDarkMode ? 'bg-emerald-900/70' : 'bg-emerald-100'}`}>
                                            <CheckCircle className={`h-6 w-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                        </div>
                                        Cure & Prevention
                                    </h3>
                                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {result.cure}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DiseaseDetection;
