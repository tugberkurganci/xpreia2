import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authStore/AuthSlice";
import { storeAuthState } from "./authStore/storage";

export const store = configureStore({

    reducer :{
        auth:authSlice.reducer,
      
        
    }
});

store.subscribe(()=>{
    storeAuthState(store.getState().auth)

})