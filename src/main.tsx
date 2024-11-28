import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { injectStore } from './utils/axiosInterceptors.ts';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

injectStore(store)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>  <BrowserRouter 
basename='/xpreia2/'
  >
    <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        
      />
  <App />
</BrowserRouter></Provider>


  
)
