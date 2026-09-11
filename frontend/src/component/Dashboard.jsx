import React from "react";
import { useSelector } from "react-redux";
import {
  FaEye,
 
  FaThumbsUp,
  FaComment,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { channelData } = useSelector((state) => state.user);
  const {contentRevenue} = useSelector((state)=>state.content)
  const navigate = useNavigate()


  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading channel data...
      </div>
    );
  }

  const totalVideoViews = (channelData.videos || []).reduce(
    (acc, vid) => acc + (vid.views || 0),
    0
  );
  const totalShortViews = (channelData.shorts || []).reduce(
    (acc, short) => acc + (short.views || 0),
    0
  );
  const totalViews = totalVideoViews + totalShortViews;

  return (
    <div className="w-full  text-white min-h-screen p-4 sm:p-6 space-y-6 mb-[50px]">
      {/* -------- Channel Info -------- */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        <img
          src={channelData.avatar}
          alt="channel avatar"
          className="w-16 h-16 rounded-full object-cover border border-gray-700"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold">{channelData.name}</h2>
          <p className="text-gray-400 text-sm">
            {channelData.subscribers?.length || 0} Total subscribers
          </p>
        </div>
      </div>

      {/* -------- Channel Analytics -------- */}
      <div>
        <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
          Channel Analytics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <AnalyticsCard
            
            label="Views"
            value={totalViews || "0"}
            onClick={()=>navigate("/ptstudio/analytics")}
          />
          <AnalyticsCard
            
            label="Subscribers"
            value={`+${channelData.subscribers?.length || 0}`}
          />
          <AnalyticsCard
           
            label="Estimated revenue"
            value={`+${contentRevenue || 0}`}
            onClick={()=>navigate("/ptstudio/revenue")}
          />
        </div>
      </div>

      {/* -------- Latest Videos & Shorts -------- */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Videos */}
  <div>
    {channelData?.videos?.length > 0 && (
      <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
        Latest Videos
      </h3>
    )}
    <div className="space-y-4">
      {(channelData.videos || [])
        .slice()
        .reverse()
        .slice(0, 5)
        .map((video, idx) => (
          <ContentCard key={idx} content={video} onClick={()=>navigate(`/watch-video/${video._id}`)} />
        ))}
    </div>
  </div>

  {/* Shorts */}
  <div>
    {channelData?.shorts?.length > 0 && (
      <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
        Latest Shorts
      </h3>
    )}
    <div className="space-y-4">
      {(channelData.shorts || [])
        .slice()
        .reverse()
        .slice(0, 5)
        .map((short, idx) => (
          <ContentCard1 key={idx} content={short} onClick={()=>navigate(`/watch-short/${short._id}`)} />
        ))}
    </div>
  </div>
</div>

{/* Shorts */}

    </div>
  );
}

function AnalyticsCard({  label, value , onClick }) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 shadow hover:shadow-lg transition" onClick={onClick}>
      <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-2">
       {label}
      </div>
      <h4 className="text-lg sm:text-xl text-start font-bold">{value}</h4>
    </div>
  );
}

const formatDate = (dateValue) => {
  if (!dateValue) return "Recently";
  const d = new Date(dateValue);
  return isNaN(d.getTime()) ? "Recently" : d.toLocaleDateString();
};

function ContentCard({ content, isShort = false , onClick  }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-[#202020] transition cursor-pointer" onClick={onClick}>
      {/* Thumbnail */}
      <img
        src={content.thumbnail}
        alt={content.title || "Video thumbnail"}
        className={`${
          isShort ? "w-full sm:w-28 h-48 sm:h-40" : "w-full sm:w-40 h-48 sm:h-24"
        } rounded-lg object-cover`}
      />

      {/* Content Info */}
      <div className="flex-1">
        <div className="w-[100%] flex flex-col items-start justify-center gap-2"><h4 className="font-semibold text-sm sm:text-base line-clamp-2">
          {content.title || "Untitled Video"}
        </h4>
        <p className="text-xs text-gray-400 mt-1">
          Published {formatDate(content.createdAt)}
        </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-2 text-gray-300 text-sm">
          <span className="flex items-center gap-1">
            <FaEye /> {content.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaThumbsUp /> {content.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment /> {content.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContentCard1({ content , onClick }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-[#202020] transition cursor-pointer" onClick={onClick}>
      {/* Thumbnail */}
       <video
          src={content.shortUrl}
          className="w-20 h-24 object-cover rounded"
          muted
          playsInline
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
        />

      {/* Content Info */}
      <div className="flex-1">
        <div className="w-[100%] flex flex-col items-start justify-center gap-2"><h4 className="font-semibold text-sm sm:text-base line-clamp-2">
          {content.title || "Untitled Short"}
        </h4>
        <p className="text-xs text-gray-400 mt-1">
          Published {formatDate(content.createdAt)}
        </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-2 text-gray-300 text-sm">
          <span className="flex items-center gap-1">
            <FaEye /> {content.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaThumbsUp /> {content.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment /> {content.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;