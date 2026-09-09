import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { serverUrl } from "../App";
import axios from "axios";
import { setRecommendationData } from "../redux/contentSlice";

const UseGetRecommendation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/user/getrecommendation`,
          { withCredentials: true }
        );
        dispatch(setRecommendationData(res.data))
        console.log("Recommendation data:", res.data);
      } catch (err) {
        console.error("Recommendation fetch error:", err);
      }
    };

    fetchRecommendation();
  }, [dispatch]);

  return null; // hook kuch render nahi karega
};

export default UseGetRecommendation;