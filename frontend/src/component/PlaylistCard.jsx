import React, { useState } from "react";
import { FaPlay, FaListUl, FaTimes, FaBookmark } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App"; // ✅ jaha se serverUrl import kar rahe ho
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";

export default function PlaylistCard({ id, title, videos, savedBy }) {
  const { userData } = useSelector((state) => state.user);
  const [showVideos, setShowVideos] = useState(false);
  const [isSaved, setIsSaved] = useState(
    savedBy?.some((uid) => uid.toString() === userData?._id?.toString()) || false
  );

  
  const [loading, setLoading] = useState(false);

  const thumbnail = videos[0]?.thumbnail;

  // ✅ Save/Unsave handler
  const handleToggleSave = async () => {
    if (!userData?._id) return alert("Please login to save playlists");
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/playlist/toggle-save`,
        { playlistId: id },
        { withCredentials: true }
      );

      console.log("Save toggle response:", res.data);

      // Agar current user saved list me hai to isSaved true, warna false
      const saved = res.data.saveBy?.some(
        (uid) => uid.toString() === userData._id.toString()
      );
      setIsSaved(saved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Playlist Card */}
      <div className="relative w-60 h-40 rounded-xl overflow-hidden group shadow-lg bg-gray-900">
        {/* Playlist Thumbnail */}
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-3">
          <h3 className="font-semibold text-white truncate">{title}</h3>
          <p className="text-sm text-gray-300">{videos.length} videos</p>
        </div>

        {/* ✅ Save Icon (top-right) */}
        <button
          onClick={handleToggleSave}
          disabled={loading}
          className={`absolute top-2 right-2 p-2 rounded-full transition border-1 border-gray-700 ${
            isSaved
              ? "bg-white text-black hover:bg-gray-300"
              : "bg-black/70 text-white hover:bg-black"
          }`}
        >
          <FaBookmark size={16} />
        </button>

        {/* Playlist Icon Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowVideos(true);
          }}
          className="absolute bottom-2 right-2 bg-black/70 p-2 rounded-full text-white hover:bg-black transition"
        >
          <FaListUl size={16} />
        </button>
      </div>

      {/* Modal for playlist videos */}
      {showVideos && (
        <div className="fixed inset-0 bg-[#00000032] flex justify-center items-center z-50 backdrop-blur-sm ">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative border border-gray-700">
            {/* Close Button */}
            <button
              onClick={() => setShowVideos(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <FaTimes size={24} />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-extrabold mb-3 text-white flex items-center gap-2">
              {title} <span className="text-gray-400 font-normal">– Videos</span>
            </h2>
            <div className="h-[2px]  bg-red-600 mb-6 rounded-full"></div>

            {/* Videos Grid */}
            <div className="flex items-center justify-around gap-5 flex-wrap">
              {videos.map((v, index) => (
                <VideoCard
                  key={v._id || `${id}-${index}`} // ✅ fallback key
                  id={v._id}
                  thumbnail={v.thumbnail}
                  duration={v.duration}
                  channelLogo={v.channel?.avatar}
                  title={v.title}
                  channelName={v.channel?.name}
                  views={v.views}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}