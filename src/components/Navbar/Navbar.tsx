import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import "./navbar.css";
import { logoutSuccess } from "../../store/authStore/AuthSlice";

type Props = {};

const Navbar = (props: Props) => {
  const [activeKey, setActiveKey] = useState<string>("home");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authState = useSelector((store: any) => store.auth);

  const handleLogout = () => {
   
   dispatch(logoutSuccess())
    navigate("/");
  };

  const handleNavClick = (key: string) => {
    setActiveKey(key);
  };

  return (
    <nav className="mb-5 navbar navbar-expand-lg bg-body-tertiary">
      <div
        className="mx-3 collapse navbar-collapse d-flex justify-content-between align-itmes-center"
        id="navbarSupportedContent"
      >
        <Link
          className="navbar-brand"
          to="/"
          onClick={() => handleNavClick("home")}
        >
          {/* Logo veya marka adı buraya */}
        </Link>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 col flex-row gap-2">
          <li className="nav-item">
            <Link
              className={`nav-link ${
                activeKey === "home" &&
                "active bg-primary rounded-1 text-light"
              }`}
              to="/"
              onClick={() => handleNavClick("home")}
            >
              Home
            </Link>
          </li>

          {authState.role === "ADMIN" && (
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeKey === "admin" &&
                  "active bg-primary rounded-1 text-light"
                }`}
                to="/dashboard"
                onClick={() => handleNavClick("admin")}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="col text-end">
          {authState.id === 0 ? (
            <div className="d-flex align-items-center justify-content-end">
              <div className="btn btn-primary">
                <Link
                  to={"/login"}
                  className="text-light d-flex align-items-center gap-1"
                >
                  <CiLogin size={25} />
                  <span>Login</span>
                </Link>
              </div>

              <div className="btn btn-primary ms-3">
                <Link
                  to={"/sign-up"}
                  className="text-light d-flex align-items-center gap-1"
                >
                  <CgProfile size={25} />
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-end">
              <div className="btn btn-primary">
              
                  <CgProfile size={25} />
                  <span>{authState.email}</span>
                
              </div>

              <div onClick={handleLogout} className="btn btn-primary ms-3">
                <Link
                  to={"/"}
                  className="text-light d-flex align-items-center gap-1"
                >
                  <IoIosLogOut size={25} />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
