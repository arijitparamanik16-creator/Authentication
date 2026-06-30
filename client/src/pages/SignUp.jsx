import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { dataContext } from "../context/UserContext";
import dp from "../assets/profileImg.jpg";
import { useRef } from "react";

const Signup = () => {
  // reference for image input
  let file = useRef(null);

  // states for handling image in frontend and backend
  const [frontendImage, setfrontendImage] = useState(dp);
  const [backendImage, setbackendImage] = useState(null);
  let navigate = useNavigate();
  // user the context api
  let { serverURL, userData, setuserData, getUserData } =
    useContext(dataContext);
  // useContextntext always return an obj

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // e.preventDefault() is needed to stop the browser's default behavior to refresh the page for an event
    try {
      // Sending the data using FormData because the request contains both text fields and files.
      let formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("password", password);
      if (backendImage) {
        formData.append("profileImage", backendImage);
        // in server the backendImage is passed as profileImage parameter
      }
      const response = await axios.post(serverURL + "/api/signUp", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        //  Tells the server that the request contains both text fields and file(s). Axios automatically detects FormData and sets the correct header, including the required boundary.
      });
      console.log(response.data);
      // in case of token authentication
      await getUserData();
      // setting the fetched userData
      navigate("/");
    } catch (error) {
      console.log({ error: error.response?.data.message });
    }
  };

  // execution order -------------------------------------->
  // User signs up.
  // Server creates the user and sends the authentication cookie.
  // getUserData() fetches the user's information.
  // setuserData(data) schedules a Context state update.
  // // You navigate to /. React re-renders, and Home receives the updated userData.

  // handle image
  const handleImg = (e) => {
    // console.log(e);
    // taking the image from the event parameter
    let file = e.target.files[0];
    setbackendImage(file);
    // coverting the image to url
    let image = URL.createObjectURL(file);
    setfrontendImage(image);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#16211d] rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Sign Up
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col justify-center items-center"
        >
          {/*input to store the Profile Image */}
          <input type="file" hidden ref={file} onChange={handleImg} />
          {/* profile img  */}
          <div className="w-[110px] h-[110px] flex justify-center rounded-full overflow-hidden  border-2 border-white relative ">
            <img
              src={frontendImage}
              alt="profile_img"
              className=" w-[100%] h-[100%] rounded-full bg-white object-contain "
            />
            <div
              className="w-[100%] h-[100%] bg-black absolute top-0 flex justify-center items-center opacity-0 hover:opacity-50 hover:cursor-pointer text-white text-2xl font-semibold "
              onClick={() => file.current.click()}
            >
              {/* file.current refers to the hidden file input and click() programmatically clicks that input. */}
              +
            </div>
          </div>
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Username */}
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

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
            Sign Up
          </button>

          <p
            className="text-center text-gray-300 text-sm hover:text-gray-400 hover:cursor-pointer"
            onClick={() => navigate("/login")}
          >
            already have an account?
            <span className="text-cyan-400 hover:text-cyan-300 font-medium">
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
