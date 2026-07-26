import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home";
import Shorts from "./pages/Shorts/Shorts";
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import CustomAlert from './component/CustomAlert'
import getCurrentUser from './customHooks/GetCurrentUser';
export const serverUrl = "http://localhost:8000"

function App() {
  getCurrentUser()
  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="shorts" element={<Shorts />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </>
  )
}

export default App