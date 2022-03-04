import axios from "axios";
import Avatar from "react-avatar";
import Attendance from "../components/attendance";
import Certificate from "../components/certificate";
import Schedule from "../components/schedule";
import { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsCalendarCheck } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { IoBriefcaseOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { reduxAction } from "../stores/actions/action";
import { user } from "../types";

const Index = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<user>();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    await axios.get("/profile").then((res) => {
      const { data } = res;
      setData(data);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reduxAction("isLoggedIn", false));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-3">
          <div
            id="sidebar"
            className="sticky-top d-flex flex-column align-items-stretch py-3"
            style={{ zIndex: "990" }}
          >
            <div
              className="d-flex flex-column shadow rounded-3 p-3"
              style={{ minHeight: "70vh" }}
            >
              <div className="text-center">
                {data?.image_url && (
                  <Avatar
                    className="shadow-sm"
                    round={true}
                    src={data?.image_url}
                  />
                )}
                <h5 className="text-capitalize my-3">{data?.name}</h5>
              </div>
              <a
                className="nav-link d-flex align-items-center text-dark"
                href="#schedule"
              >
                <BsCalendarCheck className="me-3 fs-5" /> Schedule
              </a>
              <a
                className="nav-link d-flex align-items-center text-dark"
                href="#attendance"
              >
                <IoBriefcaseOutline className="me-3 fs-5" /> Request WFO
              </a>
              <a
                className="nav-link d-flex align-items-center text-dark"
                href="#certificate"
              >
                <FaUsers className="me-3 fs-5" /> Employee
              </a>
              <div
                className="nav-link d-flex align-items-center text-dark mt-auto"
                style={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                <BiLogOut className="fs-4 me-3" /> Logout
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-md-9"
          data-bs-spy="scroll"
          data-bs-target="#sidebar"
          data-bs-offset="0"
          tabIndex={0}
        >
          <Schedule />
          <Attendance />
          <Certificate />
        </div>
      </div>
    </div>
  );
};

export default Index;
