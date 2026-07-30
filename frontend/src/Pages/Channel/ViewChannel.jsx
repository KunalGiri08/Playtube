import React from 'react'
import { useSelector } from 'react-redux'
import create from "../assets/create.png"
import { useNavigate } from 'react-router-dom'

function ViewChannel() {
    const {userData} = useSelector(state=>state.user)
    const {channelData} = useSelector(state=>state.user)
    const navigate = useNavigate()
  return (
    <div className=" flex flex-col gap-3 ">
      {/* Banner */}
      <div className="w-full h-50 bg-gray-700 relative mb-10 mt-10 rounded-lg border-1 border-gray-500 ">
        {channelData?.bannerImage ? (
          <img
            src={channelData?.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900"></div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-10 py-8">
        {/* Avatar + Info */}
        <div className="flex flex-col items-center">
          <img
            src={channelData?.avatar || "/default-avatar.png"}
            alt="Channel Avatar"
            className="w-28 h-28 rounded-full object-cover -mt-14 border-4 border-gray-500"
          />
          <h1 className="text-2xl font-bold mt-3">{channelData?.name || "Channel Name"}</h1>
          <p className="text-gray-400">@{ userData?.username}</p>
          <p className="text-sm text-gray-400 mt-1">
            More about this channel... <span className="text-blue-400 cursor-pointer">{userData?.channel?.category}</span>
          </p>
          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-white text-black px-4 py-1 rounded-full font-medium" onClick={()=>navigate("/updatechannel")}>
              Customize channel
            </button>
            <button className="bg-[#272727] px-4 py-1 rounded-full font-medium" onClick={()=>navigate("/ptstudio/dashboard")}>
              Manage videos
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center mt-16">
          <img src={create} alt="Create" className="w-20" />
          <p className="mt-4 font-medium">Create content on any device</p>
          <p className="text-gray-400 text-sm text-center">
            Upload and record at home or on the go. Everything you make public will appear here.
          </p>
          <button className="bg-white text-black mt-4 px-5 py-1 rounded-full font-medium" onClick={()=>navigate("/createpage")}>
            + Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewChannel