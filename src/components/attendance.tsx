import moment from "moment";
import { useState } from "react";
import { Modal, Pagination } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCheckCircleFill, BsThreeDots } from "react-icons/bs";
import Lottie from "react-lottie";
import animationData from "../assets/lotties/loading-spinner.json";

const Attendance = () => {
  const [dateRange, setDateRange] = useState<any[]>([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [page] = useState([1]);
  const [activePage] = useState(1);
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const data = [
    {
      id: 1,
      date: "22 Feb 2022",
      name: "Arlene McCoy",
      office: "Traveloka Campus",
      status: "menunggu verifikasi",
    },
    {
      id: 2,
      date: "22 Feb 2022",
      name: "Arlene McCoy",
      office: "Traveloka Campus",
      status: "menunggu verifikasi",
    },
    {
      id: 3,
      date: "22 Feb 2022",
      name: "Arlene McCoy",
      office: "Traveloka Campus",
      status: "menunggu verifikasi",
    },
  ];

  const columns = [
    {
      name: "NO.",
      selector: (row: any) => row.id,
      grow: 0,
    },
    {
      name: "DATE",
      selector: (row: any) => row.date,
      grow: 1,
    },
    {
      name: "KARYAWAN",
      selector: (row: any) => row.name,
      grow: 1,
    },
    {
      name: "LOKASI WFO",
      selector: (row: any) => row.office,
      grow: 1,
    },
    {
      name: "STATUS",
      selector: (row: any) => (
        <span className="badge rounded-pill bg-warning">{row.status}</span>
      ),
      grow: 1.5,
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
      grow: 0.5,
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
      <p className="fs-4 mb-1">Daftar Permintaan Karyawan Work from Office</p>
      <p>420 Karyawan</p>
      <div className="row justify-content-end g-3">
        <div className="col-md-3">
          <ReactDatePicker
            className="form-select"
            dateFormat={"dd MMM yyyy"}
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
          />
        </div>
        <div className="col-auto">
          <select className="form-select">
            <option defaultValue="1">Semua status</option>
            <option value="2">Menunggu verifikasi</option>
            <option value="3">Disetujui</option>
            <option value="4">Ditolak</option>
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
          <Modal.Title>Request Work from Office</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoading ? (
            <>
              <div className="row justify-content-between">
                <div className="col-4">
                  <p className="m-0">Tanggal</p>
                  <p className="fw-bold">{moment().format("LL")}</p>
                </div>
                <div className="col-4">
                  <p className="m-0">Lokasi</p>
                  <p className="fw-bold">Traveloka Campus</p>
                </div>
                <div className="col-3">
                  <p className="mb-0">Kuota Terisa</p>
                  <p className="fw-bold">3</p>
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
                          <div className="alert alert-info m-0">
                            <BsCheckCircleFill className="me-2 mb-1" />
                            <span>Sudah divaksinasi</span>
                          </div>
                        </div>
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
                <div className="col-12 mt-3">
                  <label htmlFor="keterangan" className="form-label">
                    Keterangan alasan
                  </label>
                  <textarea
                    className="form-control"
                    id="keterangan"
                    placeholder="Kuota tidak mencukupi"
                    rows={2}
                  ></textarea>
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

export default Attendance;
