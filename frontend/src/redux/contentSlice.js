import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
    name:"content",
    initialState:{
        
        allVideoData:null,
        allShortData:null,
        
    },
    reducers:{
      
        setAllVideoData:(state,action)=>{
            state.allVideoData = action.payload
        },
        setAllShortData:(state,action)=>{
            state.allShortData = action.payload
        },
        
       
    }
})
 
export const {setAllVideoData} = contentSlice.actions
export const {setAllShortData} = contentSlice.actions
export default contentSlice.reducer