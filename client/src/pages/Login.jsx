import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { dataContext } from "../context/UserContext";

const Login = () => {
  // user the context api
  let { serverURL, setAccessToken, getUserData } = useContext(dataContext);
  // useContextntext always return an obj
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // e.preventDefault() is needed to stop the browser's default behavior to refresh the page for an event
    try {
      const response = await axios.post(
        serverURL + "/api/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      const isSuccess = await getUserData(response.data.AccessToken);
      //await waits for the API call to finish, but it does NOT wait for React state (setState) to update. State updates become available only after React re-renders the component, so here if => console.log(userData) then it gives null; because the component is not re-render yet
      setAccessToken(response.data.AccessToken);
      if (isSuccess) {
        navigate("/");
      }
    } catch (error) {
      console.log({ error: error.response.data.message });
    }
  };


  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#16211d] rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Log In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-md transition"
          >
            Log In
          </button>

          <p
            className="text-center text-gray-300 text-sm hover:text-gray-400 hover:cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            create a new account ?
            <span className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;



// execution flow -------------------------------------->
// User enters email and password
//         |
//         v
// Submits login form
//         |
//         v
// POST /api/login
//         |
//         v
// Backend validates credentials
//         |
//         v
// Returns AccessToken and sets refresh cookie
//         |
//         v
// setAccessToken(AccessToken)
//         |
//         v
// getUserData(AccessToken)
//         |
//         v
// Fetch user details
//         |
//         +---------------------+
//         |                     |
//      Success                 Failure
//         |                     |
//         v                     v
// setuserData(data)       Clear access token
//         |
//         v
// navigate("/")
//         |
//         v
// App checks userData
//         |
//         v
// Home is rendered
