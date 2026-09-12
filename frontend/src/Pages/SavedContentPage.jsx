import React, { useEffect, useState } from "react";
import axios from "axios";
import { SiYoutubeshorts } from "react-icons/si";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortCard";
import logo from "../assets/playtube1.png";
import { serverUrl } from "../App";
// ✅ apna serverUrl import karna

// Helper to get duration
const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = url;
  video.onloadedmetadata = () => {
    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };
  video.onerror = () => {
    callback("0:00");
  };
};

const SavedContentPage = () => {
  const [savedShorts, setSavedShorts] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        const [shortsResult, videosResult] = await Promise.allSettled([
          axios.get(`${serverUrl}/api/content/saveshorts`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/content/savevideos`, { withCredentials: true }),
        ]);

        const shortsData =
          shortsResult.status === "fulfilled" && Array.isArray(shortsResult.value?.data)
            ? shortsResult.value.data
            : [];
        setSavedShorts(shortsData);

        const videosData =
          videosResult.status === "fulfilled" && Array.isArray(videosResult.value?.data)
            ? videosResult.value.data
            : [];
        setSavedVideos(videosData);

        // ✅ video duration calculate karo
        videosData.forEach((video) => {
          if (video?.videoUrl) {
            getVideoDuration(video.videoUrl, (formattedTime) => {
              setDurations((prev) => ({
                ...prev,
                [video._id]: formattedTime,
              }));
            });
          }
        });
      } catch (error) {
        console.error("Error fetching saved content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedContent();
  }, []);

  if (loading) {
    return <p className="p-6">Loading saved content...</p>;
  }

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px]">
      {/* Shorts Section */}
      <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
        <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
        Saved Shorts
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {savedShorts.length > 0 ? (
          savedShorts.map((short) => (
            <div key={short._id} className="flex-shrink-0">
              <ShortsCard
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={short.channel?.name}
                views={short.views}
                id={short._id}
                avatar={short.channel?.avatar}
              />
            </div>
          ))
        ) : (
          <p>No saved shorts found.</p>
        )}
      </div>

      {/* Videos Section */}
      <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
        <img src={logo} className="w-7 h-7" alt="" />
        Saved Videos
      </h2>
      <div className="flex flex-wrap gap-6 mb-12">
        {savedVideos.length > 0 ? (
          savedVideos.map((video) => (
            <VideoCard
              key={video._id}
              thumbnail={video.thumbnail}
              duration={durations[video._id] || "0:00"}
              channelLogo={video.channel?.avatar}
              title={video.title}
              channelName={video.channel?.name}
              views={`${video.views}`}
              time={new Date(video.createdAt).toLocaleDateString()}
              id={video._id}
            />
          ))
        ) : (
          <p>No saved videos found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedContentPage;