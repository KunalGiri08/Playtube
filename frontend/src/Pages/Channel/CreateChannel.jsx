import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../../assets/youtube.png"; // PlayTube logo
import {  useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { setChannelData } from "../redux/userSlice";
import { showCustomAlert } from "../../component/CustomAlert";

const CreateChannelFlow = () => {
  const [step, setStep] = useState(1);
  const [channelName, setChannelName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const {userData}  = useSelector(state=>state.user)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);
  const handleBannerChange = (e) => setBanner(e.target.files[0]);


  const handleCreateChannel = async () => {
    const formData = new FormData()
    formData.append("name",channelName);
    formData.append("avatar",avatar);
    formData.append("description",description);
    formData.append("category",category);
    formData.append("bannerImage",banner);
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/user/create-channel" ,formData , {withCredentials:true})
      console.log(result)
      showCustomAlert("Channel Created")
      dispatch(setChannelData(result.data))
      navigate("/")
      setLoading(false)
    } catch (error) {
      console.log(error)
      showCustomAlert(error.response.data.message)
      setLoading(false)
    }
    
  }


  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src={logo} alt="PlayTube" className="w-8 h-8" />
          <span className="text-xl font-bold">PlayTube</span>
        </div>
        <div className="flex items-center gap-3">
          {!userData?.photoUrl ?
            <FaUserCircle className="text-3xl cursor-pointer" /> :
            <img src={userData?.photoUrl} className="w-9 h-9 rounded-full"/>}
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-lg shadow-lg">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">How you’ll appear</h2>
              <p className="text-sm text-gray-400 mb-6">
                Choose a profile picture, channel name.
              </p>

              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-600"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                      <FaUserCircle size={40} />
                    </div>
                  )}
                  <span className="text-blue-400 text-sm mt-2">
                    Upload Picture
                  </span>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* Channel Name */}
              <input
                type="text"
                placeholder="Channel name"
                className="w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />

              

              <button
                onClick={nextStep}
                disabled={!channelName}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg font-medium disabled:bg-gray-600"
              >
                Continue <IoIosArrowForward size={20} />
              </button>
              <span onClick={()=>navigate("/")} className=" w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline  mt-2">Back to Home Page</span>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Your Channel</h2>
              <div className="flex flex-col items-center mb-6">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="avatar"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                    <FaUserCircle size={40} />
                  </div>
                )}
                <h3 className="mt-3 text-lg font-semibold">{channelName}</h3>
              
              </div>

              <div className="flex gap-3">
                <button
                  onClick={nextStep}
                  className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg"
                >
                Continue and Create Channel <IoIosArrowForward size={20} />
                </button>
                
              </div>

              <button
                onClick={prevStep}
                className="mt-4 w-full flex items-center justify-center text-blue-400 hover:underline text-sm"
              >
                Back
              </button>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Create Channel</h2>

              {/* Banner Upload */}
              <label
                htmlFor="banner-upload"
                className="cursor-pointer block mb-4"
              >
                {banner ? (
                  <img
                    src={URL.createObjectURL(banner)}
                    alt="banner"
                    className="w-full h-32 object-cover rounded-lg mb-2 border border-gray-700"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 mb-2">
                    Click to upload banner
                  </div>
                )}
                <span className="text-blue-400">Upload Banner Image</span>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </label>

              {/* Description */}
              <textarea
                placeholder="Channel description"
                className="w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Category */}
              <input
                className="w-full p-3 mb-6 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                placeholder="Category"
                onChange={(e) => setCategory(e.target.value)}
              />
                
              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-700 hover:bg-gray-600 py-3 px-5 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateChannel}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 py-3 px-5 rounded-lg"
                >
                {loading ? <ClipLoader size={20} color="white"/>:"Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateChannelFlow;