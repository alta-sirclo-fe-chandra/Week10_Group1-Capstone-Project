/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import Lottie from "react-lottie";
import animationData from "../assets/lotties/loading-spinner.json";
import axios from "axios";
import Swal from "sweetalert2";
import Avatar from "react-avatar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { currentSchedule, office, schedule, user } from "../types";
import { FaMapMarkerAlt, FaUsersSlash } from "react-icons/fa";
import { BsCalendar2PlusFill, BsFillClockFill } from "react-icons/bs";
import { RiErrorWarningFill } from "react-icons/ri";
import { ChangeEvent, useEffect, useState } from "react";
import { Modal, OverlayTrigger, Pagination, Tooltip } from "react-bootstrap";

const Schedule = () => {
  const [data, setData] = useState<schedule[]>([]);
  const [date, setDate] = useState(new Date());
  const [currentData, setCurrentData] = useState<currentSchedule>({});
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [user, setUser] = useState<user[]>([]);
  const [defaultOffice, setDefaultOffice] = useState<office>({});
  const [office, setOffice] = useState<office[]>([]);
  const [officeId, setOfficeId] = useState(1);
  const [page, setPage] = useState([1]);
  const [activePage, setActivePage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [defaultCapacity, setDefaultCapacity] = useState(50);
  const [month, setMonth] = useState(Number(moment().format("M")));
  const [year, setYear] = useState(Number(moment().format("YYYY")));

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
    fetchDataSchedule();
  }, [officeId, month, year]);

  useEffect(() => {
    checkTime(date) >= 0 ? fetchDataAttendance() : handleReset();
  }, [data, date, officeId]);

  const fetchDataSchedule = async () => {
    await axios
      .get(`/schedules?month=${month}&year=${year}&office=${officeId}`)
      .then((res) => {
        const { data } = res;
        data !== null ? setData(data) : setData([]);
      })
      .catch((err) => console.log(err));
  };

  const fetchDataAttendance = async () => {
    setIsLoading(true);
    const id = data[checkTime(date)].id;
    await axios
      .get(`/schedules/${id}?page=${activePage}`)
      .then((res) => {
        const { data } = res;
        setUser(data.user);
        setCurrentData(data);
        if (data.total_page > 1) {
          const temp: number[] = [];
          for (let i = 1; i <= data.total_page; i++) {
            temp.push(i);
          }
          setPage(temp);
          setTotalPage(data.total_page);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchDataOffice = async () => {
    await axios.get("/offices").then((res) => {
      const { data } = res;
      const temp = data.slice(1);
      setDefaultOffice(data[0]);
      setOffice(temp);
    });
  };

  const checkTime = (date: Date) => {
    return data.findIndex(
      (element) =>
        element.time === moment(date).format("YYYY-MM-DDT00:00:00") + "Z"
    );
  };

  const checkOffice = (id: number) => {
    return office.findIndex((element) => element.id === id);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const id = data[checkTime(date)].id;
    await axios
      .put(`/schedules/${id}`, {
        total_capacity: totalCapacity,
      })
      .then(() => {
        Swal.fire("Good job!", "Schedule has been updated", "success");
      })
      .catch((err: any) => {
        Swal.fire("I'm sorry", err.message, "error");
      })
      .finally(() => {
        setShowModal(false);
        setIsLoading(false);
        fetchDataSchedule();
      });
  };

  const handleCreateSchedule = async () => {
    await axios
      .post("/schedules", {
        office_id: officeId,
        total_capacity: defaultCapacity,
        month,
        year,
      })
      .then(() => {
        Swal.fire("Good job!", "Schedule has been create", "success");
      })
      .catch((err: any) => {
        Swal.fire("I'm sorry", err.message, "error");
      })
      .finally(() => {
        setModalCreate(false);
        fetchDataSchedule();
      });
  };

  const currentCapacity = () => {
    if (currentData.capacity) return currentData.capacity;
    return 0;
  };

  const handleReset = () => {
    setUser([]);
    setCurrentData({});
    setPage([1]);
    setTotalPage(1);
  };

  return (
    <div className="container">
      <h2>{moment().format("dddd, LL")}</h2>
      <div className="row justify-content-between align-items-center">
        <div className="col-auto">
          <p className="m-0">
            <BsFillClockFill className="me-2 mb-1" /> {moment().format("LT")}
          </p>
        </div>
        <div className="col-auto ms-auto pe-0">
          <FaMapMarkerAlt />
        </div>
        {office[0] && (
          <div className="col-auto ps-0">
            <select
              className="form-select border-0"
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setOfficeId(Number(e.target.value));
                setData([]);
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
      <div className="row my-5 justify-content-evenly">
        <div className="col-md-5">
          <div className="d-flex align-items-center">
            {data && (
              <Calendar
                className="border-0 p-4 shadow rounded-3"
                onChange={setDate}
                value={date}
                tileContent={({ view, date }) =>
                  view === "month" && checkTime(date) >= 0 ? (
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.75em" }}
                      onClick={() => setShowModal(true)}
                    >
                      {checkTime(date) >= 0
                        ? data[checkTime(date)].total_capacity
                        : ``}
                    </p>
                  ) : null
                }
                onActiveStartDateChange={({ action, activeStartDate }) => {
                  if (action === "next" || action === "prev") {
                    setMonth(Number(moment(activeStartDate).format("M")));
                    setYear(Number(moment(activeStartDate).format("YYYY")));
                  }
                }}
                tileDisabled={({ view, date }) =>
                  view === "month" && checkTime(date) < 0
                }
              />
            )}
            {!data[0] && (
              <OverlayTrigger
                trigger={["hover", "click"]}
                overlay={<Tooltip id="tooltip-disabled">Buat Schedule</Tooltip>}
              >
                <button
                  className="btn pt-0 ms-3 fs-1"
                  onClick={() => setModalCreate(true)}
                >
                  <BsCalendar2PlusFill />
                </button>
              </OverlayTrigger>
            )}
          </div>
          <div className="row mt-5">
            <div className="col-auto">
              <RiErrorWarningFill className="fs-1" />
            </div>
            <div className="col-10">
              <p>
                Pilih lokasi dan klik kuota dibawah tanggal untuk melakukan
                perubahan kuota
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <p className="fs-4">
            Karyawan Work from Office ({currentCapacity()})
          </p>
          {user && user[0] ? (
            !isLoading ? (
              user.map((item) => (
                <div key={item.id} className="row align-items-center my-3">
                  <div className="col-auto">
                    <Avatar
                      className="shadow-sm"
                      size="33"
                      round={true}
                      src={item.image_url}
                    />
                  </div>
                  <div className="col-auto">
                    <p className="m-0 fw-bold text-capitalize">{item.name}</p>
                    <p className="m-0">
                      <small className="text-end">
                        {moment(date).format("LL")} @{item.office}
                      </small>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <Lottie options={defaultOptions} height={100} width={100} />
              </>
            )
          ) : (
            <div className="d-flex justify-content-center">
              <div className="text-center">
                <FaUsersSlash className="fs-1" />
                <p>
                  <small>Tidak ada karyawan WFO</small>
                </p>
              </div>
            </div>
          )}
          <div className="d-flex justify-content-end">
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
      </div>
      {/* Modal Update Kuota */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kuota Work from Office</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoading && data[0] && checkTime(date) >= 0 ? (
            <>
              <div className="row">
                <div className="col-6">
                  <p className="m-0">Tanggal</p>
                  <p className="fw-bold">{moment(date).format("LL")}</p>
                </div>
                <div className="col-6">
                  <p className="m-0">Lokasi</p>
                  <p className="fw-bold">{currentData.office}</p>
                </div>
                <div className="col-auto">
                  <p className="mb-1">Kuota</p>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={data[checkTime(date)].total_capacity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setTotalCapacity(Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <Lottie options={defaultOptions} height={100} width={100} />
            </>
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
            onClick={handleSubmit}
          >
            Update Kuota
          </button>
        </Modal.Footer>
      </Modal>
      {/* Modal Create Schedule */}
      <Modal show={modalCreate} onHide={() => setModalCreate(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Buat Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div className="row">
              <div className="col-6">
                <p className="m-0">Bulan</p>
                <p className="fw-bold">{month}</p>
              </div>
              <div className="col-6">
                <p className="m-0">Tahun</p>
                <p className="fw-bold">{year}</p>
              </div>
              <div className="col-6">
                <p className="m-0">Lokasi</p>
                <p className="fw-bold">
                  {officeId === 1
                    ? defaultOffice.name
                    : office[checkOffice(officeId)].name}
                </p>
              </div>
              <div className="col-6">
                <p className="mb-1">Default Kuota</p>
                <input
                  type="number"
                  className="form-control"
                  defaultValue={defaultCapacity}
                  onChange={(e) => setDefaultCapacity(Number(e.target.value))}
                />
              </div>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary rounded-3"
            data-bs-dismiss="modal"
            onClick={() => setModalCreate(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success rounded-3 px-4"
            onClick={() => handleCreateSchedule()}
          >
            Buat Schedule
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Schedule;
