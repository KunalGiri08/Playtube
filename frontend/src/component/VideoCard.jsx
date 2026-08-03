import React from "react";
import { useNavigate } from "react-router-dom";
  




const VideoCard = ({ thumbnail, duration, channelLogo, title, channelName, views,id }) => {
  const navigate = useNavigate()


   
  return (
    <div className="w-[360px] cursor-pointer" onClick={()=>navigate(`/watch-video/${id}`)}>
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="rounded-xl w-full h-[200px] border-1 border-gray-800 object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 rounded">
          {duration}
        </span>
      </div>

      {/* Info */}
      <div className="flex mt-3">
        {/* Channel Logo */}
        <img
          src={channelLogo}
          alt={channelName}
          className="w-10 h-10 rounded-full mr-3"
        />

        {/* Text Content */}
        <div>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{channelName}</p>
          <p className="text-xs text-gray-400">
           {
              Number(views) >= 1_000_000
                ? Math.floor(Number(views) / 1_000_000) + "M"
                : Number(views) >= 1_000
                ? Math.floor(Number(views) / 1_000) + "K"
                : Number(views) || 0
            } views
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;