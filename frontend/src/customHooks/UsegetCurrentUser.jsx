import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const useGetCurrentUser = () => {
    const dispatch = useDispatch()
    const {channelData} = useSelector(state=>state.user)

  useEffect(()=>{
   const fetchUser = async () => {
    try {
        const result = await axios.get(serverUrl + "/api/user/getcurrentuser" , {withCredentials:true})
        dispatch(setUserData(result.data))
        console.log(result.data)
    } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
    }
   }
   fetchUser()
  },[channelData, dispatch])
}

export default useGetCurrentUser