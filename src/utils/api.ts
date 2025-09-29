import { mockAppointments, doctors } from '../assets/assets';

// Simulate a network delay for a better real-world feel
const API_DELAY = 500; // 0.5 second delay

/**
 * Simulates fetching all appointments from a server.
 * @returns {Promise<Array>} A promise that resolves with all mock appointments.
 */
export const fetchAppointments = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("API: Successfully retrieved all mock appointments.");
            resolve(mockAppointments);
        }, API_DELAY);
    });
};

/**
 * Simulates a doctor login request.
 * @param {string} email - The doctor's email.
 * @param {string} password - The doctor's password.
 * @returns {Promise<object>} A promise that resolves with { success: true, token: '...' } or throws an error.
 */
export const loginDoctor = (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Data is retrieved from the 'doctors' array imported from assets.js
            const doc = doctors.find(d => d.email === email && d.password === password);
            
            if (doc) {
                console.log(`API: Login successful for Doctor ID: ${doc._id}`);
                // Return the docId as the "token"
                resolve({ 
                    success: true, 
                    token: doc._id,
                    message: `Welcome, ${doc.name}!`
                });
            } else {
                console.error("API: Login failed. Invalid credentials.");
                reject(new Error("Invalid email or password."));
            }
        }, API_DELAY);
    });
};

/**
 * Simulates a doctor logout.
 * @returns {Promise<object>} A promise that resolves instantly.
 */
export const logoutDoctor = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("API: Logout simulated.");
            resolve({ success: true });
        }, 100);
    });
};
