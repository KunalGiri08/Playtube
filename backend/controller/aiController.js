import Video from "../model/videoModel.js";
import Short from "../model/shortModel.js";
import Playlist from "../model/playlistModel.js";
import Channel from "../model/channelModel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

// Helper to escape regex special characters
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Fast MongoDB search prioritizing database results without blocking for AI
 */
export const searchContent = async (req, res) => {
  try {
    const rawInput = req.body?.input || req.query?.q || req.query?.input || "";
    const input = String(rawInput).trim();

    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // If client explicitly requests AI search, route to AI search
    const useAi = Boolean(req.body?.useAi || req.query?.ai === "true");
    if (useAi) {
      return searchWithAi(req, res);
    }

    const cleanQuery = escapeRegex(input);
    const regex = new RegExp(cleanQuery, "i");
    const words = input.split(/\s+/).map((w) => escapeRegex(w.trim())).filter(Boolean);

    // Step 1: Query matching channels first so we can link channel matches
    const matchedChannels = await Channel.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
      ],
    })
      .select("_id name avatar description category")
      .lean();

    const channelIds = matchedChannels.map((c) => c._id);

    // Build conditions for videos, shorts, playlists
    const videoOr = [
      { title: regex },
      { description: regex },
      { tags: regex },
    ];
    const shortOr = [
      { title: regex },
      { tags: regex },
    ];
    const playlistOr = [
      { title: regex },
      { description: regex },
    ];

    // If multi-word query, also match on individual words
    if (words.length > 1) {
      words.forEach((w) => {
        const wRegex = new RegExp(w, "i");
        videoOr.push({ title: wRegex }, { description: wRegex }, { tags: wRegex });
        shortOr.push({ title: wRegex }, { tags: wRegex });
        playlistOr.push({ title: wRegex }, { description: wRegex });
      });
    }

    if (channelIds.length > 0) {
      videoOr.push({ channel: { $in: channelIds } });
      shortOr.push({ channel: { $in: channelIds } });
      playlistOr.push({ channel: { $in: channelIds } });
    }

    // Step 2: Parallel execution for videos, shorts, and playlists
    const [videos, shorts, playlists] = await Promise.all([
      Video.find({ $or: videoOr })
        .populate("channel", "name avatar")
        .select("title description videoUrl thumbnail tags views createdAt channel")
        .sort({ createdAt: -1 })
        .lean(),
      Short.find({ $or: shortOr })
        .populate("channel", "name avatar")
        .select("title shortUrl views createdAt channel")
        .sort({ createdAt: -1 })
        .lean(),
      Playlist.find({ $or: playlistOr })
        .populate("channel", "name avatar")
        .select("title description videos saveBy createdAt channel")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return res.status(200).json({
      keyword: input,
      channels: matchedChannels,
      videos: videos || [],
      shorts: shorts || [],
      playlists: playlists || [],
    });
  } catch (error) {
    console.error("Fast search error:", error);
    return res
      .status(500)
      .json({ message: `Failed to search: ${error.message}` });
  }
};

/**
 * AI-enhanced search for keyword autocorrect and semantic expansion
 */
