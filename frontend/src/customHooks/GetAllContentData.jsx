      import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAllShortData, setAllVideoData  } from '../redux/contentSlice';
import { serverUrl } from '../App';
import axios from 'axios';

const GetAllContentData = () => {
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
}

export default GetAllContentData