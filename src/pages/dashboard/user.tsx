/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import {
  Button,
  FormControl,
  InputGroup,
  Modal,
  ModalBody,
  Pagination,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import EmployeeCard from "../../components/employeeCard";
import RequestStatusLabel from "../../components/requestStatusLabel";
import "../../assets/css/user.module.css";
import { FaSyringe, FaInfoCircle, FaHandPointer } from "react-icons/fa";

const User = () => {
  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeeEmail, setEmployeeEmail] = useState<string>("");
  const [employeeImage, setEmployeeImage] = useState<string>("");
  const [employeeNIK, setEmployeeNIK] = useState<string>("");
  const [employeeOffice, setEmployeeOffice] = useState<string>("");
  // const [employeeId, setEmployeeId] = useState<string>('');
  // const [employeeVaccineStat, setEmployeeVaccineStat] = useState<string>('');

  const [temperature, setTemperature] = useState<string>("");

  const [offices, setOffices] = useState<string[]>([]);
  const [targetOffice, setTargetOffice] = useState<number>(1);

  const [certificates, setCertificates] = useState<string[]>(["", "", ""]);
  const [dose, setDose] = useState<number>(0);

  const [attendants, setAttendants] = useState<[]>([]);

  const [isSortByRecent, setIsSortByRecent] = useState<boolean>(false);
  const [requests, setRequests] = useState<any>();
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isCheckedOut, setIsCheckedOut] = useState<boolean>(false);

  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] =
    useState<boolean>(false);

  const [certificateFile, setCertificateFile] = useState<any>();
  const [pcrFile, setPcrFile] = useState<any>();

  const [schedules, setSchedules] = useState<any>();
  const [scheduleId, setScheduleId] = useState<number>(0);
  const [calendarDate, setCalendarDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      23,
      59,
      59
    )
  );
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    axios
    .get('/profile')
    .then((res) => {
      const { data } = res;
      setEmployeeName(data.name);
      setEmployeeEmail(data.email);
      setEmployeeImage(data.image_url);
      setEmployeeNIK(data.nik);
      setEmployeeOffice(data.office);
      // setEmployeeVaccineStat(data.vaccine_status);
      // setEmployeeId(data.id);
    })
    .catch((err) => {
      console.log(err);
    });
    
  axios
  .get('/offices')
    .then((res) => {
      const { data } = res;
      setOffices(data);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [employeeName]);

  useEffect(() => {
    axios
      .get("/mycertificates")
      .then((res) => {
        const { data } = res;
        const certificateOrder: string[] = ["", "", ""];
        data?.Certificates.map((datum: any) => {
          const dose = datum.vaccinedose;
          certificateOrder[dose - 1] = datum.status;
          return certificateOrder;
        });
        setCertificates(certificateOrder);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }, [certificates]);

  useEffect(() => {
    handleRequestHistory(currentPage);
  }, [isSortByRecent]);

  useEffect(() => {
    handleGetSchedule(month, year, targetOffice);
  }, [month, year, targetOffice]);

  useEffect(() => {
    handleShowAttendanceByDate(calendarDate.getDate());
  }, [calendarDate]);

  const handleGetSchedule = async (
    monthInput: number,
    yearInput: number,
    officeInput: number
  ) => {
    await axios
      .get(
        `/schedules?page=1&month=${monthInput}&year=${yearInput}&office=${officeInput}`
      )
      .then((res) => {
        const { data } = res;
        data !== null ? setSchedules(data) : setSchedules([]);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  const formatReactDate = (dateInput: Date, hyphen: boolean) => {
    const year = dateInput.getFullYear();
    const month = dateInput.getMonth() + 1;
    const date = dateInput.getDate();
    if (hyphen) {
      return `${year}-${
        month.toString().length === 1 ? `0${month}` : `${month}`
      }-${date.toString().length === 1 ? `0${date}` : `${date}`}`;
    }
    return `${year}${month.toString().length === 1 ? `0${month}` : `${month}`}${
      date.toString().length === 1 ? `0${date}` : `${date}`
    }`;
  };

  const handleRequestHistory = async (page: number, status?: string) => {
    var url: string;
    isSortByRecent
      ? (url = `/mylongestattendances?page=${page}`)
      : (url = `/mylatestattendances?page=${page}`);
    setCurrentPage(page);

    await axios
      .get(url)
      .then((res) => {
        const { data } = res;
        setRequests(data.attendance);
        setTotalPage(data.total_page);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  const handleShowAttendanceByDate = async (dateInput: number) => {
    const dateToId = schedules?.find(
      (schedule: any) => parseInt(schedule.time.substring(8, 10)) === dateInput
    ).id;
    if (dateToId) {
      await axios
        .get(`/schedules/${dateToId}`)
        .then((res) => {
          const { data } = res;
          data !== null ? setAttendants(data.user) : setAttendants([]);
          setScheduleId(data.id);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .get(`/schedules/${new Date().getDate()}`)
        .then((res) => {
          const { data } = res;
          data !== null ? setAttendants(data.user) : setAttendants([]);
          setScheduleId(data.id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const isRequestDateValid = () => {
    const today = new Date();
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0o0,
      0o0,
      0o0
    );
    const requestDateValidity = calendarDate < currentDate ? false : true;
    return requestDateValidity;
  };

  const checkInStatus = () => {
    const today = formatReactDate(new Date(), true);
    const wfoRequest = requests?.find(
      (request: any) => request.date.substring(0, 10) === today
    );
    const wfoCheckIn = wfoRequest?.check_in;
    if (wfoRequest) {
      if (!wfoCheckIn) {
        return 1; // memungkinkan untuk check in
      } else {
        return 0; // sudah check in
      }
    } else {
      return -1; // di luar tanggal wfo
    }
  };

  const handleCheckInModal = () => {
    setShowCheckInModal(true);
  };
  const handleCloseCheckInModal = () => {
    setShowCheckInModal(false);
  };
  const handleCheckIn = (temperature: string) => {
    setShowCheckInModal(false);
    const formData = new FormData();
    const today = formatReactDate(new Date(), true);
    const id = requests.find(
      (request: any) => request.date.substring(0, 10) === today
    ).id;

    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Anda sudah check in hari ini",
      });
    }
    formData.append("id", id);
    formData.append("temperature", temperature);

    axios
      .put("/checkin", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Proses check in berhasil",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(() => {
        const checkInDate: string | null = requests.find(
          (request: any) => request.date.substring(0, 10) === today
        ).check_in;
        if (checkInDate) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Anda sudah check in hari ini",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Anda belum bisa check in saat ini",
          });
        }
      });
  };
  const handleCheckOut = () => {
    const formData = new FormData();
    const today = formatReactDate(new Date(), true);
    const id = requests.find(
      (request: any) => request.date.substring(0, 10) === today
    ).id;
    formData.append("id", id);

    axios
      .put("/checkout", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Proses check out berhasil",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsCheckedOut(true);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Anda sudah check out hari ini",
        });
      });
  };

  const handleRequestModal = () => {
    setShowRequestModal(true);
  };
  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
    setPcrFile(null);
  };
  const handleRequest = () => {
    setShowRequestModal(false);

    const formData = new FormData();
    formData.append("schedule_id", scheduleId.toString());
    formData.append("description", "Permohonan request kerja");
    formData.append("image", pcrFile);

    axios
      .post("/attendances", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Permohonan request berhasil",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(`%c${error.response.data.message}`, "color:green");

          console.log(`%c${error.response.status}`, "color:red");
          console.log(`%c${error.response.headers}`, "color:blue");
          if (error.response.data.message === "request telah ada") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Anda telah melakukan permohonan WFO pada hari ini",
            });
          } else if (error.response.data.message === "user belum vaccine") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Lengkapi sertifikat vaksin untuk melakukan permohonan WFO",
            });
          } else if (
            error.response.data.message ===
            "tanggal request harus lebih besar daripada tanggal hari ini"
          ) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Anda telah melewati batas waktu untuk permohonan di hari ini. Silakan coba hari lainnya",
            });
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(`%c${error.request}`, "color:pink");
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", `%c${error.message}`, "color:purple");
        }
        console.log(`error.config`);
      });
  };

  const handleCertificateModal = (certificateIndex: number) => {
    setShowCertificateModal(true);
    setDose(certificateIndex + 1);
  };
  const handleCloseCertificateModal = () => {
    setShowCertificateModal(false);
    setCertificateFile(null);
  };
  const handleCertificateUpload = (vaccineDose: number) => {
    setShowCertificateModal(false);
    const formData = new FormData();
    formData.append("image", certificateFile);
    formData.append("vaccinedose", `${vaccineDose}`);
    formData.append("description", `vaksin ke-${vaccineDose}`);

    axios
      .post("/certificates", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Upload sertifikat berhasil",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  const scheduleDateToIndex = (dateInput: Date) => {
    const index = schedules?.findIndex(
      (schedule: any) =>
        schedule.time ===
        moment(formatReactDate(dateInput, false)).format(
          "YYYY-MM-DDT00:00:00"
        ) +
          "Z"
    );
    return schedules[index]?.total_capacity || `-`;
  };

  let pages = [];
  for (let number = 1; number <= totalPage; number++) {
    pages.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handleRequestHistory(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="container">
      {/* Whole Page */}
      <div className="d-flex mt-2 mx-5 px-5">
        {/* Employee Greeting */}
        <h4 style={{ textTransform: "capitalize" }}>Hi, {employeeName}! 👋</h4>
      </div>
      <div className="d-flex justify-content-center mt-2">
        {/* Kolom 1 */}
        <div className="col col-md-8 pb-4">
          {/* CheckIn Card */}
          <div
            className="container d-flex col p-2 mr-4 justify-content-between"
            style={{
              borderRadius: "5px",
              width: "90%",
              backgroundColor: "lightgrey",
            }}
          >
            <div className="col">
              <h6>{moment().format("dddd, Do MMMM YYYY")}</h6>
              <h6 style={{ fontSize: "0.8rem" }} className="text-muted">
                {moment().format("HH.MM") + " WIB"}
              </h6>
            </div>
            <div className="d-flex align-items-center">
              {checkInStatus() === 1 ? (
                <button
                  className="btn btn-secondary"
                  onClick={handleCheckInModal}
                >
                  Check In
                </button>
              ) : checkInStatus() === -1 ? (
                <button
                  className="btn btn-secondary disabled"
                  onClick={handleCheckInModal}
                >
                  Check In
                </button>
              ) : isCheckedOut ? (
                <button className="btn btn-secondary disabled">
                  Check Out
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={handleCheckOut}>
                  Check Out
                </button>
              )}
            </div>
            {/* CheckIn Modal */}
            <div>
              <Modal
                show={showCheckInModal}
                onHide={handleCloseCheckInModal}
                size="sm"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Check In</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "lightgrey" }}>
                  <div className="col-12">
                    <div className="col">
                      <div className="text-muted" style={{ fontSize: "1rem" }}>
                        Temperatur (Celcius)
                      </div>
                      <div>
                        <InputGroup className="mb-3">
                          <FormControl
                            onChange={(e) => setTemperature(e.target.value)}
                          />
                          <InputGroup.Text>°C</InputGroup.Text>
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <ModalBody>
                  <div className="row col-12">
                    <div className="col w-50">
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Pemohon
                      </div>
                      <div style={{ textTransform: "capitalize" }}>
                        {employeeName}
                      </div>
                    </div>
                    <div className="col w-50">
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.7rem" }}
                      >
                        NIK
                      </div>
                      <div>{employeeNIK}</div>
                    </div>
                  </div>
                </ModalBody>
                <Modal.Footer>
                  <Button
                    variant="outline-tertiary"
                    onClick={handleCloseCheckInModal}
                  >
                    Kembali
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleCheckIn(temperature)}
                  >
                    Check In
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
          {/* Work Request Card (Calendar + Attendance Section) */}
          <div
            className="container d-flex col p-2 mr-4 my-4"
            style={{ borderRadius: "5px", width: "90%" }}
          >
            {/* Calendar Section */}
            <div className="d-flex w-50 row">
              <h6>Lokasi</h6>
              <div>
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm"
                  style={{ width: "90%", marginBottom: "10px" }}
                  onChange={(e) => {
                    setTargetOffice(parseInt(e.target.value));
                  }}
                  value={targetOffice}
                >
                  {offices?.map((office: any, index: number) => (
                    <option key={index} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ width: "91%" }}>
                {schedules && (
                  <Calendar
                    className="rounded"
                    showFixedNumberOfWeeks={true}
                    prev2Label={null}
                    next2Label={null}
                    value={new Date()}
                    tileDisabled={({ activeStartDate, view, date }) =>
                      view === "month" &&
                      date.getMonth() + 1 !== activeStartDate.getMonth() + 1
                    }
                    tileContent={({ activeStartDate, date, view }) =>
                      view === "month" && date.getMonth() + 1 === month ? (
                        <small
                          className="d-block text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {scheduleDateToIndex(date)}
                        </small>
                      ) : (
                        <small
                          className="d-block text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {"-"}
                        </small>
                      )
                    }
                    onActiveStartDateChange={({ action, activeStartDate }) => {
                      if (action === "next" || action === "prev") {
                        setMonth(Number(moment(activeStartDate).format("M")));
                        setYear(Number(moment(activeStartDate).format("YYYY")));
                      }
                    }}
                    onClickDay={(value) => {
                      setCalendarDate(value);
                    }}
                  />
                )}
              </div>
            </div>
            {/* Attendance Section */}
            <div
              className="d-flex row"
              style={{ margin: "0 auto", width: "calc(100% - 20px)" }}
            >
              <div>
                <strong>Karyawan Work from Office</strong>
              </div>
              {attendants ? (
                <div
                  data-bs-spy="scroll"
                  data-bs-offset="0"
                  className="scrollspy-example"
                  tabIndex={0}
                  style={{ height: "380px", overflowY: "scroll" }}
                >
                  {attendants?.map((attendant: any, index: number) => (
                    <div key={index}>
                      <EmployeeCard
                        image={attendant.image_url}
                        employee={attendant.name}
                        wfoDate={formatReactDate(calendarDate, false)}
                        wfoLocation={attendant.office}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "380px" }}
                >
                  Belum ada permohonan
                </div>
              )}
              <div style={{ marginTop: "10px" }}>
                {isRequestDateValid() ? (
                  <button
                    className="btn btn-secondary"
                    style={{ width: "inherit" }}
                    onClick={handleRequestModal}
                  >
                    Request WFO
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary disabled"
                    style={{ width: "inherit" }}
                    onClick={handleRequestModal}
                  >
                    Request WFO
                  </button>
                )}
                {/* Request Modal */}
                <div>
                  <Modal
                    show={showRequestModal}
                    onHide={handleCloseRequestModal}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Permohonan WFO</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: "lightgrey" }}>
                      <div className="row col-12">
                        <div className="col w-50">
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Tanggal
                          </div>
                          <div>
                            <strong>
                              {calendarDate
                                ? moment(
                                    formatReactDate(calendarDate, false)
                                  ).format("Do MMMM YYYY")
                                : moment()
                                    .add("1", "days")
                                    .format("Do MMMM YYYY")}
                            </strong>
                          </div>
                        </div>
                        <div className="col w-50">
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Lokasi
                          </div>
                          <div>
                            <strong>{employeeOffice}</strong>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                    <ModalBody>
                      <div className="row col-12">
                        <div className="col w-50">
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Pemohon
                          </div>
                          <div style={{ textTransform: "capitalize" }}>
                            {employeeName}
                          </div>
                        </div>
                        <div className="col w-50">
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            NIK
                          </div>
                          <div>{employeeNIK}</div>
                        </div>
                      </div>
                    </ModalBody>
                    <Modal.Body style={{ backgroundColor: "lightgrey" }}>
                      <div className="col col-12">
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Foto Bukti PCR<span style={{ color: "red" }}>*</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const fileList = e.target.files;
                            if (!fileList) return;
                            setPcrFile(fileList[0]);
                          }}
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="outline-tertiary"
                        onClick={handleCloseRequestModal}
                      >
                        Kembali
                      </Button>
                      {pcrFile ? (
                        <Button variant="secondary" onClick={handleRequest}>
                          Kirim Permohonan WFO
                        </Button>
                      ) : (
                        <Button variant="secondary" disabled>
                          Kirim Permohonan WFO
                        </Button>
                      )}
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {/* History Section */}
          <div
            className="container d-flex p-2 mr-4 mt-2"
            style={{ borderRadius: "5px", width: "90%" }}
          >
            <div className="row">
              <div>
                <h6>Riwayat Permohonan Work from Office (WFO)</h6>
              </div>
              {!requests ? (
                <div className="text-center pt-2">
                  <div>Anda belum pernah melakukan request</div>
                  <div>
                    <button
                      className="btn btn-tertiary"
                      onClick={() => setIsSortByRecent(!isSortByRecent)}
                    >
                      Cek Ulang
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ margin: "0 auto", width: "calc(100% - 2px)" }}>
                  <div
                    className="p-2"
                    style={{
                      borderRadius: "5px",
                      backgroundColor: "lightgrey",
                    }}
                  >
                    <FaHandPointer /> &nbsp; Klik kolom Tanggal WFO atau Tanggal
                    Permohonan WFO untuk mengurutkan
                  </div>
                  <table
                    className="table table-borderless table-hover mt-2"
                    style={{ margin: "0 auto", width: "calc(100% - 2px)" }}
                  >
                    <thead style={{ backgroundColor: "lightgrey" }}>
                      <tr>
                        <th scope="col" className="align-middle">
                          No
                        </th>
                        <th scope="col" className="align-middle">
                          <button
                            style={{ background: "none", border: "none" }}
                            onClick={() => setIsSortByRecent(true)}
                          >
                            <strong>Tanggal WFO</strong>
                          </button>
                        </th>
                        <th scope="col" className="align-middle">
                          <button
                            style={{ background: "none", border: "none" }}
                            onClick={() => setIsSortByRecent(false)}
                          >
                            <strong>Tanggal Permohonan WFO</strong>
                          </button>
                        </th>
                        <th scope="col" className="align-middle">
                          Lokasi
                        </th>
                        <th scope="col" className="align-middle">
                          Status
                        </th>
                        <th scope="col" className="align-middle">
                          Keterangan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests?.map((request: any, index: number) => (
                        <tr key={request.id}>
                          <td>{index + 1}</td>
                          <td>{request.date.slice(0, 10)}</td>
                          <td>{request.request_time.slice(0, 10)}</td>
                          <td>{request.office}</td>
                          <td>
                            <RequestStatusLabel content={request.status} />
                          </td>
                          <td>
                            <small style={{ fontSize: "0.7rem" }}>
                              {request.status_info}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="d-flex justify-content-center">
                {totalPage <= 1 ? (
                  <button style={{ display: "none" }}></button>
                ) : currentPage === 1 ? (
                  <Pagination>
                    <Pagination.Prev disabled></Pagination.Prev>
                    {pages}
                    <Pagination.Next
                      onClick={() => handleRequestHistory(currentPage + 1)}
                    ></Pagination.Next>
                  </Pagination>
                ) : currentPage === totalPage ? (
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handleRequestHistory(currentPage - 1)}
                    ></Pagination.Prev>
                    {pages}
                    <Pagination.Next disabled></Pagination.Next>
                  </Pagination>
                ) : (
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handleRequestHistory(currentPage - 1)}
                    ></Pagination.Prev>
                    {pages}
                    <Pagination.Next
                      onClick={() => handleRequestHistory(currentPage + 1)}
                    ></Pagination.Next>
                  </Pagination>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom 2 */}
        <div className="col col-md-3">
          {/* Profile Card */}
          <div style={{ borderRadius: "5px" }}>
            <div
              className="d-flex container p-2"
              style={{ borderRadius: "5px", backgroundColor: "lightgrey" }}
            >
              <div className="px-2 py-1">
                <img
                  src={employeeImage}
                  alt=""
                  height="40px"
                  width="40px"
                  style={{ borderRadius: "50%" }}
                />
              </div>
              <div className="d-flex row align-items-center">
                <div style={{ fontSize: "1rem", textTransform: "capitalize" }}>
                  {employeeName}
                </div>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  {employeeEmail}
                </div>
              </div>
            </div>
            <div className="d-flex container p-2">
              <div
                className="d-flex row align-items-center"
                style={{ width: "55%" }}
              >
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  NIK
                </div>
                <div style={{ fontSize: "0.8rem" }}>{employeeNIK}</div>
              </div>
              <div className="d-flex row align-items-center">
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Base Office
                </div>
                <div style={{ fontSize: "0.8rem" }}>{employeeOffice}</div>
              </div>
            </div>
          </div>

          {/* Vaccine Card */}
          <div className="my-4" style={{ borderRadius: "5px", margin: "0" }}>
            <div className="d-flex row container pt-2">
              <div className="d-flex justify-content-between align-items-center col pb-1">
                <div>Sertifikat Vaksin</div>
                <div style={{ width: "13%" }}></div>
              </div>
            </div>
            <div className="pb-2">
              <hr style={{ width: "calc(100% - 10px)", margin: "0 auto" }} />
            </div>
            <div>
              <ol>
                {certificates?.map((certificate: string, index: number) => (
                  <li
                    key={index}
                    className="d-flex container justify-content-between pb-1"
                  >
                    <div className="col">
                      <div>{`Vaksin ${index + 1}`}</div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {certificate === "Approved"
                          ? "Terverifikasi"
                          : certificate === "Pending"
                          ? "Menunggu Verifikasi"
                          : "Belum Diunggah"}
                      </div>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      {certificate !== "" ? (
                        <button
                          className="btn btn-sm disabled"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Unggah Sertifikat
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm"
                          style={{ fontSize: "0.7rem" }}
                          onClick={() => handleCertificateModal(index)}
                        >
                          Unggah Sertifikat
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              {/* Certificate Modal */}
              <div>
                <Modal
                  show={showCertificateModal}
                  onHide={handleCloseCertificateModal}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>{`Unggah Sertifikat Vaksin ${dose}`}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="row">
                    <div style={{ fontSize: "0.7rem" }} className="text-muted">
                      Foto Sertifikat Vaksin
                      <span style={{ color: "red" }}>*</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const fileList = e.target.files;
                        if (!fileList) return;
                        setCertificateFile(fileList[0]);
                      }}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="outline-tertiary"
                      onClick={handleCloseCertificateModal}
                    >
                      Kembali
                    </Button>
                    {certificateFile ? (
                      <Button
                        variant="secondary"
                        onClick={() => handleCertificateUpload(dose)}
                      >
                        Unggah File
                      </Button>
                    ) : (
                      <Button variant="secondary" className="disabled">
                        Unggah File
                      </Button>
                    )}
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            {certificates.filter((e) => e === "").length === 0 ? (
              <div
                className="container mb-2 p-2"
                style={{
                  backgroundColor: "lightgrey",
                  margin: "0 auto",
                  width: "calc(100% - 10px)",
                  borderRadius: "5px",
                }}
              >
                <span>
                  <FaSyringe />
                </span>{" "}
                &nbsp; Unggah sertifikat vaksinasi selesai
              </div>
            ) : (
              <div
                className="d-flex container mb-2 p-2"
                style={{
                  backgroundColor: "lightgrey",
                  margin: "0 auto",
                  width: "calc(100% - 10px)",
                  borderRadius: "5px",
                }}
              >
                <div className="px-2 py-1 d-flex align-items-center">
                  <FaInfoCircle height="40px" width="40px" />
                </div>
                <div className="d-flex align-items-center">
                  Lengkapi sertifikat vaksinmu untuk membuat permohonan WFO
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
