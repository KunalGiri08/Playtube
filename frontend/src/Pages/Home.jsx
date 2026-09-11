import { useState, useRef, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/playtube1.png";

import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes,
} from "react-icons/fa";

import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";

import Profile from "../component/Profile";
import { useSelector } from "react-redux";
import AllVideosPage from "../component/AllVideosPage";
import ShortsPage from "../component/AllShortsPage";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [popUp, setPopUp] = useState(false);
  const [listening, setListening] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { userData, subscribeChannel } = useSelector(
    (state) => state.user
  );

  const categories = [
    "Music",
    "Gaming",
    "Movies",
    "TV Shows",
    "News",
    "Trending",
    "Entertainment",
    "Education",
    "Science & Tech",
    "Travel",
    "Fashion",
    "Cooking",
    "Sports",
    "Pets",
    "Art",
    "Comedy",
    "Vlogs",
  ];

  // Keep search input synced with URL query param if on /search
  useEffect(() => {
    if (location.pathname === "/search") {
      const q = searchParams.get("q");
      if (q !== null && q !== undefined) {
        setInput(q);
      }
    }
  }, [location.pathname, searchParams]);

  // Voice recognition reference and active flag
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  // Central search handler used by both normal text and voice search
  const handleSearch = useCallback(
    (searchQuery = input, options = {}) => {
      const query =
        typeof searchQuery === "string" ? searchQuery.trim() : input.trim();
      if (!query) return;

      // Close voice popup if open
      setPopUp(false);

      // Stop listening if active
      if (isListeningRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        isListeningRef.current = false;
        setListening(false);
      }

      const isVoice = Boolean(options?.isVoice);
      setInput(query);

      // If already at /search?q={query} without voice, avoid redundant router push
      const currentQ = searchParams.get("q");
      if (location.pathname === "/search" && currentQ === query && !isVoice) {
        return;
      }

      navigate(
        `/search?q=${encodeURIComponent(query)}${isVoice ? "&voice=true" : ""}`,
        {
          state: {
            fromVoice: isVoice,
            query,
            timestamp: Date.now(),
          },
        }
      );
    },
    [input, navigate, location.pathname, searchParams]
  );

  // Initialize SpeechRecognition safely using React lifecycle
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      isListeningRef.current = true;
      setListening(true);
    };

    recognition.onresult = (event) => {
      isListeningRef.current = false;
      setListening(false);
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim();

      if (transcript) {
        setInput(transcript);
        setPopUp(false);
        // Execute central search directly with the transcript (avoids state race condition)
        handleSearch(transcript, { isVoice: true });
      }
    };

    recognition.onerror = (event) => {
      isListeningRef.current = false;
      setListening(false);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        alert(
          "Microphone permission was denied. Please allow microphone access in your browser."
        );
      } else if (event.error === "no-speech" || event.error === "aborted") {
        // Normal graceful stop
      } else {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch (e) {}
      recognitionRef.current = null;
    };
  }, [handleSearch]);

  const startVoiceListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition || !recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListeningRef.current) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn("Speech recognition start warning:", err?.message || err);
    }
  };

  const stopVoiceListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    isListeningRef.current = false;
    setListening(false);
  };

  const handleVoiceSearchToggle = () => {
    if (listening) {
      stopVoiceListening();
    } else {
      startVoiceListening();
    }
  };

  const openVoicePopup = () => {
    setPopUp(true);
    startVoiceListening();
  };

  const closeVoicePopup = () => {
    stopVoiceListening();
    setPopUp(false);
  };

  const handleCategory = (category) => {
    if (!category) return;
    handleSearch(category);
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">

      {/* VOICE SEARCH POPUP */}
      {popUp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl w-[90%] max-w-md min-h-[400px] p-8 flex flex-col items-center justify-between gap-8 relative border border-gray-700">

            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={closeVoicePopup}
            >
              <FaTimes size={22} />
            </button>

            <div className="flex flex-col items-center gap-3 w-full">

              {listening ? (
                <h1 className="text-xl font-semibold text-red-400">
                  Listening...
                </h1>
              ) : (
                <h1 className="text-lg font-medium text-gray-300">
                  Speak or type your query
                </h1>
              )}

              {input && (
                <span className="text-center text-lg text-gray-200 px-4 py-2 rounded-lg bg-[#2a2a2a]">
                  {input}
                </span>
              )}

              <div className="flex w-full gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Type your search..."
                  className="flex-1 px-4 py-2 rounded-full bg-[#2a2a2a] text-white outline-none border border-gray-600"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(input);
                    }
                  }}
                />

                <button
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full"
                  onClick={() => handleSearch(input)}
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            <button
              className={`p-6 rounded-full shadow-xl ${
                listening
                  ? "bg-red-600 animate-pulse"
                  : "bg-[#272727] hover:bg-[#3f3f3f]"
              }`}
              onClick={handleVoiceSearchToggle}
            >
              <FaMicrophone className="w-8 h-8" />
            </button>

          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="bg-[#0f0f0f] h-[60px] p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">

        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xl bg-[#272727] p-2 rounded-full md:inline hidden"
            >
              <FaBars />
            </button>

            <div
              className="flex items-center gap-[5px] cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                alt="PlayTube Logo"
                className="w-[30px]"
              />

              <span className="font-bold text-xl">
                PlayTube
              </span>
            </div>

          </div>

          {/* SEARCH */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">

            <div className="flex flex-1">

              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(input);
                  }
                }}
              />

              <button
                className="bg-[#272727] px-4 rounded-r-full border border-gray-700"
                onClick={() => handleSearch(input)}
              >
                <FaSearch />
              </button>

            </div>

            <button
              className="bg-[#272727] p-3 rounded-full"
              onClick={openVoicePopup}
            >
              <FaMicrophone />
            </button>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {userData?.channel && (
              <button
                className="hidden md:flex items-center gap-1 bg-[#272727] px-3 py-1 rounded-full"
                onClick={() => navigate("/createpage")}
              >
                <span className="text-lg">+</span>
                <span>Create</span>
              </button>
            )}

            {!userData?.photoUrl ? (
              <FaUserCircle
                className="text-3xl hidden md:flex text-gray-400 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              />
            ) : (
              <img
                src={userData.photoUrl}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-gray-700 hidden md:flex cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              />
            )}

            <FaSearch
              className="text-lg md:hidden cursor-pointer"
              onClick={openVoicePopup}
            />

          </div>

        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-[60px] bottom-0 z-40 ${
          sidebarOpen ? "w-60" : "w-20"
        } hidden md:flex flex-col overflow-y-auto`}
      >

        <nav className="space-y-1 mt-3">

          <SidebarItem
            icon={<FaHome />}
            text="Home"
            open={sidebarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home");
              navigate("/");
            }}
          />

          <SidebarItem
            icon={<SiYoutubeshorts />}
            text="Shorts"
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }}
          />

          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text="Subscriptions"
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => {
              setSelectedItem("Subscriptions");
              navigate("/subscribepage");
            }}
          />

        </nav>

        <hr className="border-gray-800 my-3" />

        {sidebarOpen && (
          <p className="text-sm text-gray-400 px-2">
            You
          </p>
        )}

        <nav className="space-y-1 mt-1">

          <SidebarItem
            icon={<FaHistory />}
            text="History"
            open={sidebarOpen}
            selected={selectedItem === "History"}
            onClick={() => {
              setSelectedItem("History");
              navigate("/history");
            }}
          />

          <SidebarItem
            icon={<FaList />}
            text="Playlists"
            open={sidebarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() => {
              setSelectedItem("Playlists");
              navigate("/saveplaylist");
            }}
          />

          <SidebarItem
            icon={<GoVideo />}
            text="Save videos"
            open={sidebarOpen}
            selected={selectedItem === "Save videos"}
            onClick={() => {
              setSelectedItem("Save videos");
              navigate("/savevideos");
            }}
          />

          <SidebarItem
            icon={<FaThumbsUp />}
            text="Liked videos"
            open={sidebarOpen}
            selected={selectedItem === "Liked videos"}
            onClick={() => {
              setSelectedItem("Liked videos");
              navigate("/likedvideos");
            }}
          />

        </nav>

        <hr className="border-gray-800 my-3" />

        {sidebarOpen && (
          <p className="text-sm text-gray-400 px-2">
            Subscriptions
          </p>
        )}

        <nav className="space-y-1 mt-1">

          {subscribeChannel?.map((item) => (
            <button
              key={item._id}
              onClick={() => {
                setSelectedItem(item._id);
                navigate(`/channelpage/${item._id}`);
              }}
              className={`flex items-center ${
                sidebarOpen
                  ? "gap-3 justify-start"
                  : "justify-center"
              } w-full text-left p-2 rounded-lg transition ${
                selectedItem === item._id
                  ? "bg-[#272727]"
                  : "hover:bg-gray-800"
              }`}
            >

              <img
                src={item.avatar}
                alt={item.name}
                className="w-6 h-6 rounded-full border border-gray-700 object-cover"
              />

              {sidebarOpen && (
                <span className="text-sm truncate">
                  {item.name}
                </span>
              )}

            </button>
          ))}

        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all duration-300 ${
          sidebarOpen ? "md:ml-60" : "md:ml-20"
        }`}
      >

        {location.pathname === "/" && (
          <>

            {/* CATEGORIES */}
            <div className="flex items-center gap-3 overflow-x-auto pt-2 mt-[60px]">

              {categories.map((category) => (
                <button
                  key={category}
                  className="whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700"
                  onClick={() => handleCategory(category)}
                >
                  {category}
                </button>
              ))}

            </div>

            {/* HOME CONTENT */}
            <div className="mt-6">

              <AllVideosPage />

              <ShortsPage />

            </div>

          </>
        )}

        {open && <Profile />}

        <div className="mt-4">
          <Outlet />
        </div>

      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-10">

        <MobileNavItem
          onClick={() => navigate("/")}
          icon={<FaHome />}
          text="Home"
        />

        <MobileNavItem
          onClick={() => navigate("/shorts")}
          icon={<SiYoutubeshorts />}
          text="Shorts"
        />

        <MobileNavItem
          onClick={() => navigate("/createpage")}
          icon={
            <IoIosAddCircle className="text-4xl w-9 h-9" />
          }
        />

        <MobileNavItem
          onClick={() => navigate("/subscribepage")}
          icon={<MdOutlineSubscriptions />}
          text="Subscriptions"
        />

        <MobileNavItem
          onClick={() => navigate("/mobileprofile")}
          icon={
            !userData?.photoUrl ? (
              <FaUserCircle />
            ) : (
              <img
                src={userData.photoUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-700"
              />
            )
          }
          text="You"
        />

      </nav>

    </div>
  );
}

function SidebarItem({
  icon,
  text,
  open,
  selected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${
        open ? "justify-start" : "justify-center"
      } ${
        selected
          ? "bg-[#272727]"
          : "hover:bg-[#272727]"
      }`}
    >
      <span className="text-lg">{icon}</span>

      {open && (
        <span className="text-sm">{text}</span>
      )}
    </button>
  );
}

function MobileNavItem({
  icon,
  text,
  onClick,
  active,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg ${
        active ? "text-white" : "text-gray-400"
      }`}
    >
      <span className="text-xl sm:text-2xl">
        {icon}
      </span>

      {text && (
        <span className="text-[10px] sm:text-xs">
          {text}
        </span>
      )}
    </button>
  );
}

export default Home;