import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortCard";
import PlaylistCard from "../component/PlaylistCard";
import ChannelCard from "../component/ChannelCard";
import useSpeechSynthesis from "../customHooks/useSpeechSynthesis";

// Helper function to get duration
const getVideoDuration = (url, callback) => {
  if (!url) {
    callback("0:00");
    return;
  }
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

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = (searchParams.get("q") || "").trim();
  const isVoiceSearch =
    Boolean(location.state?.fromVoice) || searchParams.get("voice") === "true";

  const { allVideoData, allShortData } = useSelector((state) => state.content) || {};
  
  // Store redux data in ref so changing Redux video states never triggers duplicate search API calls
  const reduxDataRef = useRef({ allVideoData, allShortData });
  reduxDataRef.current = { allVideoData, allShortData };

  const [results, setResults] = useState({
    videos: [],
    shorts: [],
    channels: [],
    playlists: [],
  });
  const [loading, setLoading] = useState(false);
  const [durations, setDurations] = useState({});

  const { speakSearchResult } = useSpeechSynthesis();
  const spokenQueryRef = useRef(null);
  const lastFetchedQueryRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Fetch search results whenever query changes
  useEffect(() => {
    if (!query) {
      setResults({ videos: [], shorts: [], channels: [], playlists: [] });
      setLoading(false);
      lastFetchedQueryRef.current = "";
      return;
    }

    // Prevent duplicate fetching for identical queries unless forced
    if (lastFetchedQueryRef.current === query && !isVoiceSearch) {
      return;
    }

    // Cancel any previous in-flight request to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    lastFetchedQueryRef.current = query;
    setLoading(true);

    const performSearch = async () => {
      try {
        const res = await axios.post(
          `${serverUrl}/api/content/search`,
          { input: query },
          {
            signal: controller.signal,
            withCredentials: true,
          }
        );

        if (res.data) {
          const fetchedResults = {
            videos: Array.isArray(res.data.videos) ? res.data.videos : [],
            shorts: Array.isArray(res.data.shorts) ? res.data.shorts : [],
            channels: Array.isArray(res.data.channels) ? res.data.channels : [],
            playlists: Array.isArray(res.data.playlists) ? res.data.playlists : [],
          };

          // Render results immediately
          setResults(fetchedResults);
          setLoading(false);

          // Non-blocking spoken voice response after results are displayed
          if (isVoiceSearch && spokenQueryRef.current !== query) {
            spokenQueryRef.current = query;
            const count = fetchedResults.videos.length + fetchedResults.shorts.length;
            setTimeout(() => {
              speakSearchResult(query, count);
            }, 50);
          }
        }
      } catch (err) {
        // Ignore deliberate abort cancellations
        if (axios.isCancel(err) || err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return;
        }

        console.error("Backend search failed, using client-side fallback:", err);

        // Fallback: search client-side using Redux data if available
        const { allVideoData: currentVideos, allShortData: currentShorts } = reduxDataRef.current;
        const lowerQ = query.toLowerCase();

        const filteredVideos = (currentVideos || []).filter((v) => {
          const titleMatch = v.title?.toLowerCase().includes(lowerQ);
          const descMatch = v.description?.toLowerCase().includes(lowerQ);
          const channelMatch = v.channel?.name?.toLowerCase().includes(lowerQ);
          const tagsMatch = v.tags?.some((t) => t.toLowerCase().includes(lowerQ));
          return titleMatch || descMatch || channelMatch || tagsMatch;
        });

        const filteredShorts = (currentShorts || []).filter((s) => {
          const titleMatch = s.title?.toLowerCase().includes(lowerQ);
          const channelMatch = s.channel?.name?.toLowerCase().includes(lowerQ);
          const tagsMatch = s.tags?.some((t) => t.toLowerCase().includes(lowerQ));
          return titleMatch || channelMatch || tagsMatch;
        });

        const fallbackResults = {
          videos: filteredVideos,
          shorts: filteredShorts,
          channels: [],
          playlists: [],
        };

        setResults(fallbackResults);
        setLoading(false);

        if (isVoiceSearch && spokenQueryRef.current !== query) {
          spokenQueryRef.current = query;
          const count = filteredVideos.length + filteredShorts.length;
          setTimeout(() => {
            speakSearchResult(query, count);
          }, 50);
        }
      }
    };

    performSearch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, isVoiceSearch, speakSearchResult]);

  // Compute durations for videos without triggering cascading re-renders
  useEffect(() => {
    if (!results?.videos?.length) return;
    let isMounted = true;

    results.videos.forEach((video) => {
      if (video._id && video.videoUrl) {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          if (isMounted) {
            setDurations((prev) => {
              if (prev[video._id] === formattedTime) return prev;
              return { ...prev, [video._id]: formattedTime };
            });
          }
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [results.videos]);

  const isEmpty =
    !loading &&
    (!results.videos || results.videos.length === 0) &&
    (!results.shorts || results.shorts.length === 0) &&
    (!results.channels || results.channels.length === 0) &&
    (!results.playlists || results.playlists.length === 0);

  return (
    <div className="px-6 py-4 bg-[#00000051] border border-gray-800 mb-[20px] rounded-lg mt-[44px]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Search Results {query && <span className="text-gray-400 font-normal">for "{query}"</span>}
        </h1>
        {loading && (
          <span className="text-sm text-gray-400 animate-pulse">Searching...</span>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <p className="text-gray-400 text-lg animate-pulse">Loading search results...</p>
        </div>
      ) : isEmpty ? (
        <div className="py-12 text-center">
          <p className="text-gray-400 text-lg">No results found for "{query}".</p>
          <p className="text-gray-500 text-sm mt-2">
            Try different keywords or check for spelling errors.
          </p>
        </div>
      ) : (
        <>
          {/* Channels Section */}
          {results.channels?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results.channels.map((ch) => (
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
          {results.videos?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Videos</h3>
              <div className="flex flex-wrap gap-6">
                {results.videos.map((video) => (
                  <VideoCard
                    key={video._id}
                    thumbnail={video.thumbnail}
                    duration={durations[video._id] || "0:00"}
                    channelLogo={video.channel?.avatar}
                    title={video.title}
                    channelName={video.channel?.name}
                    views={`${video.views || 0}`}
                    time={
                      video.createdAt
                        ? new Date(video.createdAt).toLocaleDateString()
                        : ""
                    }
                    id={video._id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Shorts Section */}
          {results.shorts?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Shorts</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {results.shorts.map((short) => (
                  <div key={short._id} className="flex-shrink-0">
                    <ShortsCard
                      shortUrl={short.shortUrl}
                      title={short.title}
                      channelName={short.channel?.name}
                      views={short.views || 0}
                      id={short._id}
                      avatar={short.channel?.avatar}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playlists Section */}
          {results.playlists?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Playlists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results.playlists.map((pl) => (
                  <PlaylistCard
                    key={pl._id}
                    id={pl._id}
                    title={pl.title}
                    videos={pl.videos || []}
                    savedBy={pl.saveBy || []}
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