import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import CustomAlert from './component/CustomAlert'
export const serverUrl = "http://localhost:8000"

function App() {
  return (
    <>
    <CustomAlert />
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/signup' element={<SignUp/>} />
    </Routes>
    </>
  )
}

export default App