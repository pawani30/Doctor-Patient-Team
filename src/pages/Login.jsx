// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTypeToggler from '../components/UserTypeToggler'; // Adjust path based on your structure
import { doctors, patients } from '../assets/assets'; // Import your local data
import { PatientContext } from './../context/PatientContext';
import { DoctorContext } from './../context/DoctorContext';

const Login = () => {
    const [userType, setUserType] = useState('patient'); // 'patient' or 'doctor'
    const [authMode, setAuthMode] = useState('login');   // 'login' or 'signup'
    const [fullName, setFullName] = useState(''); // For signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { setDToken } = useContext(DoctorContext) || {};
    const { setPToken } = useContext(PatientContext) || {};

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (userType === 'patient') {
                const patient = patients.find(p => p.email === email && p.password === password);
                if (patient) {
                    const dummyToken = `fake-patient-token-${patient._id}`;
                    setPToken(dummyToken);
                    localStorage.setItem('patientToken', dummyToken);
                    console.log('Patient Login successful:', patient.name);
                    navigate('/'); 
                } else {
                    throw new Error('Invalid patient email or password.');
                }
            } else { // userType === 'doctor'
                const doctor = doctors.find(d => d.email === email && d.password === password);
                if (doctor) {
                    const dummyToken = `fake-doctor-token-${doctor._id}`;
                    setDToken(dummyToken);
                    localStorage.setItem('doctorToken', dummyToken);
                    console.log('Doctor Login successful:', doctor.name);
                    navigate('/doctor-dashboard'); // Redirect doctor to their dashboard/doctors list
                } else {
                    throw new Error('Invalid doctor email or password.');
                }
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!fullName || !email || !password) {
            setError('All fields are required for signup.');
            return;
        }

        console.log(`Simulating ${userType} signup: Name: ${fullName}, Email: ${email}, Password: ${password}`);
        setError('Signup simulated! Please try logging in with the credentials.');
        setAuthMode('login'); // After signup, switch to login mode
        setFullName(''); setEmail(''); setPassword(''); // Clear form
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <UserTypeToggler userType={userType} setUserType={setUserType} />

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    {authMode === 'login' ? 'Login' : 'Create Account'}
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Please {authMode === 'login' ? 'login' : 'sign up'} to access your portal.
                </p>

                {error && (
                    <p className="text-red-600 text-sm text-center mb-4">{error}</p>
                )}

                <form onSubmit={authMode === 'login' ? handleLogin : handleSignup}>
                    {authMode === 'signup' && (
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 w-full"
                        >
                            {authMode === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="text-indigo-600 hover:text-indigo-800 font-bold focus:outline-none"
                    >
                        {authMode === 'login' ? 'Sign Up Here' : 'Login Here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;