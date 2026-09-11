import React from "react";
import { useSelector } from "react-redux";
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

const AnalyticsPage = () => {
  const { channelData } = useSelector((state) => state.user);

  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading channel data...
      </div>
    );
  }

  // ------------------- Video Chart Data -------------------
  const videoChartData = (channelData.videos || []).map((video) => {
    const rawTitle = video.title || "Untitled";
    return {
      title: rawTitle.length > 10 ? rawTitle.slice(0, 10) + "..." : rawTitle, // short title for x-axis
      views: video.views || 0,
    };
  });

  // ------------------- Shorts Chart Data -------------------
  const shortChartData = (channelData.shorts || []).map((short) => {
    const rawTitle = short.title || "Untitled";
    return {
      title: rawTitle.length > 10 ? rawTitle.slice(0, 10) + "..." : rawTitle,
      views: short.views || 0,
    };
  });

  return (
    <div className="w-full min-h-screen p-4 sm:p-6  text-white space-y-8 mb-[50px]">
      <h1 className="text-2xl font-bold">Channel Analytics (Video & Shorts Views)</h1>

      {/* Videos Chart */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Videos Views</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={videoChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Shorts Chart */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Shorts Views</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={shortChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPage;