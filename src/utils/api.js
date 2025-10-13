import { mockAppointments, doctors,patients } from '../assets/assets';

// Simulate a network delay for a better real-world feel
const API_DELAY = 500; // 0.5 second delay

/**
 * Simulates fetching all appointments from a server.
 * @returns {Promise<Array>} A promise that resolves with all mock appointments.
 */

/**
 * Simulates fetching appointments for a specific patient.
 * @param {string} patId - The ID of the currently logged-in patient.
 * @returns {Promise<Array>} A promise that resolves with the patient's filtered appointments.
 */
export const fetchAppointments = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("API: Successfully retrieved all mock appointments.");
            resolve(mockAppointments);
        }, API_DELAY);
    });
};

export const fetchPatientAppointments = (patId) => {
    return new Promise((resolve, reject) => {
        if (!patId) {
            return reject(new Error("Patient ID is required to fetch appointments."));
        }

        setTimeout(() => {
            const patientAppointments = mockAppointments.filter(
                (appointment) => appointment.patId === patId
            );
            resolve(patientAppointments);
        }, API_DELAY);
    });
};

/**
 * Simulates canceling an appointment.
 * In a real app, this would update the database.
 * @param {string} apptId - The ID of the appointment to cancel.
 * @returns {Promise<string>} A promise that resolves with a success message.
 */
export const cancelAppointment = (apptId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // NOTE: Using a shared mockAppointments array here for simplicity
            const appointment = mockAppointments.find(a => a._id === apptId);
            
            if (!appointment) {
                return reject(new Error(`Appointment ID ${apptId} not found.`));
            }
            
            // Mock: Set a cancelled status
            appointment.status = 'Cancelled';
            appointment.isCompleted = true; // Mark as done/cancelled so it doesn't show up as active
            
            resolve(`Appointment ${apptId} has been successfully cancelled.`);
        }, API_DELAY);
    });
};

/**
 * Simulates the reschedule process. 
 * NOTE: For simplicity, this mock only marks it as pending reschedule.
 * @param {string} apptId - The ID of the appointment to reschedule.
 * @returns {Promise<string>} A promise that resolves with a message about rescheduling.
 */
export const rescheduleAppointment = (apptId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const appointment = mockAppointments.find(a => a._id === apptId);
            
            if (!appointment) {
                return reject(new Error(`Appointment ID ${apptId} not found.`));
            }
            
            // Mock: Mark status for reschedule (real logic would involve selecting a new slot)
            appointment.status = 'Pending Reschedule';
            
            resolve(`Reschedule process initiated for appointment ${apptId}. You can now select a new slot.`);
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

        console.log("DEBUG 1: loginDoctor function started."); 
        console.log(`DEBUG 1.1: Attempting login for email: ${email}`);

        setTimeout(() => {
            console.log("DEBUG 2: setTimeout finished. Starting doctor lookup.");
            // Data is retrieved from the 'doctors' array imported from assets.js
            
            const doc = doctors.find(d => d.email === email && d.password === password);
            
            if (doc) {
                console.log("DEBUG 3: Doctor FOUND. Proceeding to resolve."); 
                console.log(`API: Login successful for Doctor ID: ${doc._id}`); 
                // Return the docId as the "token"
                resolve({ 
                    success: true, 
                    token: doc._id,
                    message: `Welcome, ${doc.name}!`
                });
            } else {
                console.error("DEBUG 4: Doctor NOT FOUND. Invalid credentials."); 
                console.error("API: Login failed. Invalid credentials.");
                
                // IMPORTANT: Ensure this reject path is hit if the find fails
                reject(new Error("Invalid email or password.")); 
            }
        }, API_DELAY);
    });
};

/**
 * Simulates a doctor logout.
 * @returns {Promise<object>} A promise that resolves instantly.
 */


/**
 * Simulates a patient login request.
 * @param {string} email - The patient's email.
 * @param {string} password - The patient's password.
 * @returns {Promise<object>} A promise that resolves with { success: true, token: '...' } or throws an error.
 */
export const loginPatient = (email, password) => {
    return new Promise((resolve, reject) => {

        console.log("DEBUG P1: loginPatient function started."); 
        console.log(`DEBUG P1.1: Attempting patient login for email: ${email}`);

        setTimeout(() => {
            console.log("DEBUG P2: setTimeout finished. Starting patient lookup.");
            
            // Look up the patient in the 'patients' array
            const patient = patients.find(p => p.email === email && p.password === password);
            
            if (patient) {
                console.log("DEBUG P3: Patient FOUND. Proceeding to resolve."); 
                console.log(`API: Login successful for Patient ID: ${patient._id}`); 
                // Return the patient ID as the "token"
                resolve({ 
                    success: true, 
                    token: patient._id,
                    message: `Welcome back, ${patient.name}!`
                });
            } else {
                console.error("DEBUG P4: Patient NOT FOUND. Invalid credentials."); 
                console.error("API: Login failed. Invalid credentials.");
                
                reject(new Error("Invalid patient email or password.")); 
            }
        }, API_DELAY);
    });
};

export const logoutDoctor = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("API: Logout simulated.");
            resolve({ success: true });
        }, 100);
    });
};

/**
 * Simulates fetching the Doctor Dashboard data.
 * This function calculates metrics by joining data from different mock arrays.
 * @param {string} docId - The ID of the currently logged-in doctor.
 * @returns {Promise<object>} A promise that resolves with structured dashboard data.
 */

export const fetchDoctorDashboardData = (docId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Find all appointments for the specified doctor
            const doctorAppointments = mockAppointments.filter(
                (appointment) => appointment.docId === docId
            );

            // 1. Calculate Earnings (sum of fees for completed appointments for this doctor)
            let earnings = 0;
            doctorAppointments.forEach((item) => {
                if (item.isCompleted && item.payment) {
                    // Assuming 'amount' is the fee paid for the appointment
                    earnings += item.amount;
                }
            });

            // 2. Get unique patient IDs for this doctor
            const uniquePatientIds = new Set(doctorAppointments.map(app => app.patId));

            // 3. Get the doctor's name for the latest appointments list
            const currentDoctor = doctors.find(d => d._id === docId);

            // 4. Get the latest appointments (top 5, most recent first)
            const latestAppointments = doctorAppointments
                .slice() 
                .sort((a, b) => b.date - a.date) // Sort by date descending (most recent first)
                .slice(0, 5) // Take the top 5
                .map((app) => {
                    // Find the patient's name and image from the patients array
                    const patient = patients.find(p => p._id === app.patId);
                    return {
                        id: app._id,
                        doctorName: currentDoctor?.name || 'Unknown Doctor',
                        patientName: patient?.name || 'Unknown Patient',
                        bookingDetails: `Booking on ${app.slotDate} at ${app.slotTime}`, // Using slot details
                        avatarUrl: patient?.image || '/assets/profile_pic.png'
                    };
                });

            const dashData = {
                metrics: {
                    doctors: doctors.length, 
                    appointments: doctorAppointments.length, 
                    patients: uniquePatientIds.size, 
                    earnings: earnings,
                },
                latestAppointments: latestAppointments
            };
            console.log(`API: Dashboard data calculated for Doctor ID: ${docId}. Appointments found: ${doctorAppointments.length}`); // <--- ADD THIS LINE
            resolve({ success: true, dashData });

        }, API_DELAY);
    });
};
