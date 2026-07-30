import React, { useEffect } from 'react'
import { useDispatch, } from 'react-redux'
import { setChannelData } from '../redux/userSlice'
import axios from 'axios'
import { serverUrl } from '../App'

const UsegetChannel = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
   const fetchChannel = async () => {
    try {
        const result = await axios.get(serverUrl + "/api/user/getchannel" , {withCredentials:true})
        dispatch(setChannelData(result.data))
        console.log(result.data)
    } catch (error) {
        console.log(error)
        dispatch(setChannelData(null))
    }
   }
   fetchChannel()
  },[])
}

export default UsegetChannel