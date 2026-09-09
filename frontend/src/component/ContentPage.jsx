import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setChannelData } from "../redux/userSlice";
import { showCustomAlert } from "../component/CustomAlert";

function ContentPage() {
  const { channelData } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("Videos");
  const navigate = useNavigate();
    const dispatch = useDispatch();

  if (!channelData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-300">
        Loading channel content...
      </div>
    );
  }



const handleDeletePost = async (postId) => {
  if (!window.confirm("Are you sure you want to delete this post?")) return;

  try {
    await axios.delete(`${serverUrl}/api/content/delete-post/${postId}`, {
      withCredentials: true,
    });

    // update redux state by filtering out deleted post
    const updatedPosts = channelData.communityPosts.filter(
      (p) => p._id !== postId
    );
    dispatch(setChannelData({ ...channelData, communityPosts: updatedPosts }));

    showCustomAlert("Post deleted successfully");
  } catch (error) {
    console.error(error);
    showCustomAlert(error.response?.data?.message || "Failed to delete post");
  }
};


  return (
    <div className="text-white min-h-screen pt-5 px-4 sm:px-6 mb-16">
      {/* Tabs */}
      <div className="flex flex-wrap gap-6   border-b border-gray-800 mb-6">
        {["Videos", "Shorts", "Playlists", "Community"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-medium transition ${
              activeTab === tab
                ? "text-white border-b-2 border-orange-600"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="space-y-8">
        {/* ------------------ VIDEOS ------------------ */}
        {activeTab === "Videos" && (
          <>
            {/* Table (desktop & tablet) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Thumbnail</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Views</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData.videos?.map((v) => (
                    <tr
                      key={v._id}
                      className="border-t border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="p-3">
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-20 h-12 rounded object-cover"
                        />
                      </td>
                      <td className="p-3 text-start">{v.title}</td>
                      <td className="p-3 text-start">{v.views}</td>
                      <td className="p-3">
                        <FaEdit
                          className="cursor-pointer hover:text-blue-400"
                          onClick={() =>
                            navigate(`/ptstudio/managevideo/${v._id}`)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-4 md:hidden">
              {channelData.videos?.map((v) => (
                <div
                  key={v._id}
                  className="bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <h3 className="text-base font-semibold ">{v.title}</h3>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
                    <span>{v.views} views</span>
                    <FaEdit
                      className="cursor-pointer hover:text-blue-400"
                      onClick={() =>
                        navigate(`/ptstudio/managevideo/${v._id}`)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------------ SHORTS ------------------ */}
        {activeTab === "Shorts" && (
          <>
            {/* Table (desktop & tablet) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Preview</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Views</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData.shorts?.map((s) => (
                    <tr
                      key={s._id}
                      className="border-t border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="p-3">
                        <video
                          src={s.shortUrl}
                          className="w-16 h-24 bg-black rounded"
                          muted
                          playsInline
                        />
                      </td>
                      <td className="p-3 text-start">{s.title}</td>
                      <td className="p-3 text-start">{s.views}</td>
                      <td className="p-3">
                        <FaEdit className="cursor-pointer hover:text-blue-400" onClick={() =>
                            navigate(`/ptstudio/manageshort/${s._id}`)
                          } />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-4 md:hidden">
              {channelData.shorts?.map((s) => (
                <div
                  key={s._id}
                  className="bg-[#1c1c1c] rounded-xl shadow overflow-hidden flex flex-col"
                >
                  <video
                    src={s.shortUrl}
                    className="w-full aspect-[9/16] object-cover"
                    muted
                    playsInline
                    controls
                  />
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold">{s.title}</h3>
                      <p className="text-xs text-gray-400">{s.views} views</p>
                    </div>
                    <FaEdit className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() =>
                            navigate(`/ptstudio/manageshort/${s._id}`)
                          }  />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------------ PLAYLISTS ------------------ */}
        {activeTab === "Playlists" && (
          <>
            {/* Table (desktop & tablet) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Preview</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Total Videos</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData.playlists?.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="p-3">
                        <img
                          src={p.videos[0]?.thumbnail}
                          alt={p.title}
                          className="w-20 h-12 rounded object-cover"
                        />
                      </td>
                      <td className="p-3 text-start">{p.title}</td>
                      <td className="p-3 text-start">{p.videos?.length || 0}</td>
                      <td className="p-3">
                        <FaEdit className="cursor-pointer hover:text-blue-400" onClick={() =>
                            navigate(`/ptstudio/manageplaylist/${p._id}`)
                          } />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-4 md:hidden">
              {channelData.playlists?.map((p) => (
                <div
                  key={p._id}
                  className="bg-[#1c1c1c] rounded-xl shadow overflow-hidden flex flex-col"
                >
                  <img
                    src={p.videos[0]?.thumbnail}
                    alt={p.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold">{p.title}</h3>
                      <p className="text-xs text-gray-400">
                        {p.videos?.length || 0} videos
                      </p>
                    </div>
                    <FaEdit className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() =>
                            navigate(`/ptstudio/manageplaylist/${p._id}`)
                          } />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------------ COMMUNITY ------------------ */}
        {activeTab === "Community" && (
          <>
            {/* Table (desktop & tablet) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Post</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData.communityPosts?.map((post) => (
                    <tr
                      key={post._id}
                      className="border-t border-gray-700 hover:bg-gray-800/40"
                    >
                      <td className="p-3">
                        {post.image && (
                          <img
                            src={post.image}
                            className="w-20 h-12 object-cover rounded"
                            alt=""
                          />
                        )}
                      </td>
                      <td className="p-3 text-start">{post.content}</td>
                      <td className="p-3 text-start">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <MdDelete className="w-5 h-5 cursor-pointer hover:text-red-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-4 md:hidden">
              {channelData.communityPosts?.map((post) => (
                <div
                  key={post._id}
                  className="bg-[#1c1c1c] rounded-xl shadow overflow-hidden flex flex-col"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <MdDelete className="w-5 h-5 cursor-pointer hover:text-red-500" onClick={() => handleDeletePost(post._id)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ContentPage;