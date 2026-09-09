import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTachometerAlt, FaChartBar, FaVideo, FaPlusCircle } from "react-icons/fa";
import { SiYoutubestudio } from "react-icons/si";
import Profile from "../component/Profile";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

function PTStudio() {
  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);
  const [active, setActive] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col">
      {/* ---------- HEADER ---------- */}
      <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-gray-800 bg-[#0f0f0f] shadow-md">
        {/* Left Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <SiYoutubestudio className="text-orange-500 w-7 h-7" />
          <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            PT <span className="text-[#ffffff]">Studio</span>
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/createpage")}
            className=" bg-[#272727] px-3 sm:px-4 py-1 lg:rounded-lg  rounded-full hover:bg-[#161414] active:scale-95 transition cursor-pointer text-sm sm:text-base flex items-center justify-center gap-1" 
          >
          + Create
          </button>

          {channelData ? (
            <img
              src={channelData.avatar}
              alt="channel avatar"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-600 object-cover hover:scale-105 transition"
              onClick={() => setOpen((prev) => !prev)}
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-700" />
          )}
        </div>
      </header>

      {/* ---------- BODY (SIDEBAR + MAIN) ---------- */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar (hidden on small devices) */}
        <aside className="hidden md:flex w-56 lg:w-64 bg-[#121212] border-r border-gray-800 flex-col p-4 shadow-lg">
          {/* Channel Info */}
          {channelData ? (
            <div className="flex flex-col items-center gap-2 mb-8 text-center">
              <img
                src={channelData.avatar}
                alt="channel avatar"
                className="w-28 h-28 rounded-full border border-gray-700 object-cover shadow-md hover:scale-105 transition"
              />
              <h2 className="text-base lg:text-lg font-semibold">{channelData.name}</h2>
              <p className="text-xs text-gray-400">Your Channel</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-6">No channel data</p>
          )}

          {/* Nav Items */}
          <nav className="space-y-2">
            <SidebarItem
              icon={<FaTachometerAlt />}
              text="Dashboard"
              active={active}
              setActive={setActive}
              onClick={() => navigate("/ptstudio/dashboard")}
            />
            <SidebarItem
              icon={<FaVideo />}
              text="Content"
              active={active}
              setActive={setActive}
              onClick={() => navigate("/ptstudio/content")}
            />
            <SidebarItem
              icon={<FaChartBar />}
              text="Analytics"
              active={active}
              setActive={setActive}
              onClick={() => navigate("/ptstudio/analytics")}
            />
            <SidebarItem
              icon={<RiMoneyRupeeCircleFill className="w-6 h-6"/>}
              text="Revenue"
              active={active}
              setActive={setActive}
              onClick={() => navigate("/ptstudio/revenue")}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
          <div className="border border-gray-700 rounded-lg p-4 sm:p-6 text-center text-gray-400 bg-[#181818] shadow-inner min-h-[70vh]">
            {open && <Profile />}
            <div className="mt-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* ---------- MOBILE BOTTOM NAV ---------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-50">
        <MobileNavItem
          icon={<FaTachometerAlt />}
          text="Dashboard"
          active={active === "Dashboard"}
          onClick={() => {
            setActive("Dashboard");
            navigate("/ptstudio/dashboard");
          }}
        />
        <MobileNavItem
          icon={<FaVideo />}
          text="Content"
          active={active === "Content"}
          onClick={() => {
            setActive("Content");
            navigate("/ptstudio/content");
          }}
        />
        <MobileNavItem
          icon={<FaPlusCircle />}
          text="Create"
          onClick={() => navigate("/createpage")}
        />
        <MobileNavItem
          icon={<FaChartBar />}
          text="Analytics"
          active={active === "Analytics"}
          onClick={() => {
            setActive("Analytics");
            navigate("/ptstudio/analytics");
          }}
        />
        <MobileNavItem
          icon={<RiMoneyRupeeCircleFill className="w-6 h-6" />}
          text="Revenue"
          active={active === "Revenue"}
          onClick={() => {
            setActive("Revenue");
            navigate("/ptstudio/revenue");
          }}
        />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, text, onClick, active, setActive }) {
  const isActive = active === text;

  return (
    <button
      onClick={() => {
        setActive(text);
        onClick();
      }}
      className={`flex items-center gap-2 lg:gap-3 w-full px-3 py-2 rounded-lg transition-all ${
        isActive
          ? "bg-[#272727] text-white shadow-md"
          : "text-gray-300 hover:bg-[#272727] hover:text-white"
      }`}
    >
      <span className="text-base lg:text-lg">{icon}</span>
      <span className="text-sm lg:text-base font-medium">{text}</span>
    </button>
  );
}

function MobileNavItem({ icon, text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 ${
        active ? "text-orange-100" : "text-gray-400"
      } hover:text-white hover:bg-[#272727]`}
    >
      <span className="text-xl sm:text-2xl">{icon}</span>
      <span className="text-[10px] sm:text-xs">{text}</span>
    </button>
  );
}

export default PTStudio;