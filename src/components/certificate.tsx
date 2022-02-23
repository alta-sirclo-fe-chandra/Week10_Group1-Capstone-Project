import { useState } from "react";
import Avatar from "react-avatar";
import { Modal, Pagination } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "react-datepicker/dist/react-datepicker.css";
import { BsCheckCircleFill, BsThreeDots } from "react-icons/bs";
import { IoAlertCircle } from "react-icons/io5";
import Lottie from "react-lottie";
import animationData from "../assets/lotties/loading-spinner.json";

const Certificate = () => {
  const [page] = useState([1]);
  const [activePage] = useState(1);
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const data = [
    {
      id: 1,
      name: "Arlene McCoy",
      NIK: "30124927412",
      status: "Lengkap",
    },
    {
      id: 2,
      name: "Arlene McCoy",
      NIK: "30124927412",
      status: "Belum Lengkap",
    },
    {
      id: 3,
      name: "Arlene McCoy",
      NIK: "30124927412",
      status: "Lengkap",
    },
  ];

  const columns = [
    {
      name: "NO.",
      selector: (row: any) => row.id,
      grow: 0,
    },
    {
      name: "KARYAWAN",
      selector: (row: any) => row.name,
    },
    {
      name: "NIK",
      selector: (row: any) => row.NIK,
    },
    {
      name: "SERTIFIKAT VAKSIN",
      selector: (row: any) => (
        <div className="d-flex">
          <BsCheckCircleFill size="33" color="#6C757D" className="me-2" />
          <BsCheckCircleFill size="33" color="#6C757D" className="me-2" />
          <Avatar value="3" size="33" round={true} color="#c4c4c4" />
        </div>
      ),
      grow: 1.5,
    },
    {
      name: "STATUS",
      selector: (row: any) => (
        <span className="badge rounded-pill bg-secondary">{row.status}</span>
      ),
      grow: 1.25,
    },
    {
      name: "ACTION",
      selector: (row: any) => (
        <span
          className="btn btn-secondary btn-sm"
          onClick={() => setShowModal(true)}
        >
          <BsThreeDots className="fs-4" />
        </span>
      ),
      grow: 0,
    },
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="container mb-5">
      <p className="fs-4 mb-1">Sertifikat Vaksin Karyawan</p>
      <p>1420 Karyawan</p>
      <div className="row justify-content-end">
        <div className="col-auto">
          <select className="form-select">
            <option defaultValue="1">Semua status</option>
            <option value="2">Lengkap</option>
            <option value="3">Belum Lengkap</option>
          </select>
        </div>
      </div>
      <div className="row justify-content-center mt-3">
        <div className="col">
          <DataTable columns={columns} data={data} />
        </div>
        <div className="d-flex justify-content-end mt-3">
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kurasi Sertifikat Vaksin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoading ? (
            <>
              <div className="row justify-content-between">
                <div className="col-12 d-flex align-items-center mb-3">
                  <p className="m-0 me-3">Sertifikat Vaksin</p>
                  <BsCheckCircleFill
                    size="33"
                    color="#6C757D"
                    className="me-2"
                  />
                  <BsCheckCircleFill
                    size="33"
                    color="#6C757D"
                    className="me-2"
                  />
                  <Avatar value="3" size="33" round={true} color="#c4c4c4" />
                </div>
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                          <p className="m-0">Pemohon</p>
                          <p className="fw-bold">Arlene McCoy</p>
                        </div>
                        <div className="col-6">
                          <p className="m-0">NIK</p>
                          <p className="fw-bold">123435678</p>
                        </div>
                        <div className="col">
                          <div className="alert alert-danger m-0">
                            <IoAlertCircle className="fs-5 me-2 mb-1" />
                            <span>Vaksinasi belum lengkap</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card mb-3">
                    <img
                      src="https://img.icons8.com/external-smashingstocks-detailed-outline-smashing-stocks/344/external-checklist-business-management-smashingstocks-detailed-outline-smashing-stocks.png"
                      className="card-img-top"
                      alt="..."
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="card">
                    <div className="card-body py-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="verifikasi"
                          id="setuju"
                          value="option1"
                        />
                        <label className="form-check-label" htmlFor="setuju">
                          Setuju
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card">
                    <div className="card-body py-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="verifikasi"
                          id="tolak"
                          value="option2"
                        />
                        <label className="form-check-label" htmlFor="tolak">
                          Tolak
                        </label>
                      </div>
                    </div>
                  </div>
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
            Konfirmasi
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Certificate;
