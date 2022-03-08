import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { reduxAction } from "../stores/actions/action";
import { user } from "../types";
import axios from "axios";
import Logo from "../assets/images/logo.svg";
import Avatar from "react-avatar";

const Navbar = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<user>();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reduxAction("isLoggedIn", false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    await axios.get("/profile").then((res) => {
      const { data } = res;
      setData(data);
    });
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
            <li className="nav-item ms-auto my-auto py-2 py-lg-0">
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle text-capitalize"
                  type="button"
                  id="dropdownMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hi, {data?.name.split(" ")[0]}
                  <span className="mx-1">
                    {data?.image_url && (
                      <Avatar
                        className="shadow-sm"
                        size="33"
                        round={true}
                        src={data?.image_url}
                      />
                    )}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenu"
                >
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <BiLogOut className="fs-4" /> Logout
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
