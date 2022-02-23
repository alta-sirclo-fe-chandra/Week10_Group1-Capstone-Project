import { FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import { BsFillClockFill } from "react-icons/bs";
import { RiErrorWarningFill } from "react-icons/ri";
import { useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Modal, Pagination } from "react-bootstrap";
import Lottie from "react-lottie";
import animationData from "../assets/lotties/loading-spinner.json";

const Schedule = () => {
  const [date, setDate] = useState(new Date());
  const user = [1, 2, 3, 4, 5];
  const [page] = useState([1]);
  const [activePage] = useState(1);
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="container">
      <h2>{moment().format("LL")}</h2>
      <div className="row justify-content-between align-items-center">
        <div className="col-auto">
          <p className="m-0">
            <BsFillClockFill className="me-2 mb-1" /> {moment().format("LT")}
          </p>
        </div>
        <div className="col-auto ms-auto pe-0">
          <FaMapMarkerAlt />
        </div>
        <div className="col-auto ps-0">
          <select className="form-select border-0">
            <option defaultValue="1">Traveloka Campus</option>
            <option value="2">SCBD Distric 8</option>
            <option value="3">BSD City</option>
          </select>
        </div>
      </div>
      <div className="row my-5 justify-content-evenly">
        <div className="col-md-5">
          <Calendar
            className="border-0 p-4 shadow rounded-3"
            onChange={setDate}
            value={date}
            tileContent={({ view }) =>
              view === "month" ? (
                <p className="mb-0 text-muted" style={{ fontSize: "0.75em" }}>
                  75
                </p>
              ) : null
            }
            onClickDay={() => setShowModal(true)}
          />
          <div className="row mt-5">
            <div className="col-auto">
              <RiErrorWarningFill className="fs-1" />
            </div>
            <div className="col-10">
              <p>
                Pilih lokasi dan klik tanggal untuk melakukan perubahan kuota
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <p className="fs-4">Karyawan Work from Office (50)</p>
          {user.map((index) => (
            <div key={index} className="row align-items-center my-3">
              <div className="col-auto">
                <div className="avatar bg-dark p-2 fs-6 rounded-circle text-white">
                  <FaUserAlt />
                </div>
              </div>
              <div className="col-auto">
                <p className="m-0 fw-bold">Arlene McCoy</p>
                <p className="m-0">
                  <small className="text-end">
                    {moment().format("LL")} @Traveloka Campus
                  </small>
                </p>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev />
              {page.map((item: any) => (
                <Pagination.Item key={item} active={activePage === item}>
                  {item}
                </Pagination.Item>
              ))}
              <Pagination.Next />
            </Pagination>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kuota Work from Office</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoading ? (
            <>
              <div className="row">
                <div className="col-6">
                  <p className="m-0">Tanggal</p>
                  <p className="fw-bold">{moment().format("LL")}</p>
                </div>
                <div className="col-6">
                  <p className="m-0">Lokasi</p>
                  <p className="fw-bold">Traveloka Campus</p>
                </div>
                <div className="col-auto">
                  <p className="mb-1">Kuota</p>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={75}
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <Lottie options={defaultOptions} height={100} width={100} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary rounded-3"
            data-bs-dismiss="modal"
            onClick={() => setShowModal(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success rounded-3 px-4"
            disabled={isLoading}
          >
            Update Kuota
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Schedule;
