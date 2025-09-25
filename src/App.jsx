import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from './components/Footer';


import { DoctorProvider, DoctorContext } from "./context/DoctorContext";
import { PatientContextProvider, PatientContext } from "./context/PatientContext";
import DoctorDashboard from './pages/DoctorDashboard';
import DocNav from './components/DocNav';
import Sidebar from './components/Sidebar';

const PrivateDoctorRoute = ({ children }) => {
    // Correctly checking for 'doctorToken'
    const storedToken = localStorage.getItem('doctorToken');
    if (!storedToken) { // simplified check
        return <Navigate to="/login" replace />;
    }
    return children;
};

const PrivatePatientRoute = ({ children }) => {
    // Correctly checking for 'patientToken'
    const storedToken = localStorage.getItem('patientToken');
    if (!storedToken) { // simplified check
        return <Navigate to="/login" replace />;
    }
    return children;
};
const App = () => {
  return (
    <DoctorProvider>
    <PatientContextProvider>
    <div className="mx-4 sm:mx-[10%]">
      {localStorage.getItem('doctorToken') ? <DocNav /> : <Navbar />}
      {localStorage.getItem('doctorToken')?<Sidebar/>:""}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/doctor-dashboard"
          element={
            <PrivateDoctorRoute>
              <DoctorDashboard />
            </PrivateDoctorRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route 
              path="/my-profile" 
              element={
                <PrivatePatientRoute>
                  <MyProfile />
                </PrivatePatientRoute>
              } 
            />
            <Route 
              path="/my-appointments" 
              element={
                <PrivatePatientRoute>
                  <MyAppointments />
                </PrivatePatientRoute>
              } 
            />

            {/* You would use PrivateDoctorRoute for doctor-specific pages */}
            <Route 
              path="/appointment/:docId" 
              element={
                <PrivatePatientRoute>
                  <Appointment />
                </PrivatePatientRoute>
              } 
            />
      </Routes>
      <Footer/>
    </div>
    </PatientContextProvider>
    </DoctorProvider>
  );
};

export default App;
