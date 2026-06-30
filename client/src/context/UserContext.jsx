import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// creating a context api
export const dataContext = createContext();
const UserContext = ({ children }) => {
  let navigate = useNavigate();
  // creating a state that holds the userData
  const [userData, setuserData] = useState(null);
  const serverURL = "http://localhost:4000";
  const getUserData = async () => {
    try {
      // fetching the userdata by token authentication
      let { data } = await axios.get(serverURL + "/api/getuserData", {
        withCredentials: true,
      });
      console.log(data);

      setuserData(data);
    } catch (error) {
      console.log({ message: error });
      navigate('/login')
    }
  };
  const value = {
    serverURL,
    userData,
    setuserData,
    getUserData,
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    // storing the url into the context api provider
    <dataContext.Provider value={value}>{children}</dataContext.Provider>
  );
};

export default UserContext;


// // execution flow --------------------->
// Website opens
//       │
//       ▼
// UserContext starts rendering
//       │
//       ▼
// Render #1
// userData = null
//       │
//       ▼
// Home also renders with userData = null
//       │
//       ▼
// Render #1 finishes
//       │
//       ▼
// useEffect() runs
//       │
//       ▼
// getUserData()
//       │
//       ▼
// Browser sends token cookie
//       │
//       ▼
// Server verifies token
//       │
//       ├──────────────────────┐
//       │                      │
//   Valid token           Invalid token
//       │                      │
//       ▼                      ▼
// Return user            Throw error
//       │                      │
//       ▼                      ▼
// setuserData(data)      navigate("/login")
//       │
//       ▼
// React schedules a re-render
//       │
//       ▼
// Render #2 of UserContext
// userData = fetched user
//       │
//       ▼
// Home re-renders
// userData = fetched user
//       │
//       ▼
// Profile is displayed