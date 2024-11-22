import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authStore/AuthSlice";
import { storeAuthState, storeRentalState } from "./authStore/storage";
import { rentalSlice } from "./rentalSlice";

export const store = configureStore({

    reducer :{
        auth:authSlice.reducer,
        rental:rentalSlice.reducer

        
    }
});

store.subscribe(()=>{
    storeAuthState(store.getState().auth)
    storeRentalState(store.getState().rental)

})