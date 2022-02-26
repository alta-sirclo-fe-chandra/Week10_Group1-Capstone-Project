import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import 'moment/locale/id';
import { Button, FormControl, InputGroup, Modal, ModalBody, Pagination } from "react-bootstrap";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import EmployeeCard from "../../../components/employeeCard";
import RequestStatusLabel from "../../../components/requestStatusLabel";
import "../user/user.module.css";
import { FaSort, FaSyringe, FaInfoCircle } from "react-icons/fa";
import { callbackify } from "util";

const User = () => {
  const token: string | null = localStorage.getItem('token');

  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeEmail, setEmployeeEmail] = useState<string>('');
  const [employeeImage, setEmployeeImage] = useState<string>('');
  const [employeeNIK, setEmployeeNIK] = useState<string>('');
  const [employeeOffice, setEmployeeOffice] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [employeeVaccineStat, setEmployeeVaccineStat] = useState<string>('');

  const [temperature, setTemperature] = useState<string>('');

  const [offices, setOffices] = useState<string[]>([]);

  const [certificates, setCertificates] = useState<string[]>(['', '', '']);

  const [date, setDate] = useState<string>(moment().format("DD"));
  console.log(moment().format('DD'))

  const [attendants, setAttendants] = useState<[]>([]);

  const [isSortByRecent, setIsSortByRecent] = useState<boolean>(false);
  const [requests, setRequests] = useState<any>();
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const [certificateFile, setCertificateFile] = useState<any>();
  const [pcrFile, setPcrFile] = useState<any>();

  useEffect(() => {
    axios
      .get('https://richap.space/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((res) => {
        const { data } = res;
        setEmployeeName(data.name);
        setEmployeeEmail(data.email);
        setEmployeeImage(data.image_url);
        setEmployeeNIK(data.nik);
        setEmployeeOffice(data.office);
        setEmployeeVaccineStat(data.vaccine_status);
        setEmployeeId(data.id);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get('https://richap.space/offices', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((res) => {
        const { data } = res;
        setOffices(data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get('https://richap.space/mycertificates', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((res) => {
        const { data } = res;
        const certificateOrder: string[] = ['', '', ''];
        data?.Certificates.map((datum: any) => {
          const dose = datum.vaccinedose;
          certificateOrder[dose-1] = datum.status;
          return certificateOrder;
        })
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
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
  }, [employeeName]);

  useEffect(() => {
    handleRequestHistory(1);
  }, [isSortByRecent])

  const handleRequestHistory = async(page: number, status?: string) => {
    var url: string;
    isSortByRecent ?
      url = `https://richap.space/mylatestattendances?page=${page}`
      : url = `https://richap.space/mylongestattendances?page=${page}`
    
    await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
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
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  }

  
  const handleShowAttendanceByDate = async(id: number) => {
    await axios
    .get(`https://richap.space/schedules/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    .then((res) => {
      const { data } = res;
      setAttendants(data.user);
    })
    .catch((err) => {
      console.log(err);
    });
  }
  
  const formatDate = (date: string) => {
    const month = date.slice(4,7);
    return `${date.slice(11,15)}`+
    `${month === 'Jan' ? '01'
    : month === 'Feb' ? '02'
    : month === 'Mar' ? '03'
    : month === 'Apr' ? '04'
    : month === 'May' ? '05'
    : month === 'Jun' ? '06'
    : month === 'Jul' ? '07'
    : month === 'Aug' ? '08'
    : month === 'Sep' ? '09'
    : month === 'Oct' ? '10'
    : month === 'Nov' ? '11'
    : '12'}`+
    `${date.slice(8,10)}`;
  }

  const isRequestDateValid = () => {
    const requestDateValidity = moment(formatDate(date)) < moment()
    ? false
    : true;
    return requestDateValidity;
  }
  
  const handleCheckInModal = () => {
    setShowCheckInModal(true);
  }
  const handleCloseCheckInModal = () => {
    setShowCheckInModal(false);
  }
  const handleCheckIn = (temperature: string) => {
    const formData = new FormData();
    formData.append('id', employeeId);
    formData.append('temperature', temperature);

    axios
      .put('https://richap.space/checkin', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      })
      .then((res) => console.log(res))
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
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
  }

  const handleRequestModal = () => {
    setShowRequestModal(true);
  }
  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
  }
  const handleRequest = () => {
    setShowRequestModal(false);
    const formData = new FormData();
    formData.append("schedule_id", parseInt(date.slice(8,10)).toString());
    formData.append("description", 'Permohonan request kerja');
    formData.append("image", pcrFile);

    axios
      .post('https://richap.space/attendances', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      })
      .then((res) => {
        console.log(res);
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
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
  }

  const handleCertificateModal = () => {
    setShowCertificateModal(true);
  }
  const handleCloseCertificateModal = () => {
    setShowCertificateModal(false);
  }
  const handleCertificateUpload = () => {
    setShowCertificateModal(false);
    const formData = new FormData();
    formData.append("image", certificateFile);
    formData.append("vaccinedose", "2");
    formData.append("description", `vaksin ke-${2}`);

    // axios
    //   .post('https://richap.space/certificates', formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       Authorization: `Bearer ${token}`
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    axios({
      url: 'https://richap.space/certificates',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
    .then((res) => console.log(res))
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
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  }

  let pages = [];
  for (let number = 1; number <= totalPage; number++) {
    pages.push(
      <Pagination.Item key={number} active={number === currentPage}>
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <div className="container">
      {/* Whole Page */}
      <div className="d-flex mt-2 mx-5 px-5">
        {/* Employee Greeting */}
        <h4>Hi, {employeeName}! 👋</h4>
      </div>
      <div className="d-flex justify-content-center mt-2">
        {/* Kolom 1 */}
        <div className="col col-md-8 pb-4">
          {/* CheckIn Card */}
          <div className="container d-flex col p-2 mr-4 justify-content-between" style={{border: "1px solid grey", borderRadius: "5px", width: "90%"}}>
            <div className="col">
              <h6>{moment().format("dddd, Do MMMM YYYY")}</h6>
              <h6 style={{fontSize: "0.8rem"}} className="text-muted">{moment().format("HH.MM") + " WIB"}</h6>
            </div>
            <div className="d-flex align-items-center">
              <button className="btn btn-secondary"
                onClick={handleCheckInModal}>Check In</button>
            </div>
            {/* CheckIn Modal */}
            <div>
              <Modal show={showCheckInModal} onHide={handleCloseCheckInModal} size="sm" centered>
                <Modal.Header closeButton>
                  <Modal.Title>Check In</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: "lightgrey"}}>
                  <div className="col-12">
                    <div className="col">
                      <div className="text-muted" style={{fontSize: "1rem"}}>Temperatur (Celcius)</div>
                      <div>
                        <InputGroup className="mb-3">
                          <FormControl onChange={(e) => setTemperature(e.target.value)}/>
                          <InputGroup.Text>°C</InputGroup.Text>
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <ModalBody>
                  <div className="row col-12">
                    <div className="col w-50">
                      <div className="text-muted" style={{fontSize: "0.7rem"}}>Pemohon</div>
                      <div>{employeeName}</div>
                    </div>
                    <div className="col w-50">
                      <div className="text-muted" style={{fontSize: "0.7rem"}}>NIK</div>
                      <div>{employeeNIK}</div>
                    </div>
                  </div>
                </ModalBody>
                <Modal.Footer>
                  <Button variant="outline-tertiary" onClick={handleCloseCheckInModal}>
                    Kembali
                  </Button>
                  <Button variant="secondary" onClick={() => handleCheckIn(temperature)}>
                    Check In
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
          {/* Work Request Card (Calendar + Attendance Section) */}
          <div className="container d-flex col p-2 mr-4 mt-2" style={{border: "1px solid grey", borderRadius: "5px", width: "90%"}}>
            {/* Calendar Section */}
            <div className="d-flex w-50 row">
              <h6>Lokasi</h6>
              <div>
                <select style={{width: "90%"}}>
                  {offices?.map((office: any, index: number) => (
                    <option key={index}>{office.name}</option>
                  ))}    
                </select>
              </div>
              <div style={{width: "91%"}}>
                <Calendar
                  calendarType="US"
                  showFixedNumberOfWeeks={true}
                  prev2Label={null}
                  next2Label={null}
                  onClickDay={(value) => {
                    setDate(value.toString());
                    handleShowAttendanceByDate(parseInt(value.toString().slice(8,10)));
                  }}
                />
              </div>
            </div>
            {/* Attendance Section */}
            <div className="d-flex row" style={{margin: "0 auto", width: "calc(100% - 20px)"}}>
              <div>
                Karyawan Work from Office
              </div>
              {attendants
              ? <div data-bs-spy="scroll" data-bs-offset="0" className="scrollspy-example" tabIndex={0} style={{height: '290px', overflowY: 'scroll'}}>
                {attendants?.map((attendant: any, index: number) => (
                  <div key={index}>
                    <EmployeeCard
                      image={attendant.image_url}
                      employee={attendant.name}
                      wfoDate={formatDate(date)}
                      wfoLocation={attendant.office} />
                  </div>
                ))}
              </div>
              : <div className="d-flex align-items-center justify-content-center" style={{height: "290px"}}>Belum ada permohonan</div>
              }
              <div style={{marginTop: "10px"}}>
                {isRequestDateValid()
                  ? <button
                    className="btn btn-secondary"
                    style ={{width: "inherit"}}
                    onClick={handleRequestModal}>
                      Request WFO
                  </button>
                  : <button
                  className="btn btn-secondary disabled"
                  style ={{width: "inherit"}}
                  onClick={handleRequestModal}>
                    Request WFO
                </button>
                }
                {/* Request Modal */}
                <div>
                  <Modal show={showRequestModal} onHide={handleCloseRequestModal} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>Permohonan WFO</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{backgroundColor: "lightgrey"}}>
                      <div className="row col-12">
                        <div className="col w-50">
                          <div className="text-muted" style={{fontSize: "0.7rem"}}>Tanggal</div>
                          <div>
                            <strong>
                              {date
                                ? moment(formatDate(date)).format("Do MMMM YYYY")
                                : moment().add('1', 'days').format("Do MMMM YYYY")}
                            </strong>
                          </div>
                        </div>
                        <div className="col w-50">
                          <div className="text-muted" style={{fontSize: "0.7rem"}}>Lokasi</div>
                          <div><strong>{employeeOffice}</strong></div>
                        </div>
                      </div>
                    </Modal.Body>
                    <ModalBody>
                      <div className="row col-12">
                        <div className="col w-50">
                          <div className="text-muted" style={{fontSize: "0.7rem"}}>Pemohon</div>
                          <div>{employeeName}</div>
                        </div>
                        <div className="col w-50">
                          <div className="text-muted" style={{fontSize: "0.7rem"}}>NIK</div>
                          <div>{employeeNIK}</div>
                        </div>
                      </div>
                    </ModalBody>
                    <Modal.Body>
                      <div className="row col-12">
                        <input type="file"
                          accept="image/*"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const fileList = e.target.files;
                            if(!fileList) return;
                            setPcrFile(fileList[0]);
                          }}
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="outline-tertiary" onClick={handleCloseRequestModal}>
                        Kembali
                      </Button>
                      <Button variant="secondary" onClick={handleRequest}>
                        Kirim Permohonan WFO
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {/* History Section */}
          <div className="container d-flex p-2 mr-4 mt-2" style={{border: "1px solid grey", borderRadius: "5px", width: "90%"}}>
            <div className="row">
              <div>
                <h6>Riwayat Permohonan Work from Office (WFO)</h6>
              </div>
              <div style={{margin: "0 auto", width: "calc(100% - 2px)"}}>
                <table className="table table-borderless table-hover" style={{margin: "0 auto", width: "calc(100% - 2px)"}}>
                  <thead style={{backgroundColor: "lightgrey"}}>
                    <tr>
                      <th scope="col" className="align-middle">No</th>
                      <th scope="col" className="align-middle" style={{position: "relative"}}>
                        Tanggal &nbsp; <span onClick={() => setIsSortByRecent(!isSortByRecent)} style={{position: "absolute", top: "16%"}}><FaSort /></span>
                      </th>
                      <th scope="col" className="align-middle">Lokasi</th>
                      <th scope="col" className="align-middle">Status</th>
                      <th scope="col" className="align-middle">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests?.map((request: any, index: number) => (
                      <tr key={request.id}>
                        <td>{index+1}</td>
                        <td>{request.date.slice(0,10)}</td>
                        <td>{request.office}</td>
                        <td><RequestStatusLabel content={request.status} /></td>
                        <td>{request.status_info}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center">
                {totalPage === 0 ?
                <button style={{display: "none"}}></button>
                : totalPage === 1 ?
                <Pagination>
                  <Pagination.Item>{1}</Pagination.Item>
                </Pagination>
                : <Pagination>
                  <Pagination.Prev></Pagination.Prev>
                  {pages}
                  <Pagination.Next></Pagination.Next>
                </Pagination>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Kolom 2 */}
        <div className="col col-md-3 col-sm-12">
          {/* Profile Card */}
          <div style={{border: "1px solid grey", borderRadius: "5px"}}>
            <div className="d-flex container p-2" style={{backgroundColor: "lightgrey"}}>
              <div className="px-2 py-1">
                <img src={employeeImage} alt="" height="40px" width="40px" style={{borderRadius: "50%"}}/>
              </div>
              <div className="d-flex row align-items-center">
                <div style={{fontSize: "1rem"}}>{employeeName}</div>
                <div className="text-muted" style={{fontSize: "0.8rem"}}>{employeeEmail}</div>
              </div>
            </div>
            <div className="d-flex container p-2">
              <div className="d-flex row align-items-center" style={{width: "55%"}}>
                <div className="text-muted" style={{fontSize: "0.8rem"}}>NIK</div>
                <div style={{fontSize: "0.8rem"}}>{employeeNIK}</div>
              </div>
              <div className="d-flex row align-items-center">
                <div className="text-muted" style={{fontSize: "0.8rem"}}>Base Office</div>
                <div style={{fontSize: "0.8rem"}}>{employeeOffice}</div>
              </div>
            </div>
          </div>

          {/* Vaccine Card */}
          <div className="my-4" style={{border: "1px solid grey", borderRadius: "5px", margin: "0"}}>
            <div className="d-flex row container pt-2">
              Sertifikat Vaksin
            </div>
            <div className="pb-2">
              <hr style={{width: "calc(100% - 10px)", margin: "0 auto"}} />
            </div>
            <div>
              <ol>
                {certificates?.map((certificate: string, index: number) => (
                  <li key={index}
                    className="d-flex container justify-content-between pb-1">
                    <div className="col">
                      <div>
                        {`Vaksin ${index+1}`}
                      </div>
                      <div className="text-muted" style={{fontSize: '0.7rem'}}>
                        {certificate === "Approved" ? 
                          'Terverifikasi'
                          : certificate === "Pending" ?
                          'Menunggu Verifikasi'
                          : 'Belum Diunggah'
                        }
                      </div>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      {certificate !== ""
                      ? <button className="btn btn-sm disabled" style={{fontSize: "0.7rem"}}>
                          Unggah Sertifikat
                        </button>
                      : <button className="btn btn-sm" style={{fontSize: "0.7rem"}}
                          onClick={handleCertificateModal}>
                          Unggah Sertifikat
                        </button>
                      }
                    </div>
                    {/* Certificate Modal */}
                    <div>
                      <Modal show={showCertificateModal} onHide={handleCloseCertificateModal} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>{`Unggah Sertifikat Vaksin ${index}`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <input type="file"
                            accept="image/*"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              const fileList = e.target.files;
                              if(!fileList) return;
                              setCertificateFile(fileList[0]);
                            }}
                          />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="outline-tertiary" onClick={handleCloseCertificateModal}>
                            Kembali
                          </Button>
                          <Button variant="secondary" onClick={handleCertificateUpload}>
                            Unggah File
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {certificates.filter(e => e === "").length === 0
            ? <div
              className="container mb-2 p-2"
              style={{backgroundColor: "lightgrey", margin: "0 auto", width: "calc(100% - 10px)", borderRadius: "5px"}}>
                <span><FaSyringe /></span> &nbsp; Unggah sertifikat vaksinasi selesai
            </div>
            : <div className="d-flex container mb-2 p-2" style={{backgroundColor: "lightgrey", margin: "0 auto", width: "calc(100% - 10px)", borderRadius: "5px"}}>
              <div className="px-2 py-1 d-flex align-items-center">
                <FaInfoCircle height="40px" width="40px" />
              </div>
              <div className="d-flex align-items-center">
                Lengkapi sertifikat vaksinmu untuk membuat permohonan WFO
              </div>
            </div>
            }
          </div>
        </div>

      </div>
    </div>
  )
};

export default User;
