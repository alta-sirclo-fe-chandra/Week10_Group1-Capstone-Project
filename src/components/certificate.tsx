/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import Avatar from "react-avatar";
import Lottie from "react-lottie";
import Swal from "sweetalert2";
import animationData from "../assets/lotties/loading-spinner.json";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import DataTable from "react-data-table-component";
import "react-datepicker/dist/react-datepicker.css";
import { ChangeEvent, useEffect, useState } from "react";
import { Modal, OverlayTrigger, Pagination, Tooltip } from "react-bootstrap";
import { BsCheckCircleFill, BsThreeDots } from "react-icons/bs";
import { IoAlertCircle } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { certificate } from "../types";
import { useNavigate } from "react-router";

const Certificate = () => {
  const [page, setPage] = useState([1]);
  const [totalPage, setTotalPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState<certificate[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [certifIndex, setCertifIndex] = useState(0);
  const [status, setStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [rowData, setRowData] = useState<certificate>({
    Certificates: [],
  });

  const navigate = useNavigate();

  const customStyles = {
    rows: {
      style: {
        textTransform: "capitalize",
      },
    },
  };

  const columns = [
    {
      name: "#ID",
      selector: (row: any) => row.id,
      grow: 0,
    },
    {
      name: "KARYAWAN",
      selector: (row: any) => row.name,
    },
    {
      name: "SERTIFIKAT VAKSIN",
      selector: (row: any) => (
        <div className="d-flex">
          {row.Certificates ? (
            row.Certificates.map((item: any) =>
              item.status === "Approved" ? (
                <BsCheckCircleFill
                  key={item.vaccinedose}
                  size="33"
                  color="#adb5bd"
                  className="me-2"
                />
              ) : (
                <Avatar
                  key={item.vaccinedose}
                  className="me-2"
                  value={`${item.vaccinedose}`}
                  size="33"
                  round={true}
                  color="#adb5bd"
                />
              )
            )
          ) : (
            <></>
          )}
        </div>
      ),
      grow: 1.5,
    },
    {
      name: "STATUS",
      selector: (row: any) => (
        <span
          className={`badge rounded-pill border ${
            row.status === "Pending"
              ? "border-warning text-warning"
              : "border-success text-success"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "ACTION",
      selector: (row: any) => (
        <span
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setShowModal(true);
            setRowData(row);
          }}
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

  useEffect(() => {
    fetchData();
  }, [activePage, filterStatus]);

  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(`/certificates?page=${activePage}&status=${filterStatus}`)
      .then((res) => {
        const { data } = res;
        setData(data.Certificates);
        setTotalData(data.totalusers);
        if (data.totalpage > 1) {
          const temp: number[] = [];
          for (let i = 1; i <= data.totalpage; i++) {
            temp.push(i);
          }
          setPage(temp);
          setTotalPage(data.totalpage);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateStatus = async () => {
    const id = rowData.Certificates[certifIndex].id;
    await axios
      .put(`/certificates/${id}`, {
        status,
      })
      .then(() => {
        fetchData();
        Swal.fire("Good job!", "Certificate has been updated", "success");
      })
      .catch((err: any) => {
        Swal.fire("I'm sorry", err.message, "error");
      })
      .finally(() => handleCloseModal());
  };

  const handleChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCertifIndex(0);
  };

  return (
    <div id="certificate" className="container mb-5">
      <p className="fs-4 mb-1">Sertifikat Vaksin Karyawan</p>
      <p>{totalData} Karyawan</p>
      <div className="row justify-content-between">
        <div className="col-auto">
          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">Tambah Karyawan</Tooltip>}
          >
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={() => navigate("/create")}
            >
              <AiOutlinePlus className="fs-5" />
            </button>
          </OverlayTrigger>
        </div>
        <div className="col-auto">
          <select
            className="form-select"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option defaultValue="" value="">
              Semua status
            </option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>
      <div className="row justify-content-center mt-3">
        <div className="col">
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
          />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={() => setActivePage(activePage - 1)}
              disabled={activePage <= 1}
            />
            {page.map((item: any) => (
              <Pagination.Item
                key={item}
                active={activePage === item}
                onClick={() => setActivePage(item)}
              >
                {item}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setActivePage(activePage + 1)}
              disabled={activePage >= totalPage}
            />
          </Pagination>
        </div>
      </div>
      {/* Lightbox */}
      {imageOpen && (
        <Lightbox
          mainSrc={rowData.Certificates[certifIndex].imageurl}
          onCloseRequest={() => {
            setShowModal(true);
            setImageOpen(false);
          }}
        />
      )}
      {/* Modal Verifikasi Vaksin */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kurasi Sertifikat Vaksin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoading ? (
            <>
              <div className="row justify-content-between">
                <div className="col-12 d-flex align-items-center mb-3">
                  <p className="m-0 me-3">Sertifikat Vaksin</p>
                  {rowData.Certificates ? (
                    rowData.Certificates.map((item: any, index: number) =>
                      item.status === "Approved" ? (
                        <button
                          key={index}
                          className="btn"
                          onClick={() => setCertifIndex(index)}
                        >
                          <BsCheckCircleFill
                            size="33"
                            color={`${
                              index === certifIndex ? "#6C757D" : "#adb5bd"
                            }`}
                          />
                        </button>
                      ) : (
                        <button
                          key={index}
                          className="btn"
                          onClick={() => setCertifIndex(index)}
                        >
                          <Avatar
                            value={`${item.vaccinedose}`}
                            size="33"
                            round={true}
                            color={`${
                              index === certifIndex ? "#6C757D" : "#adb5bd"
                            }`}
                          />
                        </button>
                      )
                    )
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                          <p className="m-0">Pemohon</p>
                          <p className="fw-bold text-capitalize">
                            {rowData.name}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="m-0">NIK</p>
                          <p className="fw-bold">{rowData.nik}</p>
                        </div>
                        <div className="col">
                          {rowData.status === "Approved" ? (
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
                {rowData.Certificates && rowData.Certificates[0] && (
                  <div className="col-12">
                    <div className="card mb-3">
                      <div className="card-body text-center">
                        <img
                          src={rowData.Certificates[certifIndex].imageurl}
                          width="35%"
                          alt={rowData.name}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setShowModal(false);
                            setImageOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {rowData.status === "Pending" &&
                  rowData.Certificates &&
                  rowData.Certificates[0] &&
                  rowData.Certificates[certifIndex].status === "Pending" && (
                    <>
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
                              <label
                                className="form-check-label"
                                htmlFor="setuju"
                              >
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
                              <label
                                className="form-check-label"
                                htmlFor="tolak"
                              >
                                Tolak
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            Cancel
          </button>
          {rowData.Certificates &&
            rowData.Certificates[0] &&
            rowData.Certificates[certifIndex].status === "Pending" && (
              <button
                type="button"
                className="btn btn-success rounded-3 px-4"
                disabled={isLoading}
                onClick={handleUpdateStatus}
              >
                Konfirmasi
              </button>
            )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Certificate;
