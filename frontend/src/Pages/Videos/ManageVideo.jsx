import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { MdDelete, MdSaveAlt } from "react-icons/md";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../component/CustomAlert";
import { setAllVideoData } from "../../redux/contentSlice";
import { setChannelData } from "../../redux/userSlice";

const ManageVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allVideoData } = useSelector((state) => state.content);
  const { channelData } = useSelector((state) => state.user);

  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch video details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/content/fetch-video/${videoId}`, {
          withCredentials: true,
        });
        setVideo(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || "");
        setTags(res.data.tags.join(", "));
      } catch (error) {
        showCustomAlert(error.response?.data?.message || "Failed to load video");
        navigate("/");
      }
    };
    fetchVideo();
  }, [videoId, navigate]);

  // Update Video
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim())));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const result = await axios.put(
        `${serverUrl}/api/content/update-video/${videoId}`,
        formData,
        { withCredentials: true }
      );

      // update redux
      const updatedVideos = (allVideoData || []).map((v) =>
        v._id === videoId ? result.data.video : v
      );
      dispatch(setAllVideoData(updatedVideos));

      if (channelData?.videos) {
        const updatedChannelVideos = channelData.videos.map((v) =>
          v._id === videoId ? result.data.video : v
        );
        dispatch(setChannelData({ ...channelData, videos: updatedChannelVideos }));
      }

      showCustomAlert("Video updated successfully");
      
    } catch (error) {
      showCustomAlert(error.response?.data?.message || "Update failed");
    }
    setLoading(false);
  };

  // Delete Video
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/api/content/delete-video/${videoId}`, {
        withCredentials: true,
      });

      // remove from redux
      dispatch(setAllVideoData((allVideoData || []).filter((v) => v._id !== videoId)));

      if (channelData?.videos) {
        const updatedChannelVideos = channelData.videos.filter((v) => v._id !== videoId);
        dispatch(setChannelData({ ...channelData, videos: updatedChannelVideos }));
      }

      showCustomAlert("Video deleted successfully");
      navigate("/ptstudio/content");
    } catch (error) {
      showCustomAlert(error.response?.data?.message || "Delete failed");
    }
    setLoading(false);
  };

  if (!video) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#0f0f0f] text-white">
        <ClipLoader size={35} color="white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white px-4 py-6 flex justify-center">
      <div className="w-full max-w-2xl bg-[#212121] rounded-2xl shadow-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">Manage Video</h2>

        {/* Video Preview */}
       

        {/* Title */}
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Description */}
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows="4"
        />

        {/* Tags */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Thumbnail Upload */}
        <label className="block cursor-pointer">
          <p className="mb-2 text-gray-300">Thumbnail</p>
          {thumbnail ? (
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="thumbnail"
              className="w-full rounded-lg border border-gray-700 mb-2"
            />
          ) : video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt="thumbnail"
              className="w-full rounded-lg border border-gray-700 mb-2"
            />
          ) : (
            <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 mb-2">
              Click to upload thumbnail
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:bg-gray-600"
          >
            {loading ? <ClipLoader size={20} color="white" /> : <MdSaveAlt size={20} />}
            {loading ? "Saving..." : "Update Video"}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:bg-gray-600"
          >
            <MdDelete size={20} />
            Delete Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageVideo;