import React, { useState } from "react";

const Description = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null; // Agar text nahi hai toh kuch bhi show na ho

  const showButton = text.length > 100;

  return (
    <div>
      <p className={`text-sm text-gray-300 whitespace-pre-line ${expanded ? "" : "line-clamp-1"}`}>
        {text}
      </p>

      {showButton && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-400 mt-1 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default Description;