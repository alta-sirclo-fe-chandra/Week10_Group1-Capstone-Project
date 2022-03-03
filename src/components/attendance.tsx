/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import moment from "moment";
import Lottie from "react-lottie";
import Swal from "sweetalert2";
import animationData from "../assets/lotties/loading-spinner.json";
import DataTable from "react-data-table-component";
import "react-datepicker/dist/react-datepicker.css";
import { ChangeEvent, useEffect, useState } from "react";
import { Modal, Pagination } from "react-bootstrap";
import { BsCheckCircleFill, BsThreeDots } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import { attendance, office } from "../types";

const Attendance = () => {
  const [page, setPage] = useState([1]);
  const [totalPage, setTotalPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [attendance, setAttendance] = useState<attendance[]>([]);
  const [rowData, setRowData] = useState<attendance>({});
  const [status, setStatus] = useState("");
  const [statusInfo, setStatusInfo] = useState("");
  const [defaultOffice, setDefaultOffice] = useState<office>({});
  const [office, setOffice] = useState<office[]>([]);
  const [officeId, setOfficeId] = useState(1);

  const columns = [
    {
      name: "#ID",
      selector: (row: any) => row.id,
      grow: 0,
    },
    {
      name: "TANGGAL",
      selector: (row: any) => moment(row.date).format("L"),
    },
    {
      name: "TANGGAL REQUEST",
      selector: (row: any) => moment(row.request_time).format("L"),
    },
    {
      name: "KARYAWAN",
      selector: (row: any) => row.user.name,
    },
    {
      name: "LOKASI WFO",
      selector: (row: any) => row.office,
    },
    {
      name: "STATUS",
      selector: () => (
        <span className="badge rounded-pill border border-warning text-warning">
          Pending
        </span>
      ),
    },
    {
      name: "ACTION",
      selector: (row: any) => (
        <span
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setRowData(row);
            setShowModal(true);
          }}
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

  useEffect(() => {
    fetchDataOffice();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activePage, officeId]);

  const fetchData = async () => {
    await axios
      .get(`/pendingattendances?page=${activePage}&office=${officeId}`)
      .then((res) => {
        const { data } = res;
        data.attendance ? setAttendance(data.attendance) : setAttendance([]);
        const temp: number[] = [];
        for (let i = 1; i <= data.total_page; i++) {
          temp.push(i);
        }
        setTotalData(data.total_data);
        setPage(temp);
        setTotalPage(data.total_page);
      })
      .catch((err) => console.log(err));
  };

  const fetchDataOffice = async () => {
    await axios.get("/offices").then((res) => {
      const { data } = res;
      const temp = data.slice(1);
      setDefaultOffice(data[0]);
      setOffice(temp);
    });
  };

  const handleUpdateStatus = async () => {
    await axios
      .put(`/attendances/${rowData.id}`, {
        schedule_id: rowData.schedule_id,
        status,
        status_info: statusInfo,
      })
      .then(() => {
        fetchData();
        Swal.fire("Good job!", "Attendance has been updated", "success");
      })
      .catch((err: any) => {
        Swal.fire("I'm sorry", err.message, "error");
      })
      .finally(() => setShowModal(false));
  };

  const handlePage = (page: number) => {
    setActivePage(page);
  };

  const handlePrevPage = () => {
    const temp = activePage - 1;
    handlePage(temp);
  };

  const handleNextPage = () => {
    const temp = activePage + 1;
    handlePage(temp);
  };

  const handleChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  return (
    <div className="container mb-5">
      <p className="fs-4 mb-1">Daftar Permintaan Karyawan Work from Office</p>
      <p>{totalData} Permintaan</p>
      <div className="row justify-content-end g-3 align-items-center">
        <div className="col-auto ms-auto pe-0">
          <FaMapMarkerAlt />
        </div>
        {office[0] && (
          <div className="col-auto ps-0">
            <select
              className="form-select border-0"
              onChange={(e: any) => {
                setOfficeId(Number(e.target.value));
              }}
            >
              <option defaultValue="" value={defaultOffice.id}>
                {defaultOffice.name}
              </option>
              {office.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="row justify-content-center mt-3">
        <div className="col">
          <DataTable columns={columns} data={attendance} />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={handlePrevPage}
              disabled={activePage <= 1}
            />
            {page.map((item: any) => (
              <Pagination.Item
                key={item}
                active={activePage === item}
                onClick={() => handlePage(item)}
              >
                {item}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={handleNextPage}
              disabled={activePage >= totalPage}
            />
          </Pagination>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request Work from Office</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoading && rowData.id ? (
            <>
              <div className="row justify-content-between">
                <div className="col-4">
                  <p className="m-0">Tanggal</p>
                  <p className="fw-bold">{moment(rowData.date).format("LL")}</p>
                </div>
                <div className="col-4">
                  <p className="m-0">Lokasi</p>
                  <p className="fw-bold">{rowData.office}</p>
                </div>
                <div className="col-3">
                  <p className="mb-0">Kuota Tersisa</p>
                  <p className="fw-bold">{rowData.actual_capacity}</p>
                </div>
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                          <p className="m-0">Pemohon</p>
                          <p className="fw-bold">{rowData?.user?.name}</p>
                        </div>
                        <div className="col-6">
                          <p className="m-0">NIK</p>
                          <p className="fw-bold">{rowData?.user?.nik}</p>
                        </div>
                        <div className="col">
                          {rowData?.user?.vaccine_status === "Approved" ? (
                            <div className="alert alert-info m-0">
                              <BsCheckCircleFill className="me-2 mb-1" />
                              <span>Sudah divaksinasi</span>
                            </div>
                          ) : (
                            <div className="alert alert-danger m-0">
                              <IoAlertCircle className="fs-5 me-2 mb-1" />
                              <span>Vaksinasi belum lengkap</span>
                            </div>
                          )}
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
                          value="Approved"
                          checked={status === "Approved"}
                          onChange={handleChangeStatus}
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
                          value="Rejected"
                          checked={status === "Rejected"}
                          onChange={handleChangeStatus}
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
                    onChange={(e) => setStatusInfo(e.target.value)}
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
            onClick={handleUpdateStatus}
          >
            Konfirmasi
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Attendance;
