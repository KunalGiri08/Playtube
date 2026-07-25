import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/playtube1.png";

import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaSearch,
} from "react-icons/fa";

import { SiYoutubeshorts } from "react-icons/si";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

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
    "Comedy",
    "Vlogs",
  ];

  const handleSearch = () => {
    if (!input.trim()) return;

    console.log("Searching:", input);

    // Search API will be added later
    setInput("");
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen">

      {/* ================= NAVBAR ================= */}

      <header className="h-[60px] bg-[#0f0f0f] border-b border-gray-800 fixed top-0 left-0 right-0 z-50 px-4">
        <div className="h-full flex items-center justify-between">

          {/* Left Side */}
          <div className="flex items-center gap-4">

            {/* Menu Button */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="hidden md:flex bg-[#272727] p-2 rounded-full hover:bg-gray-700"
            >
              <FaBars className="text-xl" />
            </button>

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={logo}
                alt="PlayTube"
                className="w-[30px]"
              />

              <span className="font-bold text-xl">
                PlayTube
              </span>
            </div>

          </div>


          {/* ================= SEARCH ================= */}

          <div className="hidden md:flex items-center flex-1 max-w-xl mx-5">

            <input
              type="text"
              placeholder="Search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700"
            />

            <button
              onClick={handleSearch}
              className="bg-[#272727] px-5 py-[11px] rounded-r-full border border-gray-700 hover:bg-gray-700"
            >
              <FaSearch />
            </button>

          </div>


          {/* ================= SIGN IN ================= */}

          <button
            onClick={() => navigate("/signin")}
            className="flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-full hover:bg-[#272727]"
          >
            <FaUserCircle className="text-xl" />

            <span className="hidden sm:block">
              Sign In
            </span>
          </button>

        </div>
      </header>


      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed
          top-[60px]
          bottom-0
          left-0
          bg-[#0f0f0f]
          border-r
          border-gray-800
          hidden
          md:flex
          flex-col
          z-40
          transition-all
          duration-300
          ${sidebarOpen ? "w-60" : "w-20"}
        `}
      >

        {/* HOME */}

        <SidebarItem
          icon={<FaHome />}
          text="Home"
          open={sidebarOpen}
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />


        {/* SHORTS */}

        <SidebarItem
          icon={<SiYoutubeshorts />}
          text="Shorts"
          open={sidebarOpen}
          active={location.pathname === "/shorts"}
          onClick={() => navigate("/shorts")}
        />

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main
        className={`
          pt-[60px]
          pb-[65px]
          min-h-screen
          transition-all
          duration-300
          ${sidebarOpen ? "md:ml-60" : "md:ml-20"}
        `}
      >

        {/* 
            Only show this content when URL is "/"
        */}

        {location.pathname === "/" && (
          <div className="p-4">

            {/* Categories */}

            <div className="flex gap-3 overflow-x-auto py-3">

              {categories.map((category) => (
                <button
                  key={category}
                  className="
                    whitespace-nowrap
                    bg-[#272727]
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    hover:bg-gray-700
                  "
                >
                  {category}
                </button>
              ))}

            </div>


            {/* Temporary Home Content */}

            <div className="mt-10 text-center">

              <h1 className="text-3xl font-bold">
                Welcome to PlayTube
              </h1>

              <p className="text-gray-400 mt-3">
                Videos will appear here soon.
              </p>

            </div>

          </div>
        )}


        {/* 
            IMPORTANT

            /shorts → Short.jsx will appear HERE
        */}

        <Outlet />

      </main>


      {/* ================= MOBILE BOTTOM NAV ================= */}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[65px] bg-[#0f0f0f] border-t border-gray-800 flex items-center justify-around z-50">

        {/* Home */}

        <MobileNavItem
          icon={<FaHome />}
          text="Home"
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />


        {/* Shorts */}

        <MobileNavItem
          icon={<SiYoutubeshorts />}
          text="Shorts"
          active={location.pathname === "/shorts"}
          onClick={() => navigate("/shorts")}
        />


        {/* User */}

        <MobileNavItem
          icon={<FaUserCircle />}
          text="You"
          active={location.pathname === "/signin"}
          onClick={() => navigate("/signin")}
        />

      </nav>

    </div>
  );
}


/* =====================================================
   SIDEBAR ITEM
===================================================== */

function SidebarItem({
  icon,
  text,
  open,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        items-center
        gap-4
        p-3
        mx-2
        mt-2
        rounded-lg
        transition
        ${open ? "justify-start" : "justify-center"}
        ${
          active
            ? "bg-[#272727]"
            : "hover:bg-[#272727]"
        }
      `}
    >

      <span className="text-xl">
        {icon}
      </span>

      {open && (
        <span className="text-sm">
          {text}
        </span>
      )}

    </button>
  );
}


/* =====================================================
   MOBILE NAV ITEM
===================================================== */

function MobileNavItem({
  icon,
  text,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        flex-col
        items-center
        justify-center
        gap-1
        px-4
        ${active ? "text-white" : "text-gray-400"}
      `}
    >

      <span className="text-xl">
        {icon}
      </span>

      <span className="text-[11px]">
        {text}
      </span>

    </button>
  );
}


export default Home;