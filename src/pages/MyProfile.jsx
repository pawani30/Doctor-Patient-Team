import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { assets, patients } from './../assets/assets';
import { PatientContext } from './../context/PatientContext';


const MyProfile = () => {

  // const [userData,setUserData]=useState({
  //   name:"Edward Vincent",
  //   image:assets.profile_pic,
  //   email:'richardjameswap@gmail.com',
  //   phone:'+1 123 456 7890',
  //   address:{
  //     line1:"57th Cross,Richmond",
  //     line2:"Circle,Church Road,London"
  //   },
  //   gender:'Male',
  //   dob:'2000-01-20'
  // })

    const patientContext = useContext(PatientContext);
    const pToken = patientContext ? patientContext.pToken : null;

  const [userData, setUserData] = useState({
        name: "Loading...",
        image: assets.profile_pic,
        email: '',
        phone: '',
        address: { line1: "", line2: "" },
        gender: '',
        dob: ''
    });

   const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (pToken) {
            // Find the patient using the ID stored in pToken
            // NOTE: Assuming the pToken holds the clean patient ID (e.g., 'pat1') 
            // and NOT the 'fake-patient-token-pat1' prefix, as fixed earlier.
            const loggedInPatient = patients.find(p => p._id === pToken);

            if (loggedInPatient) {
                // Map the patient data to the component's userData state
                setUserData({
                    name: loggedInPatient.name,
                    image: assets.profile_pic, // Use a default image if patient data doesn't include one
                    email: loggedInPatient.email,
                    phone: loggedInPatient.phone || 'N/A', // Assuming phone is an optional field
                    address: {
                        line1: loggedInPatient.address.line1 || '',
                        line2: loggedInPatient.address.line2 || ''
                    },
                    gender: loggedInPatient.gender || 'N/A',
                    dob: loggedInPatient.dob || 'N/A'
                });
            } else {
                console.error("Patient data not found for token:", pToken);
                // Optionally redirect to login or show an error
            }
        } else {
            // No token found (not logged in)
            console.log("No patient token available.");
            // If you want to force redirect, use navigate('/login') here
        }
        setIsLoading(false);
    }, [pToken]); // Reruns whenever the pToken state changes (login/logout)


    const handleSave = () => {
        // In a real application, you would call an API here to SAVE the data:
        // await updatePatientProfile(pToken, userData);
        
        console.log("Saving updated data:", userData);
        setIsEdit(false);
    }
    
    if (isLoading) {
        return <div className="max-w-lg p-4 text-lg">Loading patient profile...</div>;
    }

    if (!pToken) {
         return <div className="max-w-lg p-4 text-lg text-red-600">You must be logged in to view this profile.</div>;
    }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      <img className='w-36 rounded' src={userData.image} alt="" />
      {
        isEdit
        ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={e=>setUserData(prev=>({...prev,name:e.target.value}))} />
        : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }
      <hr className='bg-zinc-400 h-[1px] border-none'/>
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
        isEdit
        ? <input className='bg-gray-100 max-w-52' type="text" value={userData.phone} onChange={e=>setUserData(prev=>({...prev,phone:e.target.value}))} />
        : <p className='text-blue-400'>{userData.phone}</p>
      }
      <p className='font-medium'>Address:</p>
      {
        isEdit
        ? <p>
          <input className='bg-gray-50' onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} value={userData.address.line1}type="text" />
          <br />
          <input className='bg-gray-50' onChange={(e)=>setUserData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}  value={userData.address.line2}type="text" />
        </p>
        : <p className='text-gray-500'>
          {userData.address.line1}
          <br />
          {userData.address.line2}
        </p>
      }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender</p>
          {
            isEdit
            ? <select className='max-w-20 bg-gray-50' onChange={(e)=>setUserData(prev=>({...prev,gender:e.target.value}))} value={userData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            : <p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='font-medium'>Birthday:</p>
          {
            isEdit
            ? <input className='max-w-28 bg-gray-100' type="date" onChange={(e)=>setUserData(prev=>({...prev,dob:e.target.value}))} value={userData.dob} />
            : <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit
          ?<button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={()=>setIsEdit(false)}>Save Information</button>
          :<button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={()=>setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile
