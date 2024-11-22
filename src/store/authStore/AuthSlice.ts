import {  createSlice } from "@reduxjs/toolkit";
import { setToken } from "../../utils/axiosInterceptors";
import { loadAuthState } from "./storage";



export const authSlice =createSlice({
    name:'auth',
    initialState: loadAuthState(), 
    reducers:{
        
        loginSuccess:(state,action)=>{

            state.id=action.payload.id;
            
            state.email=action.payload.email;
            state.role = action.payload.role;
           setToken(action.payload.token)
        },

        logoutSuccess:(state)=>{

            state.id=0;
            
            delete state.email
            delete state.role
            delete state.isActive
            setToken()
        },
        setActive:(state,action)=>{

           
           state.isActive = action.payload;
           
        },

       

    }
})


export const{ loginSuccess,logoutSuccess,setActive}=authSlice.actions;