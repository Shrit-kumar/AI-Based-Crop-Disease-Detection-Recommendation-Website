import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    function googleSignIn() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check server instance to ensure session validity
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const response = await fetch(`${apiUrl}/`);
                    if (response.ok) {
                        const data = await response.json();
                        const serverStartupId = data.startup_id;
                        const clientStartupId = sessionStorage.getItem('server_startup_id');

                        if (clientStartupId && clientStartupId !== serverStartupId) {
                            console.log("Server restarted, clearing session...");
                            await signOut(auth);
                            sessionStorage.setItem('server_startup_id', serverStartupId);
                            setCurrentUser(null);
                            setLoading(false);
                            return;
                        }

                        // If no client ID yet, or it matches, update/set it
                        sessionStorage.setItem('server_startup_id', serverStartupId);
                    }
                } catch (e) {
                    console.error("Failed to verify server session:", e);
                }
            }
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        googleSignIn
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
