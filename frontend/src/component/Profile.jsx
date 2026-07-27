import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import img from "../assets/youtube.png"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "./CustomAlert";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { auth, provider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { SiYoutubestudio } from "react-icons/si";

const Profile = () => {
 const navigate = useNavigate()
 const {userData} = useSelector(state=>state.user)
 const dispatch = useDispatch()
  const handleSignOut = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/signout" , {withCredentials:true})
            console.log(result.data)
            dispatch(setUserData(null))
            showCustomAlert("Signout Successfully")


        } catch (error) {
            console.log(error)
            showCustomAlert(error.response.data.message)

        }
    }
   const googleSignIn = async () => {
      try {
        const response = await signInWithPopup(auth,provider)
       console.log(response)
        let user = response.user
        let username = user.displayName
        let email = user.email
        let photoUrl = user.photoURL
        
        const result = await axios.post(serverUrl + "/api/auth/google-auth" , {username , email ,photoUrl} , {withCredentials:true})
        dispatch(setUserData(result.data))

            navigate("/")
            showCustomAlert("SignIn with Google Successfully")
      } catch (error) {
        console.log(error)
        showCustomAlert("SignIn with Google Error")
      }
    }

  return (
    <div >
     

      {/* Dropdown Menu */}
      
        <div className="absolute right-5 top-10 mt-2 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50">
          {/* Profile Info */}
          {userData && <div className="flex items-center gap-3 p-4 border-b border-gray-700">
              
<img
  src={userData?.photoUrl || img}
  alt="Profile"
  className="w-12 h-12 flex items-center justify-center rounded-full object-cover border-1 border-gray-700"
/>
            <div>
              <h4 className="font-semibold">{userData?.username}</h4>
              <p className="text-sm text-gray-400">{userData?.email}</p>
              <p
  className="text-sm text-blue-400 cursor-pointer hover:underline"
  onClick={() => {
    if (userData?.channel) {
      // Go to channel page
      navigate("/viewchannel")
      // navigate(`/channel/${userData.channel._id}`);
    } else {
      // Go to create channel flow
      navigate("/createchannel");
    }
  }}
>
  {userData?.channel ? "View Channel" : "Create Channel"}
</p>
            </div>
          </div>}

          {/* Options */}
          <div className="flex flex-col py-2">
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={googleSignIn}>
              <FcGoogle className="text-xl" />SignIn with Google Account
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={()=>navigate("/signup")}>
              <TiUserAddOutline className="text-xl" />
              Create new account
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={()=>navigate("/signin")}>
              <MdOutlineSwitchAccount className="text-xl" /> SignIn with other account
            </button>
            {userData?.channel && <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={()=>navigate("/ptstudio/dashboard")}>
              <SiYoutubestudio className="w-5 h-5 text-orange-400" /> PT Studio
            </button>}
            
            {userData && <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700" onClick={handleSignOut}>
              <FiLogOut className="text-xl" /> Sign out
            </button>}
          </div>
        </div>
      
    </div>
  );
};

export default Profile;