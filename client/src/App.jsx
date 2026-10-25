import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login";
import Home from "./pages/Home.jsx";
import { dataContext } from "./context/UserContext.jsx";

function App() {
  let { userData, loading } = useContext(dataContext);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Checking authentication...
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={userData ? <Navigate to={'/'} replace/>: <Login />} />
        <Route path="/" element={userData ? <Home /> :  <Navigate to="/login" replace />}/>
      </Routes>
    </>
  );
}

export default App;

// execution flow ---------------------------->
// Website opens or reloads
//         |
//         v
// UserContext initializes
// userData = null, loading = true
//         |
//         v
// UserContext useEffect runs
//         |
//         v
// Refresh-token API request
//         |
//         +--------------------------+
//         |                          |
//    Valid refresh token        Invalid/missing token
//         |                          |
//         v                          v
// Receive access token         userData = null
//         |                          |
//         v                          |
// getUserData(by accessToken)        |
//         |                          |
//         +-------------+------------+
//                       |
//                       v
//             loading = false
//                       |
//                       v
//                  App renders
//                       |
//              +--------+--------+
//              |                 |
//          userData exists   userData is null
//              |                 |
//              v                 v
//            Home              Login

