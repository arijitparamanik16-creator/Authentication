import { createContext, useEffect, useState } from "react";
import axios from "axios";

// creating a context api
export const dataContext = createContext();

const UserContext = ({ children }) => {
  // creating a state that holds the userData
  const [userData, setuserData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const serverURL = "http://localhost:4000";

  // fetching access token whenever page reloads by refreshToken
  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.get(`${serverURL}/api/refreshtoken`, {
        withCredentials: true,
      });
      if (data.AccessToken) {
        setAccessToken(data.AccessToken);
        const isSuccess = await getUserData(data.AccessToken);
        // false 
        if (!isSuccess) {
          setAccessToken(null);
          setuserData(null);
        }
      } 
      // if no accessToken 
      else {
        setAccessToken(null);
        setuserData(null);
      }
    } catch (error) {
      setAccessToken(null);
      setuserData(null);
    }finally{
     setLoading(false)
    }
  };
  // getuserdata
  const getUserData = async (accessToken) => {
    try {
      // fetching the userdata by token authentication
      let { data } = await axios.get(serverURL + "/api/getuserData", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(data);
      setuserData(data);
      return true;
    } catch (error) {
      console.log(error.response?.data || error.message);
      return false;
    }
  };

  const value = {
    serverURL,
    userData,
    setuserData,
    getUserData,
    setAccessToken,
    loading
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    // storing the url into the context api provider
    <dataContext.Provider value={value}>{children}</dataContext.Provider>
  );
};

export default UserContext;

// // execution flow --------------------->
// UserContext first renders
//         |
//         v
// userData = null
// loading = true
//         |
//         v
// useEffect()
//         |
//         v
// refreshAccessToken()
//         |
//         v
// GET /api/refreshtoken
//         |
//         v
// Access token received
//         |
//         v
// getUserData(accessToken)
//         |
//         v
// GET /api/getuserData
// Authorization: Bearer <accessToken>
//         |
//         v
// setuserData(data)
//         |
//         v
// finally: setLoading(false)
//         |
//         v
// React re-renders
//         |
//         v
// App reads the updated authentication state
