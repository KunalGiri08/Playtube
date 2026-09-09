import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAllPostData, setAllShortData, setAllVideoData  } from '../redux/contentSlice';
import { serverUrl } from '../App';
import axios from 'axios';

const UsegetAllContent = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
      const fetchAllVideos = async () => {
        
        try {
          const res = await axios.get(
            `${serverUrl}/api/content/allvideos`,
            { withCredentials: true }
          );
          dispatch(setAllVideoData(res.data || []));
          console.log(res.data)
        } catch (err) {
          console.error(err);
        }
      };
      fetchAllVideos();
    }, []);
     useEffect(() => {
      const fetchAllShorts = async () => {
        
        try {
          const res = await axios.get(
            `${serverUrl}/api/content/allshorts`,
            { withCredentials: true }
          );
          dispatch(setAllShortData(res.data || []));
          console.log(res.data)
        } catch (err) {
          console.error(err);
        }
      };
      fetchAllShorts();
    }, []);

    useEffect(() => {
      const fetchAllPosts = async () => {
        
        try {
          const res = await axios.get(
            `${serverUrl}/api/content/allposts`,
            { withCredentials: true }
          );
          dispatch(setAllPostData(res.data || []));
          console.log(res.data)
        } catch (err) {
          console.error(err);
        }
      };
      fetchAllPosts();
    }, []);
  
}

export default UsegetAllContent