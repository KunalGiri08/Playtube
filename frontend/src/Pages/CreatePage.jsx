import React, { useState } from "react";
import { FaVideo, FaPlay, FaPen, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import create from "../assets/create.png";

function CreatePage() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const options = [
    { id: "video", icon: <FaVideo size={28} />, title: "Upload Video" },
    { id: "short", icon: <FaPlay size={28} />, title: "Create Short" },
    { id: "post", icon: <FaPen size={28} />, title: "Create Community Post" },
    { id: "playlist", icon: <FaList size={28} />, title: "New Playlist" },
  ];

  const handleCreate = () => {
    const routes = {
      video: "/create-video",
      short: "/create-short",
      post: "/create-post",
      playlist: "/create-playlist",
    };

    if (selected && routes[selected]) {
      navigate(routes[selected]);
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-6 py-8 mt-10 flex flex-col">
      {/* Header */}
      <div className="mb-12 border-b border-[#3f3f3f] pb-4">
        <h1 className="text-4xl font-bold tracking-tight">Create</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Choose what type of content you want to create for your audience
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-6 flex flex-col items-center text-center justify-center cursor-pointer transition
              ${selected === opt.id ? "ring-2 ring-red-500" : "hover:bg-[#272727]"}`}
            onClick={() => setSelected(opt.id)}
          >
            <div className="bg-[#272727] p-4 rounded-full mb-4">{opt.icon}</div>
            <h2 className="text-lg font-semibold">{opt.title}</h2>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center mt-16">
        <img src={create} alt="Create" className="w-20" />
        {!selected ? (
          <>
            <p className="mt-4 font-medium">Create content on any device</p>
            <p className="text-gray-400 text-sm text-center">
              Upload and record at home or on the go. Everything you make public will appear here.
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 font-medium">Ready to create?</p>
            <p className="text-gray-400 text-sm text-center">
              Click below to start your {options.find((o) => o.id === selected)?.title.toLowerCase()}.
            </p>
            <button
              className="bg-white text-black mt-4 px-5 py-1 rounded-full font-medium"
              onClick={handleCreate}
            >
              + Create
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CreatePage;