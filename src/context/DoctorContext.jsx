
import React, { createContext, useState, useEffect } from 'react';
import { fetchAppointments, loginDoctor, logoutDoctor } from '../utils/api';

export const DoctorContext = createContext(null);

export const DoctorProvider = ({ children }) => {
    // doctorToken will hold the docId after successful login, starting as null
    const [doctorToken, setDToken] = useState(null); 
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Credentials used to simulate successful auto-login for quick testing
    const MOCK_EMAIL = 'doctor2@example.com';
    const MOCK_PASSWORD = 'pass2';

    // Initial Data Fetching and Auto-Login Simulation
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch appointments
                const fetchedAppointments = await fetchAppointments();
                setAppointments(fetchedAppointments);

                // Simulate auto-login for development using mock credentials
                const loginResult = await loginDoctor(MOCK_EMAIL, MOCK_PASSWORD);
                setDToken(loginResult.token);

            } catch (err) {
                console.error("Error during initial data load or auto-login:", err);
                setError(err.message || "Failed to load initial data.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Login Function
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await loginDoctor(email, password);
            setDToken(result.token);
            return result;
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout Function
    const handleLogout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await logoutDoctor();
            setDToken(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        doctorToken,
        setDToken,
        appointments, 
        setAppointments,
        isLoading,
        error,
        handleLogin,
        handleLogout,
        MOCK_EMAIL,
        MOCK_PASSWORD 
    };

    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    );
};