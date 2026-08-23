import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import { setChannelData } from "../redux/userSlice";

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {videoData} = useSelector(state=>state.content)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
 

  
  
  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleCreatePlaylist = async () => {
    if (!title) {
      showCustomAlert("Playlist title is required!");
      return;
    }
    if (selectedVideos.length === 0) {
      showCustomAlert("Please select at least one video");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/create-playlist`,
        {
          title,
          description,
          channelId: channelData._id,
          videoIds: selectedVideos,
        },
        { withCredentials: true }
      );

      // Update Redux channel data with new playlist
      const updatedChannel = {
        ...channelData,
        playlists: [...(channelData.playlists || []), res.data.playlist],
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Playlist created successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Failed to create playlist");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-start px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* Playlist Title */}
          <input
            type="text"
            placeholder="Playlist Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Playlist Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Video Selection */}
          <div>
            <p className="mb-3 text-lg font-semibold">Select Videos</p>
            
           {videoData?.length === 0 ? (
              <p className="text-gray-400 text-sm">No videos found for this channel</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
                {videoData?.map((video) => (
                  <div
                    key={video._id}
                    onClick={() => toggleVideoSelect(video._id)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedVideos.includes(video._id)
                        ? "border-blue-500"
                        : "border-gray-700"
                    }`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-28 object-cover"
                    />
                    <p className="p-2 text-sm truncate">{video.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create Playlist Button */}
          <button
            onClick={handleCreatePlaylist}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Create Playlist"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePlaylist;