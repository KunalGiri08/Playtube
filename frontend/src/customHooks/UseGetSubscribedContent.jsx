import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSubscribeChannel, setSubscribeVideo, setSubscribeShort } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";

const UseGetSubscribedContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSubscribedContent = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/subscribedcontent", {
          withCredentials: true
        });

        // Backend se aaya hua data
        const { subscribedChannels, videos, shorts } = result.data;

        // Redux me save karo
        dispatch(setSubscribeChannel(subscribedChannels || []));
        dispatch(setSubscribeVideo(videos || []));
        dispatch(setSubscribeShort(shorts || []));

        console.log("Subscribed Content:", result.data);
      } catch (error) {
        console.error("Error fetching subscribed content:", error);

        // Agar error ho to empty arrays dispatch kar do
        dispatch(setSubscribeChannel([]));
        dispatch(setSubscribeVideo([]));
        dispatch(setSubscribeShort([]));
      }
    };

    fetchSubscribedContent();
  }, [dispatch]);
};

export default UseGetSubscribedContent;