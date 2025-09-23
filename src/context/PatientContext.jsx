import React, { createContext, useState } from 'react';

export const PatientContext = createContext();

export const PatientContextProvider = (props) => {
    const [pToken, setPToken] = useState(localStorage.getItem('patientToken') || ''); 
    const value = {
        pToken,
        setPToken,
    };

    return (
        <PatientContext.Provider value={value}>
            {props.children}
        </PatientContext.Provider>
    );
};