export const searchWithAi = async (req, res) => {
  try {
    const rawInput = req.body?.input || req.query?.q || req.query?.input || "";
    const input = String(rawInput).trim();

    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let keyword = input;
    let searchWords = [];

    // Attempt Gemini keyword extraction if API key is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `You are a search assistant for a video streaming platform. 
The user query is: "${input}"

🎯 Your job:
- If query has typos, correct them.
- If query has multiple words, break them into meaningful keywords.
- Return only the corrected word(s), comma-separated.
- Do not explain, only return keyword(s).`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });

        if (response?.text) {
          const aiText = response.text.trim().replace(/[\n\r]+/g, "");
          if (aiText) {
            keyword = aiText;
          }
        }
      } catch (aiError) {
        console.warn("Gemini AI search fallback to direct query:", aiError?.message || aiError);
      }
    }

    const aiWords = keyword.split(",").map((w) => w.trim()).filter(Boolean);
    const inputWords = input.split(/\s+/).map((w) => w.trim()).filter(Boolean);
    const combinedSet = new Set([input, ...aiWords, ...inputWords]);
    searchWords = Array.from(combinedSet).filter(Boolean);

    const buildRegexQuery = (fields) => {
      return {
        $or: searchWords.map((word) => ({
          $or: fields.map((field) => ({
            [field]: { $regex: escapeRegex(word), $options: "i" },
          })),
        })),
      };
    };

    // Parallel queries
    const matchedChannels = await Channel.find(
      buildRegexQuery(["name", "description", "category"])
    ).select("_id name avatar description category").lean();

    const channelIds = matchedChannels.map((c) => c._id);

    const [videos, shorts, playlists] = await Promise.all([
      Video.find({
        $or: [
          buildRegexQuery(["title", "description", "tags"]),
          { channel: { $in: channelIds } },
        ],
      })
        .populate("channel", "name avatar")
        .select("title description videoUrl thumbnail tags views createdAt channel")
        .sort({ createdAt: -1 })
        .lean(),
      Short.find({
        $or: [
          buildRegexQuery(["title", "tags"]),
          { channel: { $in: channelIds } },
        ],
      })
        .populate("channel", "name avatar")
        .select("title shortUrl views createdAt channel")
        .sort({ createdAt: -1 })
        .lean(),
      Playlist.find({
        $or: [
          buildRegexQuery(["title", "description"]),
          { channel: { $in: channelIds } },
        ],
      })
        .populate("channel", "name avatar")
        .select("title description videos saveBy createdAt channel")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return res.status(200).json({
      keyword,
      channels: matchedChannels,
      videos: videos || [],
      shorts: shorts || [],
      playlists: playlists || [],
    });
  } catch (error) {
    console.error("Search error:", error);
    return res
      .status(500)
      .json({ message: `Failed to search: ${error.message}` });
  }
};

export const filterCategoryWithAi = async (req, res) => {
  try {
    const rawInput = req.body?.input || req.query?.category || req.query?.input || "";
    const input = String(rawInput).trim();

    if (!input) {
      return res.status(400).json({ message: "Category query is required" });
    }

    const categories = [
      "Music", "Gaming", "Movies", "TV Shows", "News",
      "Trending", "Entertainment", "Education", "Science & Tech",
      "Travel", "Fashion", "Cooking", "Sports", "Pets",
      "Art", "Comedy", "Vlogs"
    ];

    let keywords = [input];

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `You are a category classifier for a video streaming platform.

The user query is: "${input}"

🎯 Your job:
- Match this query with the most relevant categories from this list:
${categories.join(", ")}
- If more than one category fits, return them comma-separated.
- If nothing fits, return the single closest category.
- Do NOT explain. Do NOT return JSON. Only return category names.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });

        if (response?.text) {
          const keywordText = response.text.trim();
          const parsed = keywordText.split(",").map((k) => k.trim()).filter(Boolean);
          if (parsed.length > 0) {
            keywords = parsed;
          }
        }
      } catch (aiErr) {
        console.warn("Gemini AI filter fallback:", aiErr?.message || aiErr);
      }
    }

    const videoConditions = [];
    const shortConditions = [];
    const channelConditions = [];

    keywords.forEach((kw) => {
      const safeKw = escapeRegex(kw);
      videoConditions.push(
        { title: { $regex: safeKw, $options: "i" } },
        { description: { $regex: safeKw, $options: "i" } },
        { tags: { $regex: safeKw, $options: "i" } }
      );
      shortConditions.push(
        { title: { $regex: safeKw, $options: "i" } },
        { tags: { $regex: safeKw, $options: "i" } }
      );
      channelConditions.push(
        { name: { $regex: safeKw, $options: "i" } },
        { category: { $regex: safeKw, $options: "i" } },
        { description: { $regex: safeKw, $options: "i" } }
      );
    });

    const [videos, shorts, channels] = await Promise.all([
      Video.find({ $or: videoConditions })
        .populate("channel", "name avatar")
        .select("title description videoUrl thumbnail tags views createdAt channel")
        .lean(),
      Short.find({ $or: shortConditions })
        .populate("channel", "name avatar")
        .select("title shortUrl views createdAt channel")
        .lean(),
      Channel.find({ $or: channelConditions })
        .select("_id name avatar description category")
        .lean(),
    ]);

    return res.status(200).json({
      videos: videos || [],
      shorts: shorts || [],
      channels: channels || [],
      keywords,
    });
  } catch (error) {
    console.error("Filter error:", error);
    return res
      .status(500)
      .json({ message: `Failed to filter: ${error.message}` });
  }
};