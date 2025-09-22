import { useState } from "react";
import { createContext } from "react";

export const DoctorContext=createContext()

const DoctorContextProvider=(props)=>{
   
    const [dToken,setDToken]=useState(localStorage.getItem('dToken')? localStorage.getItem('dToken'):'')
    const value={
        dToken,setDToken,
        
    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider