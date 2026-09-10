import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setVideoData } from '../redux/contentSlice';
import { serverUrl } from '../App';
import axios from 'axios';

const UsegetChannelContent = () => {
    const dispatch = useDispatch()
    const { channelData } = useSelector(state => state.user)
    useEffect(() => {
        const fetchChannelVideos = async () => {
            if (!channelData?._id) return;

            try {
                const res = await axios.post(
                    `${serverUrl}/api/content/get-videos`,
                    { channelId: channelData._id },
                    { withCredentials: true }
                );
                dispatch(setVideoData(res.data.videos || []));
                console.log(res.data.videos)
            } catch (err) {
                console.error(err);
            }
        };
        fetchChannelVideos();
    }, [channelData]);

}

export default UsegetChannelContent