import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import Logo from "../assets/images/logo.svg";
import { useDispatch } from "react-redux";
import { reduxAction } from "../stores/actions/action";

const Navbar = () => {
  const dispatch = useDispatch();
  const [name] = useState("Customer");

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reduxAction("isLoggedIn", false));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <img
            src={Logo}
            alt="logo"
            height="60"
            className="d-inline-block align-text-top"
          />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item my-auto py-2 py-lg-0">
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle"
                  type="button"
                  id="dropdownMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hi, {name.split(" ")[0]}
                  <div className="avatar bg-dark p-2 fs-6 ms-2 rounded-circle text-white">
                    <FaUserAlt />
                  </div>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenu"
                >
                  <li>
                    <NavLink
                      className="bg-transparent text-black dropdown-item"
                      to="/"
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
