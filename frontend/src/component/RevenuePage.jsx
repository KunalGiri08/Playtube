import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { setContentRevenue } from "../redux/contentSlice";
// ------------------- Revenue Calculation -------------------
const calculateRevenue = (views, type) => {
  if (type === "video") {
    if (views < 1000) return 0;
    return Math.floor(views / 1000) * 50;
  }
  if (type === "short") {
    if (views < 10000) return 0;
    return Math.floor(views / 10000) * 50;
  }
  return 0;
};

const RevenuePage = () => {
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  // ------------------- Videos Revenue Data -------------------
  const videoRevenueData = (channelData?.videos || []).map((video) => {
    const rawTitle = video.title || "Untitled";
    return {
      title: rawTitle.length > 10 ? rawTitle.slice(0, 15) + "..." : rawTitle,
      revenue: calculateRevenue(video.views || 0, "video"),
    };
  });

  // ------------------- Shorts Revenue Data -------------------
  const shortRevenueData = (channelData?.shorts || []).map((short) => {
    const rawTitle = short.title || "Untitled";
    return {
      title: rawTitle.length > 10 ? rawTitle.slice(0, 15) + "..." : rawTitle,
      revenue: calculateRevenue(short.views || 0, "short"),
    };
  });

  // ------------------- Total Revenue -------------------
  const totalRevenue =
    videoRevenueData.reduce((sum, v) => sum + v.revenue, 0) +
    shortRevenueData.reduce((sum, s) => sum + s.revenue, 0);

  useEffect(() => {
    dispatch(setContentRevenue(totalRevenue));
  }, [totalRevenue, dispatch]);

  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading channel data...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 text-white space-y-8 mb-[50px]">
      
  <h1 className="text-2xl font-bold flex items-center gap-2">
        <RiMoneyRupeeCircleFill className="text-orange-400" size={30} />
        Revenue Analytics
      </h1>

      {/* Revenue Rules */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-400 rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">💡 Revenue Rules</h2>
        <ul className="text-sm space-y-1 text-gray-800">
          <li>🎥 Videos → ₹50 per 1,000 views (after first 1,000)</li>
          <li>🎬 Shorts → ₹50 per 10,000 views (after first 10,000)</li>
        </ul>
      </div>


      {/* Videos Revenue Chart */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Videos Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={videoRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Shorts Revenue Chart */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Shorts Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={shortRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4 text-center">
        <h2 className="text-lg font-semibold mb-2">Total Estimated Revenue</h2>
        <p className="text-3xl font-bold text-yellow-400">₹{totalRevenue}</p>
      </div>
    </div>
  );
};

export default RevenuePage;