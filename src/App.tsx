import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./pages/Homepage/Homepage";
import SignIn from "./pages/SignIn/SıgnIn";
import SignUp from "./pages/SingUp/SıngUp";
import NotFound from "./pages/NotFound/NotFound";
import AdminPanel from "./pages/AdminPanel";


function App() {
  return (
    <div className=" d-flex flex-column" >
      
      <Navbar />
      <div className="  app d-flex justify-content-center mt-2 mb-5  px-3 ">
        <Routes >
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </div>

      <div style={{ bottom: "0" }} className="position-relative w-500 ">
        <Footer />
      </div>
    </div>
  );
}

export default App;