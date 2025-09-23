import React, { createContext, useState } from 'react';

export const DoctorContext = createContext(null);

export const DoctorProvider = ({ children }) => {
  const [doctorToken, setDToken] = useState(null);

  const value = {
    doctorToken,
    setDToken,
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};