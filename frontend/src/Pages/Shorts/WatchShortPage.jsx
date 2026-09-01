import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaPlay,
  FaPause,
  FaDownload,
  FaBookmark,
  FaArrowDown, // for closing comment section
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import Description from "../component/Description";

const WatchShortPage = () => {
  const { shortId } = useParams();
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { allShortData } = useSelector((state) => state.content);
  

  const selectedShort = allShortData?.find((s) => s._id === shortId);
  const [shortsList, setShortsList] = useState([]);

  const [pausedIndex, setPausedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);


  const [openCommentShortId, setOpenCommentShortId] = useState(null);
  const [comments, setComments] = useState({}); // store per-short comments
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({}); // reply state for each comment
  const [viewedShorts, setViewedShorts] = useState([]);
   const [loading,setLoading] = useState(false)


  const videoRefs = useRef([]);

  // Arrange shorts
  useEffect(() => {
    if (!allShortData || allShortData.length === 0) return;

    if (selectedShort) {
      const selected = allShortData.find(
        (short) => short._id === selectedShort._id
      );

      const remaining = allShortData.filter(
        (short) => short._id !== selectedShort._id
      );

      if (selected) {
        setShortsList([selected, ...remaining]);
        setActiveIndex(0);
      } else {
        setShortsList(allShortData);
      }
    } else {
      setShortsList(allShortData);
    }
  }, [selectedShort, allShortData]);

  // Auto play/pause
  // Already exists in your code
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = videoRefs.current[index];
          if (video) {
            if (entry.isIntersecting) {
              video.muted = false;
              video.play();
              setActiveIndex(index);

              const currentShortId = shortsList[index]._id;

              if (!viewedShorts.includes(currentShortId)) {
                handleAddView(currentShortId);
                setViewedShorts((prev) => [...prev, currentShortId]); // ✅ ab sahi id add hogi
              }
            } else {
              video.pause();
              video.muted = true;
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [shortsList, viewedShorts]);


  // Toggle play/pause
  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setPausedIndex(null);
      } else {
        video.pause();
        setPausedIndex(index);
      }
    }
  };

  // Download video
  const handleDownload = (e, url, title) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = url;
    link.download = title || "short-video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Add this function inside WatchShortPage
  const handleAddView = async (shortId) => {
    try {
      await axios.put(`${serverUrl}/api/content/short/${shortId}/add-view`, {}, { withCredentials: true });
      console.log("✅ View added for:", shortId);
    } catch (err) {
      console.error("View error:", err);
    }
  };



  const handleLike = async (shortId) => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-like`,
        {},
        { withCredentials: true }
      );

      const updatedShort = res.data;
      const updatedShortList = shortsList.map((s) =>
        s._id === updatedShort._id ? updatedShort : s
      );
      setShortsList(updatedShortList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (shortId) => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-dislike`,
        {},
        { withCredentials: true }
      );
      const updatedShort = res.data;
      const updatedShortList = shortsList.map((s) =>
        s._id === updatedShort._id ? updatedShort : s
      );
      setShortsList(updatedShortList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (shortId) => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-save`,
        {},
        { withCredentials: true }
      );
      const updatedShort = res.data;
      const updatedShortList = shortsList.map((s) =>
        s._id === updatedShort._id ? updatedShort : s
      );
      setShortsList(updatedShortList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async (channelId) => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/subscribe`,
        { channelId },
        { withCredentials: true }
      );
      setLoading(false)
      console.log(res.data)
      const updatedChannel = res.data;

      // ✅ shortsList ke andar jis short ka channel match hua hai sirf usko update karo
      setShortsList((prev) =>
        prev.map((short) =>
          short.channel._id === channelId
            ? { ...short, channel: updatedChannel }
            : short
        )
      );
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const handleAddComment = async (shortId) => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/short/${shortId}/comment`,
        { message: newComment },
        { withCredentials: true }
      );

      // Use full comments array returned by backend
      setComments((prev) => ({
        ...prev,
        [shortId]: res.data.comments || [],
      }));

      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReply = async (shortId, commentId, replyTextValue) => {
    if (!replyTextValue.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/short/${shortId}/${commentId}/reply`,
        { message: replyTextValue },
        { withCredentials: true }
      );

      setComments((prev) => ({
        ...prev,
        [shortId]: res.data.comments, // refresh full comments for this short
      }));
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

