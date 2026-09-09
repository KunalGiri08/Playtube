import React, { useEffect, useState } from "react";
import axios from "axios";
import { SiYoutubeshorts } from "react-icons/si";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortsCard";
import logo from "../assets/playtube1.png";
import { serverUrl } from "../App";

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

const LikedContentPage = () => {
  const [likedShorts, setLikedShorts] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedContent = async () => {
      try {
        // ✅ Fetch Liked Shorts
        const shortsRes = await axios.get(`${serverUrl}/api/content/likedshorts`, {
          withCredentials: true,
        });
        setLikedShorts(shortsRes.data || []);

        // ✅ Fetch Liked Videos
        const videosRes = await axios.get(`${serverUrl}/api/content/likedvideos`, {
          withCredentials: true,
        });
        setLikedVideos(videosRes.data || []);

        // ✅ Calculate duration for each liked video
        if (Array.isArray(videosRes.data)) {
          videosRes.data.forEach((video) => {
            getVideoDuration(video.videoUrl, (formattedTime) => {
              setDurations((prev) => ({
                ...prev,
                [video._id]: formattedTime,
              }));
            });
          });
        }
      } catch (error) {
        console.error("Error fetching liked content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedContent();
  }, []);

  if (loading) {
    return <p className="p-6">Loading liked content...</p>;
  }

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px]">

      {/* Shorts Section */}
      {likedShorts.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-red-600" />
            Liked Shorts
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {likedShorts.map((short) => (
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
            ))}
          </div>
        </>
      )}

      {/* Videos Section */}
      {likedVideos.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <img src={logo} className="w-7 h-7" alt="" />
            Liked Videos
          </h2>
          <div className="flex flex-wrap gap-6 mb-12">
            {likedVideos.map((video) => (
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
            ))}
          </div>
        </>
      )}

      {/* ✅ If nothing liked at all */}
      {likedShorts.length === 0 && likedVideos.length === 0 && (
        <p className="mt-10 text-lg">You haven't liked any videos or shorts yet.</p>
      )}
    </div>
  );
};

export default LikedContentPage;