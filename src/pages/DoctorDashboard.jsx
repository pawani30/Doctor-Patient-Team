// src/pages/DoctorDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';


const DoctorDashboard = () => {
  const { dToken, doctorInfo } = useContext(DoctorContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  // This effect checks for a token and fetches data
  useEffect(() => {
    // Redirect if no token is found (simple route protection)
    // if (!dToken) {
    //   navigate('/login');
    //   return;
    // }

    // This is placeholder logic. In a real app, you would fetch data from your backend.
    const fetchAppointments = async () => {
      // Example of fetching appointments for the logged-in doctor
      // const response = await fetch(`your-api-url/doctors/${doctorInfo._id}/appointments`);
      // const data = await response.json();
      
      // Using mock data for now
      const mockAppointments = [
        { id: 1, patientName: "John Doe", date: "2025-10-25", time: "10:00 AM" },
        { id: 2, patientName: "Jane Smith", date: "2025-10-26", time: "02:30 PM" },
      ];
      setAppointments(mockAppointments);
      setLoading(false);
    };

    if (doctorInfo) {
      fetchAppointments();
    } else {
      // Handle cases where doctorInfo might not be loaded yet
      setLoading(false);
    }

  }, [dToken, doctorInfo, navigate]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4">
        
      <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>
      
      {doctorInfo && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Welcome, Dr. {doctorInfo.name}!</h2>
          <p>Email: {doctorInfo.email}</p>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-2">Upcoming Appointments</h3>
        {appointments.length > 0 ? (
          <ul className="list-disc pl-5">
            {appointments.map(app => (
              <li key={app.id}>
                **Patient:** {app.patientName}, **Date:** {app.date}, **Time:** {app.time}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no upcoming appointments.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;