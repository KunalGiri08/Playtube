import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaTrash, FaSave } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import { setAllShortData } from "../redux/contentSlice";
import { setChannelData } from "../redux/userSlice";

const ManageShort = () => {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allShortData } = useSelector((state) => state.content);
  const { channelData } = useSelector((state) => state.user);

  const [shortData, setShortData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [title, setTitle] = useState("");
  const [description,setDescription] = useState("");
  
  const [tags, setTags] = useState("");

  // fetch short details
  useEffect(() => {
    const fetchShort = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/content/fetch-short/${shortId}`,
          { withCredentials: true }
        );
        setShortData(res.data.short);
        setTitle(res.data.short.title);
        setDescription(res.data.short.description);
       
        setTags(res.data.short.tags?.join(", ") || "");
      } catch (error) {
        console.error(error);
        showCustomAlert("Failed to load short", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchShort();
  }, [shortId]);

  // handle update
  const handleUpdate = async () => {
    if (!title.trim()) {
      showCustomAlert("Title is required", "error");
      return;
    }
    try {
      setUpdating(true);
      const res = await axios.put(
        `${serverUrl}/api/content/update-short/${shortId}`,
        {
          title,
          description,
          tags: JSON.stringify(
            tags.split(",").map((t) => t.trim()).filter(Boolean)
          ),
        },
        { withCredentials: true }
      );

      const updatedShort = res.data.short;

      // update allShortData in Redux
      const updatedAllShorts = allShortData.map((s) =>
        s._id === shortId ? updatedShort : s
      );
      dispatch(setAllShortData(updatedAllShorts));

      // update channelData in Redux
      const updatedChannel = {
        ...channelData,
        shorts: channelData.shorts.map((s) =>
          s._id === shortId ? updatedShort : s
        ),
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Short updated successfully", "success");
      
    } catch (error) {
      console.error(error);
      showCustomAlert("Failed to update short", "error");
    } finally {
      setUpdating(false);
    }
  };

  // handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this short?")) return;
    try {
      await axios.delete(`${serverUrl}/api/content/delete-short/${shortId}`, {
        withCredentials: true,
      });

      // update allShortData in Redux
      const updatedAllShorts = allShortData.filter((s) => s._id !== shortId);
      dispatch(setAllShortData(updatedAllShorts));

      // update channelData in Redux
      const updatedChannel = {
        ...channelData,
        shorts: channelData.shorts.filter((s) => s._id !== shortId),
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Short deleted successfully", "success");
      navigate("/ptstudio/content");
    } catch (error) {
      console.error(error);
      showCustomAlert("Failed to delete short", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="white" size={40} />
      </div>
    );
  }

  if (!shortData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Short not found
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-start px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Short Preview */}
          <div className="flex justify-center items-start">
            <video
              src={shortData.shortUrl}
              className="h-[400px] w-auto aspect-[9/16] rounded-lg object-cover"
              controls
              playsInline
              muted
            />
          </div>

          {/* RIGHT: Inputs */}
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Title (required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none h-28"
            />
            
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="flex justify-between items-center gap-4 mt-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <FaTrash /> Delete
              </button>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  <>
                    <FaSave /> Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageShort;