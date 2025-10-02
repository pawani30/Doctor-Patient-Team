import React from 'react';
import { assets } from '../assets/assets';

const AppointmentItem = ({ appointment }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
                {/* Patient Avatar (using the fetched avatarUrl) */}
                <img 
                    src={appointment.avatarUrl}
                    alt={appointment.patientName} 
                    className="w-10 h-10 rounded-full mr-4 object-cover border border-gray-300" 
                />
                
                {/* Details */}
                <div>
                    <p className="font-semibold text-gray-800">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">{appointment.bookingDetails}</p>
                </div>
            </div>
            
            {/* Action/Cancel Button */}
            <button 
                className="text-red-400 p-2 rounded-full hover:bg-red-50 transition-colors"
                // Placeholder action for removing/cancelling
                onClick={() => console.log(`Attempting to cancel appointment ${appointment.id}`)}
            >
                <img src={assets.cross_icon} alt="Cancel" className="w-4 h-4" />
            </button>
        </div>
    );
};

const LatestAppointmentList = ({ appointments }) => {
    if (appointments.length === 0) {
        return <div className="p-4 text-center text-gray-500">No recent appointments found.</div>;
    }
    
    return (
        <div className="divide-y divide-gray-100">
            {appointments.map(app => (
                <AppointmentItem key={app.id} appointment={app} />
            ))}
        </div>
    );
};

export default LatestAppointmentList;