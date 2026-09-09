import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "./VideoCard"; // your card component

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

const AllVideosPage = () => {
  // ✅ Access only the array
  const allVideoData = useSelector(
    (state) => state.content.allVideoData
  ) || [];

  const [durations, setDurations] = useState({});

  // Get duration for each video
  useEffect(() => {
    if (Array.isArray(allVideoData) && allVideoData.length > 0) {
      allVideoData.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDurations((prev) => ({
            ...prev,
            [video._id]: formattedTime,
          }));
        });
      });
    }
  }, [allVideoData]);

  return (
    <div className="flex flex-wrap gap-6 mb-12">
      {allVideoData?.map((video) => (
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
  );
};

export default AllVideosPage;