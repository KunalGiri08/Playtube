import { useEffect, useState } from "react";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortsCard";
import PlaylistCard from "../component/PlaylistCard";
import ChannelCard from "../component/ChannelCard"; 

// ✅ Helper function to get duration
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

const SearchResults = ({ searchResults }) => {
  const [durations, setDurations] = useState({});

  useEffect(() => {
    if (searchResults?.videos?.length > 0) {
      searchResults.videos.forEach((video) => {
        if (!durations[video._id]) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDurations((prev) => ({
              ...prev,
              [video._id]: formattedTime,
            }));
          });
        }
      });
    }
  }, [searchResults]);

  // ✅ Agar sab empty hai
  const isEmpty =
    (!searchResults?.videos || searchResults.videos.length === 0) &&
    (!searchResults?.shorts || searchResults.shorts.length === 0) &&
    (!searchResults?.channels || searchResults.channels.length === 0) &&
    (!searchResults?.playlists || searchResults.playlists.length === 0);

  return (
    <div className="px-6 py-4 bg-[#00000051] border-1 border-gray-800 mb-[20px]">
      <h1 className="text-2xl font-bold mb-4">Search Results :</h1>

      {isEmpty ? (
        <p className="text-gray-400 text-lg">No results found.</p>
      ) : (
        <>
          {/* Channels Section */}
          {searchResults.channels?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.channels.map((ch) => (
                  <ChannelCard
                    key={ch._id}
                    id={ch._id}
                    name={ch.name}
                    avatar={ch.avatar}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {searchResults.videos?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Videos</h3>
              <div className="flex flex-wrap gap-6 mb-12">
                {searchResults.videos.map((video) => (
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
            </div>
          )}

          {/* Shorts Section */}
          {searchResults.shorts?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Shorts</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {searchResults.shorts.map((short) => (
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
            </div>
          )}

          {/* Playlists Section */}
          {searchResults.playlists?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Playlists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.playlists.map((pl) => (
                  <PlaylistCard
                    key={pl._id}
                    id={pl._id}
                    title={pl.title}
                    videos={pl.videos}
                    savedBy={pl.saveBy}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;