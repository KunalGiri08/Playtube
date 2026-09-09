import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortCard";
import logo from "../assets/playtube1.png";
import { useNavigate } from "react-router-dom";

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

const SubscribePage = () => {
  const { subscribeChannel, subscribeVideo, subscribeShort } =
    useSelector((state) => state.user) || {};

  const [durations, setDurations] = useState({});
  const navigate = useNavigate()

  // Step 1: get video durations
  useEffect(() => {
    if (Array.isArray(subscribeVideo) && subscribeVideo.length > 0) {
      subscribeVideo.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDurations((prev) => ({
            ...prev,
            [video._id]: formattedTime,
          }));
        });
      });
    }
  }, [subscribeVideo]);

  return (
    <div className="px-6 py-4 min-h-screen">

      {/* 🔥 Subscribed Channels (avatars in circle) */}
     
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide pt-[30px]">
        {subscribeChannel?.length > 0 ? (
          subscribeChannel.map((ch) => (
            <div
              key={ch._id}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200" onClick={()=>navigate(`/channelpage/${ch._id}`)}
            >
              <img
                src={ch.avatar}
                alt={ch.name}
                className="w-20 h-20 rounded-full border-2 border-gray-600 object-cover shadow-md"
              />
              <span className="mt-2 text-sm text-gray-300 font-medium text-center truncate w-20">
                {ch.name}
              </span>
            </div>
          ))
        ) : (
          <p>No subscribed channels found.</p>
        )}
      </div>

      {/* Shorts Section */}
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
        <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
        Subscribed Shorts
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {subscribeShort?.length > 0 ? (
          subscribeShort.map((short) => (
            <div key={short._id} className="flex-shrink-0">
              <ShortsCard
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={short.channel?.name}
                views={short.views}
                id={short?._id}
                avatar={short.channel?.avatar}
              />
            </div>
          ))
        ) : (
          <p>No subscribed shorts found.</p>
        )}
      </div>

      {/* Videos Section */}
      <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
        <img src={logo} className="w-7 h-7" alt="" />
        Subscribed Videos
      </h2>
      <div className="flex flex-wrap gap-6 mb-12">
        {subscribeVideo?.length > 0 ? (
          subscribeVideo.map((video) => (
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
          <p>No subscribed videos found.</p>
        )}
      </div>
    </div>
  );
};

export default SubscribePage;