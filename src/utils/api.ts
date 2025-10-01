import { mockAppointments, doctors ,patients} from '../assets/assets';

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
export const loginDoctor = (email: string, password: string): Promise<object> => {
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


/**
 * Simulates fetching the Doctor Dashboard data.
 * This function calculates metrics by joining data from different mock arrays.
 * @param {string} docId - The ID of the currently logged-in doctor.
 * @returns {Promise<object>} A promise that resolves with structured dashboard data.
 */

export const fetchDoctorDashboardData = (docId: string): Promise<object> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Find all appointments for the specified doctor
            const doctorAppointments = mockAppointments.filter(
                (appointment: any) => appointment.docId === docId
            );

            // 1. Calculate Earnings (sum of fees for completed appointments for this doctor)
            let earnings = 0;
            doctorAppointments.forEach((item: any) => {
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
                .map((app: any) => {
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