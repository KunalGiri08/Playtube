import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
    name:"content",
    initialState:{
        videoData:null,
        allVideoData:null,
        allShortData:null,
        allPostData:null,
        recommendationData:null,
        contentRevenue:null
        
        
    },
    reducers:{
        setVideoData:(state,action)=>{
            state.videoData = action.payload
        },
        setAllVideoData:(state,action)=>{
            state.allVideoData = action.payload
        },
        setAllShortData:(state,action)=>{
            state.allShortData = action.payload
        },
         setAllPostData:(state,action)=>{
            state.allPostData = action.payload
        },
        setRecommendationData:(state,action)=>{
            state.recommendationData = action.payload
        },
        setContentRevenue:(state,action)=>{
            state.contentRevenue = action.payload
        },
        
        
        
    }
})
 
export const {setVideoData} = contentSlice.actions
export const {setAllVideoData} = contentSlice.actions
export const {setAllShortData} = contentSlice.actions
export const {setAllPostData} = contentSlice.actions
export const {setRecommendationData} = contentSlice.actions
export const {setContentRevenue} = contentSlice.actions

export default contentSlice.reducer