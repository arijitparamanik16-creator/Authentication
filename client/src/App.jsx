import { useContext, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login'
import './App.css'
import Home from './pages/Home.jsx'
import { dataContext } from './context/UserContext.jsx'

function App() {
let {userData, setuserData}= useContext(dataContext)
  return (
    <>
    <Routes>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={userData? <Home/> : <Login/>}/>
    </Routes>

    </>
  )
}

export default App


// execution flow ---------------------------->
// Website opens
//         │
//         ▼
// UserContext Render #1
// userData = null
//         │
//         ▼
// App Render #1
//         │
//         ▼
// Checks:
// userData ? <Home/> : <Login/>
//         │
//         ▼
// false
//         │
//         ▼
// <Login /> is rendered
//         │
//         ▼
// Render finishes
//         │
//         ▼
// useEffect()
//         │
//         ▼
// getUserData()
//         │
//         ▼
// Server verifies token
//         │
//         ▼
// setuserData(data) conduct a re-render of usercontext
//         │
//         ▼
// UserContext Render #2
// userData = fetched user
//         │
//         ▼
// App Render #2
//         │
//         ▼
// Checks:
// userData ? <Home/> : <Login/>
//         │
//         ▼
// true
//         │
//         ▼
// <Home /> is rendered