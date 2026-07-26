import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const getCurrentUser = () => {
    const dispatch = useDispatch()

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
  },[])
}

export default getCurrentUser