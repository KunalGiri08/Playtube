import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App"; 
import PlaylistCard from "../component/PlaylistCard";
import { useSelector } from "react-redux";

export default function SavedPlaylistPage() {
  const { userData } = useSelector((state) => state.user);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPlaylists = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/content/saveplaylist`, {
          withCredentials: true,
        });
        console.log("Saved playlists:", res.data);
        setPlaylists(res.data);
      } catch (err) {
        console.error("Error fetching saved playlists:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userData?._id) fetchSavedPlaylists();
  }, [userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
        Loading saved playlists...
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
        No saved playlists found
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-black text-white mt-[40px] lg:mt-[20px]">
      <h1 className="text-3xl font-bold mb-6">Your Saved Playlists</h1>
      <div className="flex flex-wrap gap-6">
        {playlists.map((pl) => (
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
  );
}