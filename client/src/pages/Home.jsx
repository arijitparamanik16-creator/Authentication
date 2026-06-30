import React, { useContext } from "react";
import UserContext, { dataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const Home = () => {
  // taking the fetch userData by token authentication
  let { userData, setuserData , serverURL} = useContext(dataContext);
let navigate= useNavigate()
if(!userData){{
  navigate('/login')
}}

const handleclick=async()=>{
  try {
     let response= await axios.get(serverURL+'/api/logOut',{
    withCredentials: true
  })
 setuserData(null)

  } catch (error) {
    console.log(err);
    
  }
}

  
  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center gap-6 bg-slate-900">
      
      {/* If userData is null, React simply displays nothing instead of throwing an error . cause the at the initial render of home.jsx there is userData = null */}
        <div className=" w-[200px] h-[200px] rounded-full border-2 border-white text-white "><img src={userData.profileImage} alt="profile_img" className="w-[100%] h-[100%] object-contain rounded-full" />
        </div>
        <ul className=" w-[30vw] flex flex-col justify-center items-center gap-6 border-4 border-white rounded-xl p-4">
          <li className="flex w-[100%] gap-3 p-3">
            <span className="w-[35%] text-white font-medium">FirstName :</span>
          <span className="w-[65%] bg-slate-600 rounded-xl p-2 flex items-center justify-center text-white overflow-x-scroll scrollbar-hide">{userData.firstName}</span>
          </li>
          <li className="flex w-[100%] gap-3 p-3">
            <span className="w-[35%] text-white font-medium">lastName :</span>
          <span className="w-[65%] bg-slate-600 rounded-xl p-2 flex items-center justify-center text-white overflow-x-scroll scrollbar-hide">{userData.lastName}</span>
          </li>
          <li className="flex w-[100%] gap-3 p-3">
            <span className="w-[35%] text-white font-medium">userName :</span>
          <span className="w-[65%] bg-slate-600 rounded-xl p-2 flex items-center justify-center text-white overflow-x-scroll scrollbar-hide">{userData.userName}</span>
          </li>
          <li className="flex w-[100%] gap-3 p-3">
            <span className="w-[35%] text-white font-medium">email :</span>
          <span className="w-[65%] bg-slate-600 rounded-xl p-2 flex items-center justify-center text-white overflow-x-scroll scrollbar-hide">{userData.email}</span>
          </li>
        </ul>
        <button className="w-[20vw] py-4 px-2 bg-blue-400 rounded-xl hover:bg-blue-600" onClick={handleclick}>logOut</button>
    </div>
  );
};

export default Home;
