// src/pages/HistoryPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortCard";
import logo from "../assets/playtube1.png";

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

const HistoryPage = () => {
  const { videoHistory, shortHistory } = useSelector((state) => state.user) || {};
  const [durations, setDurations] = useState({});

  // ✅ calculate durations for videos
  useEffect(() => {
    if (Array.isArray(videoHistory) && videoHistory.length > 0) {
      videoHistory.forEach((item) => {
        const video = item.contentId; // ✅ actual video object
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDurations((prev) => ({
            ...prev,
            [video._id]: formattedTime,
          }));
        });
      });
    }
  }, [videoHistory]);

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px]">
      <h1 className="text-3xl font-bold text-white mb-8">Watch History</h1>

      {/* Shorts History */}
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
        <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
        Shorts History
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {shortHistory?.length > 0 ? (
          shortHistory.map((item) => {
            const short = item.contentId; // ✅ actual short object
            return (
              <div key={item._id} className="flex-shrink-0">
                <ShortsCard
                  shortUrl={short.shortUrl}
                  title={short.title}
                  channelName={short.channel?.name}
                  views={short.views}
                  id={short._id}
                  avatar={short.channel?.avatar}
                />
              </div>
            );
          })
        ) : (
          <p>No shorts watched yet.</p>
        )}
      </div>

      {/* Video History */}
      <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
        <img src={logo} className="w-7 h-7" alt="" />
        Video History
      </h2>
      <div className="flex flex-wrap gap-6 mb-12">
        {videoHistory?.length > 0 ? (
          videoHistory.map((item) => {
            const video = item.contentId; // ✅ actual video object
            return (
              <VideoCard
                key={item._id}
                thumbnail={video.thumbnail}
                duration={durations[video._id] || "0:00"}
                channelLogo={video.channel?.avatar}
                title={video.title}
                channelName={video.channel?.name}
                views={`${video.views}`}
                time={new Date(video.createdAt).toLocaleDateString()}
                id={video._id}
              />
            );
          })
        ) : (
          <p>No videos watched yet.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;