useEffect(() => {
  const addHistory = async () => {
    try {
     const res= await axios.post(
        `${serverUrl}/api/user/addhistory`,
        { contentId: shortId, contentType: "Short" },  // 👈 change
        { withCredentials: true }
      );
      console.log(res.data)
    } catch (err) {
      console.error("Error adding short history:", err);
    }
  };

  if (shortId) addHistory();
}, [shortId]);
  return (
    <div className="h-[90vh] w-full overflow-y-scroll snap-y snap-mandatory mt-[50px] re">
      {shortsList?.map((short, index) => (
        <div
          key={short._id}
          className="h-screen w-full flex md:items-center items-start justify-center snap-start relative"
        >
          <div
            className="relative w-[420px] md:w-[350px]  aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer"
            onClick={() => togglePlayPause(index)}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              data-index={index}
              src={short.shortUrl}
              className="w-full h-full object-cover"
              loop
              playsInline
            />

            {pausedIndex === index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPlay className="text-white text-lg" />
              </div>
            )}

            {pausedIndex !== index && activeIndex === index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPause className="text-white text-lg" />
              </div>
            )}

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-2">
              <div className="flex items-center justify-start gap-2" >
                <img
                  src={short.channel?.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full border-1 border-gray-700"
                  onClick={() => navigate(`/channelpage/${short?.channel._id}`)}
                />
                <span className="text-sm text-gray-300 " onClick={() => navigate(`/channelpage/${short?.channel._id}`)}>
                  @{short.channel?.name || "Unknown Channel"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(short.channel?._id);
                  }}
                  className={`${short?.channel?.subscribers?.includes(userData?._id)
                      ? "bg-[#000000a1] text-white border-1 border-gray-700"
                      : "bg-white text-black"
                    }  text-xs px-[20px] py-[10px] rounded-full cursor-pointer`} disabled={loading}
                >
                  {loading?<ClipLoader size={20} color="gray"/>:short?.channel?.subscribers?.includes(userData?._id)
                    ? "Subscribed"
                    : "Subscribe"}
                </button>

              </div>
              <div className="flex items-center justify-start gap-3">
                <h2 className="font-bold text-lg line-clamp-2">{short.title}</h2>
              </div>
               { short?.description && <div>
  
  <Description text={short?.description} />
</div>}
              <div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {short.tags &&
                    short.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                
              </div>
            </div>

            {/* Right Side Buttons */}
            <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 text-white">
              {/* Like */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(short._id);
                }}
                className="flex flex-col items-center"
              >
                <div
                  className={`${short?.likes?.includes(userData?._id)
                      ? "bg-white"
                      : "bg-[#00000065] border border-gray-700"
                    } p-3 rounded-full hover:bg-gray-700`}
                >
                  <FaThumbsUp
                    size={22}
                    className={`${short?.likes?.includes(userData?._id)
                        ? "text-black"
                        : "text-white"
                      }`}
                  />
                </div>
                <span className="text-xs mt-1">{short?.likes?.length}</span>
              </button>

              {/* Dislike */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDislike(short._id);
                }}
                className="flex flex-col items-center"
              >
                <div
                  className={`${short?.dislikes?.includes(userData?._id)
                      ? "bg-white"
                      : "bg-[#00000065] border border-gray-700"
                    } p-3 rounded-full hover:bg-gray-700`}
                >
                  <FaThumbsDown
                    size={22}
                    className={`${short?.dislikes?.includes(userData?._id)
                        ? "text-black"
                        : "text-white"
                      }`}
                  />
                </div>
                <span className="text-xs mt-1">{short?.dislikes?.length}</span>
              </button>

              {/* Comment */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (openCommentShortId === short._id) {
                    setOpenCommentShortId(null); // close if same
                  } else {
                    setOpenCommentShortId(short._id); // open drawer for this short
                    setComments((prev) => ({
                      ...prev,
                      [short._id]: short.comments || [] // preload old comments if not already loaded
                    }));
                  }
                }}
                className="flex flex-col items-center"
              >
                <div className="bg-[#00000065] border border-gray-700 p-3 rounded-full hover:bg-gray-700">
                  <FaComment size={22} className="text-white" />
                </div>
                <span className="text-xs mt-1">Comment</span>
              </button>


              {/* Download */}
              <button
                onClick={(e) => handleDownload(e, short.shortUrl, short.title)}
                className="flex flex-col items-center"
              >
                <div className="bg-[#00000065] border border-gray-700 p-3 rounded-full hover:bg-gray-700">
                  <FaDownload size={22} className="text-white" />
                </div>
                <span className="text-xs mt-1">Download</span>
              </button>

              {/* Save */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(short._id);
                }}
                className="flex flex-col items-center"
              >
                <div
                  className={`${short?.saveBy?.includes(userData?._id)
                      ? "bg-white"
                      : "bg-[#00000065] border border-gray-700"
                    } p-3 rounded-full hover:bg-gray-700`}
                >
                  <FaBookmark
                    size={22}
                    className={`${short?.saveBy?.includes(userData?._id)
                        ? "text-black"
                        : "text-white"
                      }`}
                  />
                </div>
                <span className="text-xs mt-1">{short?.saveBy?.length}</span>
              </button>
            </div>

            {/* Comment Section Drawer */}
            {openCommentShortId === short._id && (
              <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Comments</h3>
                  <button onClick={() => setOpenCommentShortId(null)}>
                    <FaArrowDown size={20} />
                  </button>
                </div>

                {/* Comment input */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-900 text-white p-2 rounded"
                  />
                  <button
                    onClick={() => handleAddComment(short._id)}
                    className="bg-black px-4 py-2  border-1 border-gray-700 rounded-xl"
                  >
                    Post
                  </button>
                </div>

                {/* Comments list */}
                <div className="space-y-3 mt-4">
                  {comments[short._id]?.length > 0 ? (
                    comments[short._id]
                      .filter((c) => c && c.message)
                      .map((comment) => (
                        <div key={comment._id || Math.random()} className="bg-gray-800/40 p-2 rounded-lg">
                          {/* Author info */}
                          <div className="flex items-center gap-2 mb-1">
                            <img
                              src={comment?.author?.photoUrl || "/default-avatar.png"}
                              alt="avatar"
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm font-semibold">
                              {comment?.author?.username || "Unknown"}
                            </span>
                          </div>

                          {/* Comment message */}
                          <p className="text-sm ml-8">{comment.message}</p>

                          {/* Reply input */}
                          <div className="mt-2 ml-8">
                            <input
                              type="text"
                              value={replyText[comment._id] || ""}
                              onChange={(e) =>
                                setReplyText((prev) => ({
                                  ...prev,
                                  [comment._id]: e.target.value,
                                }))
                              }
                              placeholder="Write a reply..."
                              className="w-full bg-gray-900 text-white text-sm p-2 rounded"
                            />
                            <button
                              onClick={() => {
                                handleAddReply(short._id, comment._id, replyText[comment._id]);
                                setReplyText((prev) => ({ ...prev, [comment._id]: "" })); // clear input
                              }}
                              className="mt-1 bg-red-500 px-3 py-1 rounded text-xs"
                            >
                              Reply
                            </button>
                          </div>

                          {/* Replies list */}
                          {comment?.replies?.length > 0 && (
                            <div className="ml-12 mt-2 space-y-2">
                              {comment.replies
                                .filter((r) => r && r.message)
                                .map((r) => (
                                  <div key={r._id || Math.random()} className="flex items-start gap-2">
                                    <img
                                      src={r?.author?.photoUrl || "/default-avatar.png"}
                                      alt="avatar"
                                      className="w-5 h-5 rounded-full"
                                    />
                                    <div>
                                      <span className="text-xs font-semibold">
                                        {r?.author?.username || "Unknown"}
                                      </span>
                                      <p className="text-xs text-gray-300 bg-gray-700 p-1 rounded mt-1">
                                        {r.message}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-400">No comments yet.</p>
                  )}
                </div>

              </div>
            )}
          </div>



        </div>

      ))}
    </div>
  );
};

export default WatchShortPage;