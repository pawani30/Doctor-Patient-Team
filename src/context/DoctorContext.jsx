
import React, { createContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import { fetchAppointments, loginDoctor, logoutDoctor , fetchDoctorDashboardData } from '../utils/api';
=======
import {fetchAppointments,loginDoctor, logoutDoctor,fetchDoctorDashboardData } from '../utils/api';
import { mockAppointments,doctors } from './../assets/assets';
>>>>>>> upstream/master

export const DoctorContext = createContext(null);

export const DoctorProvider = ({ children }) => {
    // doctorToken will hold the docId after successful login, starting as null
    const [doctorToken, setDToken] = useState(localStorage.getItem("doctorToken")); 
<<<<<<< HEAD
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
 const [dashboardData, setDashboardData] = useState(null); 
    
    // Initial Data Fetching and Auto-Login Simulation
    useEffect(() => {
        const loadInitialData = async () => {
       const currentToken = doctorToken; 
=======
    const [currentDoctor, setCurrentDoctor] = useState(null); 
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null); 
    

     const findDoctorProfile = (docId) => {
        return doctors.find(doc => doc._id === docId);
    };

    // Initial check (once on mount) to see if a token exists in localStorage
    useEffect(() => {
        const token = localStorage.getItem('doctorToken');
        if (token) {
            setDToken(token);
            const profile = findDoctorProfile(token);
            setCurrentDoctor(profile);
        } else {
            // If no token, we are done loading the initial authentication check
            setIsLoading(false);
        }
    }, []); // Runs ONLY once on mount

    // 🚨 NEW useEffect: Manages the full doctor profile object
    // Runs when doctorToken changes (e.g., after login/logout)
    useEffect(() => {
        if (doctorToken) {
            const profile = findDoctorProfile(doctorToken);
            setCurrentDoctor(profile);
        } else {
            setCurrentDoctor(null); // Clear profile on logout
        }
    }, [doctorToken]);

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
>>>>>>> upstream/master
            try {
                const currentDoctorId = doctorToken; 
                // 2. Filter the local data based on the logged-in doctor's ID/Token
                const fetchedAppointments = mockAppointments.filter(
                    (appointment) => appointment.docId === currentDoctorId 
                    // 👆 Adjust 'doctorId' to match the key in your data structure
                );

                setAppointments(fetchedAppointments);

<<<<<<< HEAD
                // Simulate auto-login for development using mock credentials
                // const loginResult = await loginDoctor(MOCK_EMAIL, MOCK_PASSWORD);
                // setDToken(loginResult.token);

                if (currentToken) {
                    await loadDashboardData(currentToken);
=======
                if (currentDoctorId) {
                    await loadDashboardData(currentDoctorId);
>>>>>>> upstream/master
                } else {
                    console.log("No doctor token found. Waiting for login.");
                }
            } catch (err) {
                // This catch block will likely not be hit, as there's no network error
                console.error("Error filtering appointments:", err);
                setError(err.message || "Failed to load appointments.");
                setDToken(null); 
            } finally {
                setIsLoading(false);
            }
        };

<<<<<<< HEAD
        loadInitialData();
    }, [doctorToken]);
=======
        loadAppointments();
    }, [doctorToken]); // Runs only when doctorToken changes
>>>>>>> upstream/master

    // Login Function
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await loginDoctor(email, password);
<<<<<<< HEAD
            const docId = result.token;
             // Save the token to local storage for persistence
        localStorage.setItem("docToken", docId); 
        setDToken(docId); // Set state to trigger the useEffect for data load
    await loadDashboardData(docId);
=======
            const tokenValue = result.token;

            console.log("Login Success Message:", result.message);
            localStorage.removeItem('patientToken');
           localStorage.setItem('doctorToken', tokenValue); // Store the actual ID ('doc1', 'doc2', etc.)
            setDToken(tokenValue);
            
            const profile = findDoctorProfile(tokenValue);
            setCurrentDoctor(profile); 


                await loadDashboardData(tokenValue);
>>>>>>> upstream/master
            return result;
        } catch (err) {
            setError(err.message);
            setCurrentDoctor(null);
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
<<<<<<< HEAD
            localStorage.removeItem("docToken"); 
            setDToken(null);
            setDashboardData(null); 
=======
            localStorage.removeItem('doctorToken');
            setDToken(null);
            setCurrentDoctor(null);
            setDashboardData(null); 
            
>>>>>>> upstream/master
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
    const getDashData = async () =>{
        if(doctorToken) {
            await loadDashboardData(doctorToken);
        } else {
            console.warn("Cannot call getDashData: Doctor token is not available.");
        }
    }


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
        currentDoctor, 
        appointments, 
        setAppointments,
        isLoading,
        error,
        handleLogin,
        handleLogout,
<<<<<<< HEAD
        dashboardData, 
=======
         dashboardData, 
>>>>>>> upstream/master
        getDashData ,
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