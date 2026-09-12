import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommunityCard from "../../component/CommunityCard";
import PlaylistCard from "../../component/PlaylistCard";
import ShortsCard from "../../component/ShortCard";
import VideoCard from "../../component/VideoCard";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";

export default function ChannelPage() {
  const { channelId } = useParams();
  const { allChannelData, userData } = useSelector((state) => state.user);
  const { allPostData } = useSelector((state) => state.content)

  const channelData = allChannelData?.find((ch) => ch._id === channelId);

  const [channel, setChannel] = useState(channelData || null);
  const [activeTab, setActiveTab] = useState("Videos");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (channelData) {
      setChannel(channelData);
    } else if (channelId) {
      axios
        .get(`${serverUrl}/api/user/getallchannel`, { withCredentials: true })
        .then((res) => {
          if (Array.isArray(res.data)) {
            const found = res.data.find((c) => c._id === channelId);
            if (found) setChannel(found);
          }
        })
        .catch((err) => console.error("Error fetching channel:", err));
    }
  }, [channelData, channelId]);

  if (!channel) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-300">
        Loading channel...
      </div>
    );
  }

  // ✅ Handle Subscribe / Unsubscribe
  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        serverUrl + "/api/user/subscribe",
        { channelId: channel._id },
        { withCredentials: true }
      );
      console.log(res.data)
      setLoading(false)
      // ✅ Agar API sirf subscribers return kar rahi hai
      if (res.data?.subscribers) {
        setChannel((prev) => ({
          ...prev,
          subscribers: res.data.subscribers,
        }));
      }
      // Agar API pura channel object return karti hai
      else if (res.data?._id) {
        setChannel(res.data);
        setLoading(false)
      }

    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };



  useEffect(() => {
    if (channel?.subscribers && userData?._id) {
      setIsSubscribed(
        channel.subscribers.some(
          (sub) =>
            (sub?._id ? sub._id.toString() : sub?.toString()) ===
            userData._id.toString()
        )
      );
    } else {
      setIsSubscribed(false);
    }
  }, [channel?.subscribers, userData?._id]);


  return (
    <div className=" text-white min-h-screen pt-[10px]">
      {/* Banner */}
      <div className="relative">
        <img
          src={channel.bannerImage || "https://via.placeholder.com/1200x300"}
          alt="Channel Banner"
          className="w-full h-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Channel Info */}
      <div className="relative flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl flex-wrap">
        {/* Avatar */}
        <div className="relative">
          <img
            src={channel.avatar}
            alt="Channel Logo"
            className="rounded-full w-28 h-28 border-4 border-gray-800 shadow-lg hover:scale-105 hover:ring-4 hover:ring-red-600 transition-transform duration-300"
          />
        </div>

        {/* Channel Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-wide">
            {channel.name}
          </h1>
          <p className="text-gray-400 mt-1">
            <span className="font-semibold text-white">
              {channel.subscribers?.length || 0}
            </span>{" "}
            subscribers ·{" "}
            <span className="font-semibold text-white">
              {channel.videos?.length || 0}
            </span>{" "}
            videos
          </p>
          <p className="text-gray-300 text-sm mt-2 line-clamp-2">
            {channel.category}
          </p>
        </div>

        {/* ✅ Subscribe Button */}
        <button
          onClick={handleSubscribe}
          className={`px-6 py-2 rounded-full shadow-md border font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95
    ${isSubscribed
              ? "bg-gray-800 text-white border-gray-600 hover:bg-orange-600 hover:text-black"
              : "bg-white text-black border-gray-700 hover:bg-black hover:text-white"
            }`}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="gray" /> : isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 px-6 border-b border-gray-800 mb-6 relative">
        {["Videos", "Shorts", "Playlists", "Community"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 relative font-medium transition ${activeTab === tab
              ? "text-white"
              : "text-gray-400 hover:text-white"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="px-6 space-y-8 ">
        {activeTab === "Videos" && (
          <div className="flex flex-wrap gap-5 pb-[40px]">
            {channel.videos?.map((v) => (
              <VideoCard
                key={v._id}
                id={v._id}
                thumbnail={v.thumbnail}
                duration={v.duration}
                channelLogo={channel.avatar}
                title={v.title}
                channelName={channel.name}
                views={v.views}
              />
            ))}
          </div>
        )}

        {activeTab === "Shorts" && (
          <div className="flex gap-4 flex-wrap">
            {channel.shorts?.map((short) => (
              <ShortsCard
                key={short._id}
                id={short._id}
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={channel.name}
                views={short.views}
                avatar={channel.avatar}
              />
            ))}
          </div>
        )}

        {activeTab === "Playlists" && (
          <div className="flex gap-5 flex-wrap">
            {channel.playlists?.map((p) => (
              <PlaylistCard
                key={p._id}
                id={p._id}
                title={p.title}
                videos={p.videos}
                savedBy={p.saveBy}
              />
            ))}
          </div>
        )}

        {activeTab === "Community" && (
          <div className="flex items-center justify-start gap-9 flex-wrap">
            {allPostData
              ?.filter((post) => {
                const pChanId = post.channel?._id ? post.channel._id.toString() : post.channel?.toString();
                return pChanId === channelId;
              })
              .map((post) => (
                <CommunityCard
                  key={post._id}
                  post={post}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}