
import React from 'react';

const UserTypeToggler = ({ userType, setUserType }) => {
    return (
        <div className="flex justify-center mb-6 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
            <button
                onClick={() => setUserType('patient')}
                className={`flex-1 px-4 py-3 text-lg font-semibold border-none bg-transparent cursor-pointer outline-none transition-all duration-300 ${userType === 'patient' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
               
            >
                Patient
            </button>
            <div className="border-r border-gray-300"></div> {/* Separator */}
            <button
                onClick={() => setUserType('doctor')}
                className={`flex-1 px-4 py-3 text-lg font-semibold border-none bg-transparent cursor-pointer outline-none transition-all duration-300 ${userType === 'doctor' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                
            >
                Doctor
            </button>
        </div>
    );
};

export default UserTypeToggler;