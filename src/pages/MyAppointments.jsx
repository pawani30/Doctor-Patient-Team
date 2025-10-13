import React, { useContext, useState, useEffect } from 'react'; // <-- ADD useState, useEffect
import { PatientContext } from './../context/PatientContext';
import { doctors, assets } from './../assets/assets';
import { fetchPatientAppointments } from '../utils/api'; // <-- IMPORT the new API function


const MyAppointments = () => {
    const { patientId } = useContext(PatientContext); 
    
    // 1. New State for fetched data and loading status
    const [appointments, setAppointments] = useState([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [actionStatus, setActionStatus] = useState(null);


    const loadAppointments = async () => {
        setIsLoadingAppointments(true);
        setFetchError(null);
        try {
            const fetchedAppointments = await fetchPatientAppointments(patientId);
            setAppointments(fetchedAppointments);
        } catch (error) {
            setFetchError(error.message);
            console.error("Failed to fetch appointments:", error);
        } finally {
            setIsLoadingAppointments(false);
        }
    };

    // 3. ACTION HANDLER: CANCEL APPOINTMENT (Defined in component scope)
    const handleCancel = async (apptId) => {
        setActionStatus({ type: 'loading', message: `Canceling appointment ${apptId}...` });
        try {
            const message = await cancelAppointment(apptId); 
            await loadAppointments(); // RE-FETCH data to update UI
            setActionStatus({ type: 'success', message: message });
            
        } catch (error) {
            setActionStatus({ type: 'error', message: error.message });
        } finally {
            // Clear status message after 4 seconds
            setTimeout(() => setActionStatus(null), 4000);
        }
    };

    // 4. ACTION HANDLER: RESCHEDULE APPOINTMENT (Defined in component scope)
    const handleReschedule = async (apptId) => {
        setActionStatus({ type: 'loading', message: `Initiating reschedule for appointment ${apptId}...` });
        try {
            const message = await rescheduleAppointment(apptId); 
            await loadAppointments(); // RE-FETCH data (or redirect in a real app)
            setActionStatus({ type: 'success', message: message });

        } catch (error) {
            setActionStatus({ type: 'error', message: error.message });
        } finally {
            setTimeout(() => setActionStatus(null), 4000);
        }
    };
    // 2. useEffect to fetch data when patientId changes
 useEffect(() => {
        if (patientId) {
            loadAppointments();
        } else {
            setIsLoadingAppointments(false);
        }
    }, [patientId]); 
 // Re-run effect whenever the patientId changes

    // --- Data Enhancement Logic (now runs on the 'appointments' state) ---

    if (!patientId) {
        return <p className='mt-12 text-red-500'>Please log in to view your appointments.</p>;
    }
    
    if (isLoadingAppointments) {
        return <p className='mt-12 text-blue-500'>Loading your appointments...</p>;
    }

    if (fetchError) {
         return <p className='mt-12 text-red-500'>Error loading appointments: {fetchError}</p>;
    }
    
    // The previous filtering step is now handled by the API call, 
    // so we skip the filter and directly enhance the fetched 'appointments' array.

    const enhancedAppointments = appointments.map((appt) => {
        const doctorDetails = doctors.find((doc) => doc._id === appt.docId);
        
        return {
            ...appt,
            doctor: doctorDetails,
        };
    });

    // Optional: Add sorting here
    enhancedAppointments.sort((a, b) => a.isCompleted - b.isCompleted);

    // --- JSX Rendering (Remains mostly the same, but uses 'enhancedAppointments') ---

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
            <div>
                {enhancedAppointments.length === 0 ? (
                    <p className='mt-4 text-zinc-500'>You have no appointments scheduled.</p>
                ) : (
                    enhancedAppointments.map((appt) => (
                        <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={appt._id}> 
                            <div>
                                <img 
                                    className='w-32 bg-indigo-50' 
                                    src={appt.doctor?.image || assets.profile_pic} 
                                    alt={appt.doctor?.name || "Doctor"} 
                                />
                            </div>
                            <div className='flex-1 text-sm text-zinc-600'>
                                <p className='text-neutral-800 font-semibold'>{appt.doctor?.name || 'Unknown Doctor'}</p>
                                <p>{appt.doctor?.speciality}</p>
                               
                                <p className='text-sm mt-1'>
                                    <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>
                                    {appt.slotDate} | {appt.slotTime}
                                </p>
                                <p className='text-sm mt-1'>
                                    <span className='text-sm text-neutral-700 font-medium'>Fees:</span> ${appt.amount}
                                    <span className={`ml-3 text-xs font-medium ${appt.payment ? 'text-green-600' : 'text-red-600'}`}>
                                        ({appt.payment ? 'Paid' : 'Unpaid'})
                                    </span>
                                </p>
                            </div>
                            <div />
                            <div className='flex items-center justify-end gap-5 max-md:order-first max-md:w-full max-md:flex-row max-md:justify-center'>
                                {!appt.isCompleted ? (
                                    <>
                                        {/* Reschedule Button */}
                                        <button 
                                            onClick={() => handleReschedule(appt._id)}
                                            // Disable buttons while an action is pending
                                            disabled={actionStatus?.type === 'loading'} 
                                            className='px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            Reschedule
                                        </button>

                                        {/* Cancel Button */}
                                        <button
                                            onClick={() => handleCancel(appt._id)}
                                            // Disable buttons while an action is pending
                                            disabled={actionStatus?.type === 'loading'}
                                            className='px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    // 9. Display final status for completed or cancelled appointments
                                    <span className={`text-sm font-semibold text-center py-2 px-4 rounded-lg shadow-sm ${
                                        appt.status === 'Cancelled' ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'
                                    }`}>
                                        {appt.status || 'Completed'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyAppointments;