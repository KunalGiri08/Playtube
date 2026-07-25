import { useState, useEffect } from "react";

let alertHandler; // External trigger

export const showCustomAlert = (message) => {
  if (alertHandler) alertHandler(message);
};

export default function CustomAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    alertHandler = (msg) => {
      setMessage(msg);
      setIsVisible(true);
    };
  }, []);

  return (
    isVisible && (
      <div className="fixed inset-0 flex items-start justify-center pt-[50px]  bg-black/50 z-50">
        <div className="bg-[#202124] text-white rounded-lg shadow-lg p-6 w-80">
          <p className="text-sm">{message}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsVisible(false)}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-full text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
  );
}