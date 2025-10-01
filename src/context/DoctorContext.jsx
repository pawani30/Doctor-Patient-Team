
import React, { createContext, useState, useEffect } from 'react';
import { fetchAppointments, loginDoctor, logoutDoctor , fetchDoctorDashboardData } from '../utils/api';

export const DoctorContext = createContext(null);

export const DoctorProvider = ({ children }) => {
    // doctorToken will hold the docId after successful login, starting as null
    const [doctorToken, setDToken] = useState(localStorage.getItem("doctorToken")); 
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
 const [dashboardData, setDashboardData] = useState(null); 
    
    // Initial Data Fetching and Auto-Login Simulation
    useEffect(() => {
        const loadInitialData = async () => {
       const currentToken = doctorToken; 
            try {
                // Fetch appointments
                const fetchedAppointments = await fetchAppointments();
                setAppointments(fetchedAppointments);

                // Simulate auto-login for development using mock credentials
                // const loginResult = await loginDoctor(MOCK_EMAIL, MOCK_PASSWORD);
                // setDToken(loginResult.token);

                if (currentToken) {
                    await loadDashboardData(currentToken);
                } else {
                    console.log("No doctor token found. Waiting for login.");
                }
            } catch (err) {
                console.error("Error during initial data load or auto-login:", err);
                setError(err.message || "Failed to load initial data.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [doctorToken]);

    // Login Function
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await loginDoctor(email, password);
            const docId = result.token;
             // Save the token to local storage for persistence
        localStorage.setItem("docToken", docId); 
        setDToken(docId); // Set state to trigger the useEffect for data load
    await loadDashboardData(docId);
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
            localStorage.removeItem("docToken"); 
            setDToken(null);
            setDashboardData(null); 
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

 // Helper function to call the dashboard fetcher
    const loadDashboardData = async (docId) => {
        if (!docId) return; 
        try {
            const response = await fetchDoctorDashboardData(docId);
            
            if (response.success) {
                setDashboardData(response.dashData);
                setError(null); // Clear any previous error on success
            } else {
                console.error("Failed to fetch dashboard data:", response.message);
                setDashboardData(null); // 🛑 Clear data on API response failure
            setError(response.message || "Failed to fetch dashboard data.")
            }
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
             setDashboardData(null); // 🛑 Clear data on network/internal failure
        setError(error.message || "Dashboard Fetch Error.");
        }
    };

    // Corrected getDashData function logic (for manual refresh if needed)
    const getDashData = async () =>{
        if(doctorToken) {
            await loadDashboardData(doctorToken);
        } else {
            console.warn("Cannot call getDashData: Doctor token is not available.");
        }
    }


    const value = {
        doctorToken,
        setDToken,
        appointments, 
        setAppointments,
        isLoading,
        error,
        handleLogin,
        handleLogout,
        dashboardData, 
        getDashData ,
    };

    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    );
};