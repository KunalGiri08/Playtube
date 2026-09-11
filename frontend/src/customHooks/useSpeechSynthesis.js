import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook providing a safe interface to window.speechSynthesis
 */
export const useSpeechSynthesis = () => {
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const currentUtteranceRef = useRef(null);

  // Stop any active or queued speech
  const stopSpeaking = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current = null;
    } catch (err) {
      console.error("Error stopping speech synthesis:", err);
    }
  }, [isSupported]);

  // Speak a message aloud
  const speakText = useCallback(
    (text, options = {}) => {
      if (!isSupported || !text || !text.trim()) return;

      try {
        // Cancel any previous speech before starting
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.lang = options.lang || "en-US";
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        utterance.onend = () => {
          currentUtteranceRef.current = null;
          if (options.onEnd) options.onEnd();
        };

        utterance.onerror = (e) => {
          // If canceled intentionally, error could be 'interrupted' or 'canceled'
          if (e.error !== "interrupted" && e.error !== "canceled") {
            console.error("SpeechSynthesis error:", e.error);
          }
          currentUtteranceRef.current = null;
        };

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Speech synthesis invocation error:", err);
      }
    },
    [isSupported]
  );

  // Helper for voice search result phrasing
  const speakSearchResult = useCallback(
    (query, count) => {
      if (!query) return;
      const cleanQuery = query.trim();
      let text = "";

      if (count > 0) {
        const plural = count === 1 ? "video" : "videos";
        text = `Showing results for ${cleanQuery}. I found ${count} ${plural}.`;
      } else {
        text = `I couldn't find any videos for ${cleanQuery}.`;
      }

      speakText(text);
    },
    [speakText]
  );

  // Clean up any ongoing speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  return {
    isSupported,
    speakText,
    speakSearchResult,
    stopSpeaking,
  };
};

export default useSpeechSynthesis;
