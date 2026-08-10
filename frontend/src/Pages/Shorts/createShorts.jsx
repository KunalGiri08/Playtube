import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import { setChannelData } from "../redux/userSlice";
import { setAllShortData } from "../redux/contentSlice";

const CreateShort = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);
  const {allShortData} = useSelector((state=>state.content))

  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!video || !title) {
      showCustomAlert("Short video and title are required!");
      return;
    }

    const formData = new FormData();
    formData.append("short", video);
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim()))
    );
    formData.append("channelId", channelData?._id);

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/upload-short`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setAllShortData([...allShortData,result.data.short]))
      const updatedChannel = {
        ...channelData,
        shorts: [...(channelData.shorts || []), result.data.short],
      };
      dispatch(setChannelData(updatedChannel));


      showCustomAlert("Short Uploaded Successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Upload failed");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT: Video Upload */}
          <div className="flex justify-center items-start">
  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-[#181818] overflow-hidden w-[220px] aspect-[9/16]">
    {video ? (
      <video
        src={URL.createObjectURL(video)}
        className="h-full w-full object-cover"
        controls
      />
    ) : (
      <>
        <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
        <p className="text-gray-300 text-xs text-center px-2">Click to upload Shorts video</p>
        <span className="text-[10px] text-gray-500">MP4 or MOV — Max 60s</span>
      </>
    )}
    <input
      type="file"
      accept="video/mp4,video/quicktime"
      className="hidden"
      onChange={(e) => setVideo(e.target.files[0])}
    />
  </label>
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

            <button
              onClick={handlePublish}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Publish Short"}
            </button>

            {loading && (
              <p className="text-center text-gray-300 text-sm animate-pulse">
                Short uploading... please wait...
              </p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default CreateShort;