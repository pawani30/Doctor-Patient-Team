
import React, { createContext, useState, useEffect } from 'react';
import {loginDoctor, logoutDoctor } from '../utils/api';
import { mockAppointments,doctors } from './../assets/assets';

export const DoctorContext = createContext(null);

export const DoctorProvider = ({ children }) => {
    // doctorToken will hold the docId after successful login, starting as null
    const [doctorToken, setDToken] = useState(null); 
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    

    // Initial check (once on mount) to see if a token exists in localStorage
    useEffect(() => {
        const token = localStorage.getItem('doctorToken');
        if (token) {
            setDToken(token);
        } else {
            // If no token, we are done loading the initial authentication check
            setIsLoading(false);
        }
    }, []); // Runs ONLY once on mount

    // Data Fetching: Runs when the doctorToken state changes (login or logout)
    useEffect(() => {
        // 1. If no token, we are logged out. Clear data and stop.
        if (!doctorToken) {
            setAppointments([]);
            setIsLoading(false);
            return;
        }

        // 2. If token exists, fetch data for the logged-in user.
          const loadAppointments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const currentDoctorId = doctorToken; 

                console.log("DoctorToken being used for filtering:", currentDoctorId);
        
        // --- LOGGING ALL APPOINTMENT DOC IDs ---
        // 🎯 2. LOG ALL DOC IDs IN THE MOCK DATA
        console.log("All Doc IDs in Mock Appointments:", mockAppointments.map(appt => appt.docId));
        // --- END LOGGING ---

                // 2. Filter the local data based on the logged-in doctor's ID/Token
                const fetchedAppointments = mockAppointments.filter(
                    (appointment) => appointment.docId === currentDoctorId 
                    // 👆 Adjust 'doctorId' to match the key in your data structure
                );

                console.log("Number of appointments found after filtering:", fetchedAppointments.length);

                setAppointments(fetchedAppointments);
            } catch (err) {
                // This catch block will likely not be hit, as there's no network error
                console.error("Error filtering appointments:", err);
                setError(err.message || "Failed to load appointments.");
                setDToken(null); 
            } finally {
                setIsLoading(false);
            }
        };

        loadAppointments();
    }, [doctorToken]); // Runs only when doctorToken changes

    // Login Function
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await loginDoctor(email, password);
            const tokenValue = result.token;

            console.log("Login Success Message:", result.message);

           localStorage.setItem('doctorToken', tokenValue); // Store the actual ID ('doc1', 'doc2', etc.)
            setDToken(tokenValue);
            
            return { success: true, token: tokenValue, message: result.message };

        } catch (err) {
            setError(err.message);
            setIsLoading(false); 
            return { success: false, message: err.message };
        }
    };

    // Logout Function
    const handleLogout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await logoutDoctor();
            localStorage.removeItem('doctorToken');
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
    };

     if (isLoading) { 
        return <div className="loading-screen">Loading...</div>; 
    }

    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    );
};