import React, { useContext } from 'react';
import { assets, patients, doctors } from '../assets/assets'; 
import { DoctorContext } from '../context/DoctorContext'; 

// Function to calculate patient age
const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Helper function to find patient data based on ID
const getPatientDetails = (patId, assets) => {
    const patient = patients.find(p => p._id === patId);
    
    return patient || { 
        name: 'Unknown Patient (ID: ' + patId + ')', 
        dob: null, 
        image: assets.profile_pic 
    };
};


const DocAppointment = () => {
    // Destructure necessary values from context
    const { 
        appointments: allAppointments, // Rename to avoid confusion
        doctorToken, // Holds the logged-in docId
        isLoading, 
        error 
    } = useContext(DoctorContext);

    // 1. Loading State
    if (isLoading) {
        return (
            <div className='w-full max-w-6xl m-5 text-center p-10 bg-white border rounded shadow-lg'>
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
                    <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
                    <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
                </div>
                <p className='mt-4 text-lg font-medium text-blue-600'>Loading Appointments...</p>
            </div>
        );
    }
    
    // 2. Error State
    if (error) {
        return (
            <div className='w-full max-w-6xl m-5 text-center p-10 bg-red-50 border border-red-300 rounded shadow-lg'>
                <p className='text-xl text-red-600 font-semibold'>
                    Error Loading Data
                </p>
                <p className='text-red-500 mt-2'>{error}</p>
            </div>
        );
    }

    // 3. Unauthorized State
    // If doctorToken is null, the doctor is not logged in.
    if (!doctorToken) {
        return (
            <div className='w-full max-w-6xl m-5 text-center p-10 bg-yellow-50 border border-yellow-300 rounded shadow-lg'>
                <p className='text-xl text-yellow-700 font-semibold'>
                    Unauthorized Access
                </p>
                <p className='text-gray-600 mt-2'>Please log in to view your appointments.</p>
            </div>
        );
    }

    // 4. Filtering Logic
    // Filter appointments where docId matches the logged-in doctorToken
    const filteredAppointments = allAppointments.filter(appt => appt.docId === doctorToken);


    if (!filteredAppointments || filteredAppointments.length === 0) {
        return (
            <div className='w-full max-w-6xl m-5 text-center p-10 bg-white border rounded shadow-lg'>
                <p className='text-xl text-gray-500 font-semibold'>
                    No appointments found for Doctor ID: {doctorToken}
                </p>
                <p className='text-gray-400 mt-2'>Your schedule is clear!</p>
            </div>
        );
    }

    return (
        <div className='w-full max-w-6xl m-5'>
            <h1 className='mb-3 text-lg font-bold text-gray-700'>
                My Appointments
            </h1>
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll shadow-lg'>
                <div className='max-sm:hidden sticky top-0 bg-blue-50 grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b font-semibold text-blue-800'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {filteredAppointments.map((item, index) => {
                    const patient = getPatientDetails(item.patId, assets);
                    
                    return (
                        <div 
                            key={index} 
                            className='grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-4 px-6 border-b items-center transition duration-150 ease-in-out hover:bg-indigo-50'
                        >
                            <p className='font-mono text-gray-500'>{index + 1}</p>
                            
                            <div className='flex items-center gap-3'>
                                <img 
                                    src={patient.image} 
                                    alt={patient.name} 
                                    className='w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm'
                                />
                                <p className='font-medium text-gray-800'>{patient.name}</p> 
                            </div>
                            
                            <div>
                                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${item.payment ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.payment ? 'Paid' : 'Unpaid'}
                                </span>
                            </div>
                            
                            <p className='text-gray-600'>{calculateAge(patient.dob)}</p>
                            
                            <div className='text-gray-700'>
                                <p className='font-medium'>{item.slotTime}</p>
                                <p className='text-xs text-gray-500'>{item.slotDate.replace(/_/g, '/')}</p>
                            </div>
                            
                            <p className='font-bold text-lg text-green-700'>${item.amount}</p>
                            
                            <div>
                                <button className='bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md hover:bg-blue-700 transition duration-150'>
                                    View Patient
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default DocAppointment;