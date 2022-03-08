import axios from "axios";
import Avatar from "react-avatar";
import Attendance from "../components/attendance";
import Certificate from "../components/certificate";
import Schedule from "../components/schedule";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BsCalendarCheck, BsChevronDoubleRight } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { IoBriefcaseOutline } from "react-icons/io5";
import { user } from "../types";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const Index = () => {
  const [data, setData] = useState<user>();
  const [modalPwd, setModalPwd] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    await axios.get("/profile").then((res) => {
      const { data } = res;
      setData(data);
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .put(`users/${data?.id}`, {
        ...data,
        password,
      })
      .then(() => {
        Swal.fire("Good job!", "Password has been updated", "success");
      })
      .catch((err: any) => {
        Swal.fire("I'm sorry", err.message, "error");
      })
      .finally(() => setModalPwd(false));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-3 d-none d-lg-block">
          <div
            id="sidebar"
            className="sticky-top d-flex flex-column align-items-stretch py-3"
            style={{ zIndex: "990" }}
          >
            <div
              className="d-flex flex-column p-3"
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
                <button
                  className="btn btn-success btn-sm mb-3"
                  onClick={() => setModalPwd(true)}
                >
                  Change Password
                </button>
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
            </div>
          </div>
        </div>
        <div className="col d-block d-lg-none" style={{ zIndex: "1000" }}>
          <div className="col-8 col-md-4 position-fixed">
            <button
              className="btn shadow-sm btn-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse"
            >
              <BsChevronDoubleRight />
            </button>
            <div className="collapse" id="collapse">
              <div className="card card-body">
                <div
                  id="sidebar"
                  className="sticky-top d-flex flex-column align-items-stretch py-3"
                  style={{ zIndex: "990" }}
                >
                  <div className="d-flex flex-column p-3">
                    <div className="text-center">
                      {data?.image_url && (
                        <Avatar
                          className="shadow-sm"
                          round={true}
                          src={data?.image_url}
                        />
                      )}
                      <h5 className="text-capitalize my-3">{data?.name}</h5>
                      <button
                        className="btn btn-success btn-sm mb-3"
                        onClick={() => setModalPwd(true)}
                      >
                        Change Password
                      </button>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <Schedule />
          <Attendance />
          <Certificate />
        </div>
      </div>
      <Modal show={modalPwd} onHide={() => setModalPwd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="mt-3" onSubmit={handleSubmit}>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <div className="col d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-success">
                Change
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Index;
