import React, { Children, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute,
  FaExpand, FaThumbsUp, FaThumbsDown, FaDownload, FaBookmark,
} from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import { serverUrl } from "../App";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Description from "../component/Description";
import ShortsCard from "../component/ShortsCard";

const IconButton = ({ icon: Icon, active, label, count, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center">
    <div
      className={`${active ? "bg-white" : "bg-[#00000065] border border-gray-700"
        } p-3 rounded-full hover:bg-gray-700 transition`}
    >
      <Icon size={20} className={`${active ? "text-black" : "text-white"}`} />
    </div>
    <span className="text-xs mt-1">{label}{count !== undefined && ` (${count})`}</span>
  </button>
);

const WatchVideoPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { allVideoData, allShortData , recommendationData } = useSelector((state) => state.content);
  const { userData } = useSelector((state) => state.user);
   const allVideos = [
    ...(recommendationData?.recommendedVideos || []),
    ...(recommendationData?.remainingVideos || []),
  ];

  const allShorts = [
    ...(recommendationData?.recommendedShorts || []),
    ...(recommendationData?.remainingShorts || []),
  ];
   

  const suggestedVideos = allVideos?.filter((v) => v._id !== videoId).slice(0, 10) || [];
  const suggestedShorts = allShorts?.slice(0, 10) || [];

  const videoRef = useRef(null);
  const [video, setVideo] = useState(null); // API se video data
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [channel, setChannel] = useState("")
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(
    channel?.subscribers?.some(
      (sub) => sub._id?.toString() === userData?._id?.toString() || sub?.toString() === userData?._id?.toString()
    )
  );


  useEffect(() => {
    if (!videoId || !allVideoData) return;

    // Redux me se current video nikal lo
    const currentVideo = allVideoData.find((v) => v._id === videoId);
    if (currentVideo) {
      setVideo(currentVideo);
      setChannel(currentVideo.channel || [])
      setComments(currentVideo.comments || []);
    }

    // ✅ view count update karo
    axios.put(`${serverUrl}/api/content/video/${videoId}/add-view`, {}, { withCredentials: true })
      .then(res => {
        setVideo((prev) => prev ? { ...prev, views: res.data.views } : prev);
      })
      .catch(err => console.error(err));

  }, [videoId, allVideoData]);


  // Video Controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
  };

  const skipForward = () => { if (videoRef.current) videoRef.current.currentTime += 10; };
  const skipBackward = () => { if (videoRef.current) videoRef.current.currentTime -= 10; };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) videoRef.current.volume = vol;
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleFullScreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // --- Action APIs ---
  const handleLike = async () => {
    try {
      const res = await axios.put(`${serverUrl}/api/content/video/${videoId}/toggle-like`, {}, { withCredentials: true });
      setVideo(res.data);
      console.log(res.data)
    } catch (err) { console.error(err); }
  };

  const handleDislike = async () => {
    try {
      const res = await axios.put(`${serverUrl}/api/content/video/${videoId}/toggle-dislike`, {}, { withCredentials: true });
      setVideo(res.data);
      console.log(res.data)
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${serverUrl}/api/content/video/${videoId}/toggle-save`, {}, { withCredentials: true });
      setVideo(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubscribe = async () => {
  if (!channel?._id) return;
  setLoading(true);
  try {
    const res = await axios.post(`${serverUrl}/api/user/subscribe`, { channelId: channel._id }, { withCredentials: true });
    // Update channel's subscribers
    setChannel((prev) => ({
      ...prev,
      subscribers: res.data.subscribers || prev.subscribers,
    }));
    setLoading(false);
  } catch (err) {
    console.error(err);
    setLoading(false);
  }
};





  useEffect(() => {
    setIsSubscribed(
      channel?.subscribers?.some(
        (sub) => sub._id?.toString() === userData?._id?.toString() || sub?.toString() === userData?._id?.toString()
      )
    );
  }, [channel.subscribers, userData?._id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`${serverUrl}/api/content/video/${videoId}/comment`, { message: newComment }, { withCredentials: true });
      setComments(res.data?.comments);
      console.log(res.data.comments)

    } catch (err) { console.error(err); }
  };




  const handleAddReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(`${serverUrl}/api/content/video/${videoId}/${commentId}/reply`, { message: replyText }, { withCredentials: true });

      setComments(res.data.comments);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const addHistory = async () => {
      try {
       const res =  await axios.post(
          `${serverUrl}/api/user/addhistory`,
          { contentId: videoId,
  contentType: "Video" },
          { withCredentials: true }
        );
        console.log(res.data)
      } catch (err) {
        console.error("Error adding history:", err);
      }
    };

    if (videoId) addHistory();
  }, [videoId]);




  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      {/* Left - Video & Details */}
      <div className="flex-1">
        {/* Video Player */}
        <div
          className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={video?.videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls={false}
            autoPlay
          />
          {showControls && (
  <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20">
    <button onClick={skipBackward} className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"><FaBackward size={24} /></button>
    <button onClick={togglePlay} className="bg-black/70 p-4 sm:p-6 rounded-full hover:bg-orange-600 transition">
      {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
    </button>
    <button onClick={skipForward} className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"><FaForward size={24} /></button>
  </div>
)}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 z-30">
            <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="w-full accent-orange-600" />
            <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200">
  {/* Left side: Play + Skip + Time */}
  <div className="flex items-center gap-3">
    {/* Play/Pause */}
    <button 
      onClick={togglePlay} 
      className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
    >
      {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
    </button>

    {/* Skip Backward */}
    <button 
      onClick={skipBackward} 
      className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
    >
      <FaBackward size={14} />
    </button>

    {/* Time */}
    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>

    {/* Skip Forward */}
    <button 
      onClick={skipForward} 
      className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
    >
      <FaForward size={14} />
    </button>
  </div>

  {/* Right side: Volume + Fullscreen */}
  <div className="flex items-center gap-2 sm:gap-3">
    <button onClick={toggleMute}>
      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
    </button>
    <input 
      type="range" 
      min="0" max="1" step="0.1" 
      value={isMuted ? 0 : volume} 
      onChange={handleVolume} 
      className="accent-orange-600 w-16 sm:w-24" 
    />
    <button onClick={handleFullScreen}><FaExpand /></button>
  </div>
</div>

          </div>
        </div>

        {/* Video Info */}
        <h1 className="mt-4 text-lg sm:text-xl font-bold text-white flex gap-3">{video?.title} </h1>

        <p className="text-sm text-gray-400">{video?.views} views</p>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center justify-start gap-4" ><img src={channel?.avatar} className="w-12 h-12 rounded-full border-2 border-gray-600" alt="" onClick={() => navigate(`/channelpage/${channel._id}`)} />
            <div>
              <h1 className="text-md font-bold" onClick={() => navigate(`/channelpage/${channel._id}`)}>{channel?.name}</h1>
              <h3 className="text-[13px]">{channel?.subscribers?.length}</h3>
            </div>
            <button
              className={`px-[20px] py-[8px] rounded-4xl border border-gray-600 ml-[20px] text-md ${isSubscribed ? "bg-black text-white hover:bg-orange-600 hover:text-black" : "bg-white text-black hover:bg-orange-600 hover:text-black"
                }`}
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="gray" /> : isSubscribed ? "Subscribed" : "Subscribe"}
            </button>

          </div>
          <div className="flex items-center gap-6 mt-3">
            <IconButton icon={FaThumbsUp} active={video?.likes.includes(userData?._id)} label="Like" count={video?.likes.length} onClick={handleLike} />
            <IconButton icon={FaThumbsDown} active={video?.dislikes.includes(userData?._id)} label="Dislike" count={video?.dislikes.length} onClick={handleDislike} />
            <IconButton icon={FaDownload} label="Download" onClick={() => {
              const link = document.createElement("a"); link.href = video?.videoUrl; link.download = `${video?.title}.mp4`; link.click();
            }} />
            <IconButton icon={FaBookmark} active={video?.saveBy.includes(userData?._id)} label="Save" onClick={handleSave} />
          </div>
        </div>

     <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg">
  <h2 className="text-md font-semibold mb-2">Description</h2>
  <Description text={video?.description} />
</div>
        {/* Comments */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Comments</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <button onClick={handleAddComment} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">Post</button>
          </div>

          <div className="space-y-3">
            {comments?.map((comment) => (

              <div key={comment?._id} className="p-3 bg-[#1a1a1a] rounded-lg shadow-sm text-sm">
                <div className="flex items-center justify-start gap-1">
                  <img src={comment?.author?.photoUrl} className="w-8 h-8 rounded-full" alt="" />
                  <h1 className="text-[13px]">@{comment?.author?.username?.toLowerCase()}</h1>
                </div>
                <p className="font-medium px-[20px] py-[20px] ">{comment?.message}</p>
                <div className="ml-4 mt-2 space-y-2">
                  {comment?.replies?.map((reply) => (
                    <div key={reply._id} className="p-2 bg-[#2a2a2a] rounded ">
                      <div className="flex items-center justify-start gap-1"><img src={reply?.author?.photoUrl} alt="" className="w-8 h-8 rounded-full" />
                        <h1 className="text-[13px]">@{comment?.author?.username.toLowerCase()}</h1></div>
                      <p className="px-[20px] py-[20px]">{reply?.message}</p>

                    </div>
                  ))}
                </div>
                <ReplySection comment={comment} handleAddReply={handleAddReply} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Shorts + Suggested */}
      <div className="w-full lg:w-[380px] px-4 py-4 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto">
        <h2 className="flex items-center gap-2 font-bold text-lg mb-3">
          <SiYoutubeshorts className="text-red-600" /> Shorts
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
  {suggestedShorts.map((short) => (
    <div key={short._id} >
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
        <h2 className="font-bold text-lg mt-4 mb-3">Up next</h2>
        <div className="space-y-3">
          {suggestedVideos.map((v) => (
            <div key={v._id} onClick={() => navigate(`/watch-video/${v._id}`)} className="flex gap-2 sm:gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition">
              <img src={v.thumbnail} className="w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover" />
              <div>
                <p className="font-semibold line-clamp-2 text-sm sm:text-base text-white">{v.title}</p>
                <p className="text-xs sm:text-sm text-gray-400">{v.channel?.name}</p>
                <p className="text-xs sm:text-sm text-gray-400">{v.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReplySection = ({ comment, handleAddReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div className="mt-2">
      {showReplyInput && (
        <div className="flex gap-2 mt-1 ml-4">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add a reply..."
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-red-600 text-sm"
          />
          <button onClick={() => { handleAddReply(comment._id, replyText); setReplyText(""); setShowReplyInput(false); }} className="bg-red-600 hover:bg-red-700 text-white px-3 rounded-lg text-sm">Reply</button>
        </div>
      )}
      <button onClick={() => setShowReplyInput(!showReplyInput)} className="ml-4 text-xs text-gray-400 mt-1">Reply</button>
    </div>
  );
};

export default WatchVideoPage;