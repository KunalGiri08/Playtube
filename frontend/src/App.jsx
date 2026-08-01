import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home";
import Shorts from "./pages/Shorts/Shorts";
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import CustomAlert from './component/CustomAlert'
import getCurrentUser from './customHooks/GetCurrentUser';
import UsegetChannel from './customHooks/GetChannelData';
import ForgetPassword from './Pages/ForgetPassword';
import MobileProfile from './component/MobileProfile';
import CreateChannel from './Pages/Channel/CreateChannel';
import ViewChannel from './Pages/Channel/ViewChannel';
import UpdateChannel from './Pages/Channel/UpdateChannel';
import { useSelector } from 'react-redux';
export const serverUrl = "http://localhost:8000"

const ProtectedRoute = ({ userData, children }) => {
  if (!userData) {
    showCustomAlert("Please sign up first to use this feature!");
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  getCurrentUser()
  UsegetChannel()

  const { userData } = useSelector(state => state.user)
  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path='/shorts' element={<ProtectedRoute userData={userData}><Shorts /></ProtectedRoute>} />
          <Route path='/viewchannel' element={<ProtectedRoute userData={userData}><ViewChannel /></ProtectedRoute>} />
          <Route path='/updatechannel' element={<ProtectedRoute userData={userData}><UpdateChannel /></ProtectedRoute>} />
          <Route path="/mobilepro" element={<MobileProfile />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/createchannel" element={<CreateChannel />} />

      </Routes>
    </>
  )
}

export default App