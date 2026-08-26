import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",

    initialState: {
       userData:null,
        channelData:null,
        allChannelData:null,
        subscribeChannel:null,
        subscribeVideo:null,
        subscribeShort:null,
        videoHistory:null,
        shortHistory:null
    },

    reducers: {
        setUserData:(state,action)=>{
            state.userData = action.payload
        },
         setChannelData:(state,action)=>{
            state.channelData = action.payload
        },
        setAllChannelData:(state,action)=>{
            state.allChannelData = action.payload
        },
        setSubscribeChannel:(state,action)=>{
            state.subscribeChannel = action.payload
        },
        setSubscribeVideo:(state,action)=>{
            state.subscribeVideo = action.payload
        },
        setSubscribeShort:(state,action)=>{
            state.subscribeShort = action.payload
        },
        setVideoHistory:(state,action)=>{
            state.videoHistory = action.payload
        },
        setShortHistory:(state,action)=>{
            state.shortHistory = action.payload
        },
    }
});

export const {setUserData} = userSlice.actions
export const {setAllChannelData} = userSlice.actions
export const {setChannelData} = userSlice.actions
export const {setSubscribeChannel} = userSlice.actions
export const {setSubscribeVideo} = userSlice.actions
export const {setSubscribeShort} = userSlice.actions
export const {setVideoHistory} = userSlice.actions
export const {setShortHistory} = userSlice.actions
export default userSlice.reducer