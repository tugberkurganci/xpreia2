import {  createSlice } from "@reduxjs/toolkit";
import { loadRentalState } from "./authStore/storage";




export const rentalSlice =createSlice({
    name:'rental',
    initialState:loadRentalState(), 
    
    reducers:{
        
        loadRental:(state,action)=>{

            state.brandTone=action.payload;
       
        },
        loadcompanyInfo:(state,action)=>{

            state.companyInfo=action.payload;
           
        },

        deleteRental:(state)=>{

             state.startDate=""
             state.endDate=""
             state.pickUpLocation=""
             state.dropOffLocation=""
             state.carId=0

          
        },

       

    }
})







export const{ loadRental,deleteRental,loadcompanyInfo}=rentalSlice.actions;