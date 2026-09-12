import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../component/CustomAlert";
import { setChannelData } from "../../redux/userSlice";

const ManagePlaylist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);
  const { videoData } = useSelector((state) => state.content);

  const [playlist, setPlaylist] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch playlist details
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/content/fetch-playlist/${playlistId}`,
          { withCredentials: true }
        );
        setPlaylist(res.data.playlist);
        setTitle(res.data.playlist.title);
        setDescription(res.data.playlist.description);
        setSelectedVideos(res.data.playlist.videos.map((v) => v._id));
      } catch (error) {
        console.error(error);
        showCustomAlert("Failed to load playlist");
      }
    };
    fetchPlaylist();
  }, [playlistId]);

  // Toggle video selection
  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  // Update Playlist
  // Update Playlist
const handleUpdate = async () => {
  if (!title) {
    showCustomAlert("Playlist title is required!");
    return;
  }

  setLoading(true);
  try {
    // Find difference between old playlist.videos and new selectedVideos
    const currentVideos = playlist.videos.map((v) => v._id.toString());
    const newVideos = selectedVideos.map((v) => v.toString());

    const addVideos = newVideos.filter((id) => !currentVideos.includes(id));
    const removeVideos = currentVideos.filter((id) => !newVideos.includes(id));

    const res = await axios.put(
      `${serverUrl}/api/content/update-playlist/${playlistId}`,
      {
        title,
        description,
        addVideos,
        removeVideos,
      },
      { withCredentials: true }
    );

    // Update Redux channelData
    const updatedPlaylists = channelData.playlists.map((p) =>
      p._id === playlistId ? res.data.playlist : p
    );
    dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));

    showCustomAlert("Playlist updated successfully");
    
  } catch (error) {
    console.error(error);
    showCustomAlert(error.response?.data?.message || "Failed to update playlist");
  }
  setLoading(false);
};

  // Delete Playlist
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;

    setLoading(true);
    try {
      await axios.delete(
        `${serverUrl}/api/content/delete-playlist/${playlistId}`,
        { withCredentials: true }
      );

      // Remove playlist from Redux
      const updatedPlaylists = (channelData?.playlists || []).filter(
        (p) => p._id !== playlistId
      );
      dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));

      showCustomAlert("Playlist deleted successfully");
      navigate("/ptstudio/content");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Failed to delete playlist");
    }
    setLoading(false);
  };

  if (!playlist) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-300">
        Loading playlist...
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-start px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* Title */}
          <input
            type="text"
            placeholder="Playlist Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Video Selection */}
          <div>
            <p className="mb-3 text-lg font-semibold ">Select Videos</p>
            {videoData?.length === 0 ? (
              <p className="text-gray-400 text-sm">No videos found for this channel</p>
            ) : (
              
              <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto ">
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

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Update Playlist"}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            >
              Delete Playlist
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagePlaylist;