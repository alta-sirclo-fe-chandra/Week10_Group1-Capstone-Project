import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import 'moment/locale/id';
import { Button, Modal, ModalBody } from "react-bootstrap";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import EmployeeCard from "../../../components/employeeCard";
import RequestStatusLabel from "../../../components/requestStatusLabel";
import "../user/user.module.css";
import { FaSort, FaSyringe, FaInfoCircle } from "react-icons/fa";

const User = () => {
  const token: string | null = localStorage.getItem('token');

  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeEmail, setEmployeeEmail] = useState<string>('');
  const [employeeImage, setEmployeeImage] = useState<string>('');
  const [employeeNIK, setEmployeeNIK] = useState<string>('');
  const [employeeOffice, setEmployeeOffice] = useState<string>('');
  const [employeeVaccineStat, setEmployeeVaccineStat] = useState<string>('');

  const [offices, setOffices] = useState<string[]>([]);

  const [certificates, setCertificates] = useState<string[]>();

  const [date, setDate] = useState<string>('');

  const [attendants, setAttendants] = useState<[]>([]);
  
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  
  const certificateStatus: string[] = ['Belum Diunggah', 'Menunggu Verifikasi', 'Terverifikasi'];

  const [dose, setDose] = useState<number>(1);

  const [file, setFile] = useState<any>();

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
      .get('https://virtserver.swaggerhub.com/mufidi-a/capstone-group-1/1.0.0/certificates')
      .then((res) => {
        const { data } = res;
        setCertificates([data.certificate_url_1, data.certificate_url_2, ""]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [employeeName]);

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

  const handleRequestModal = () => {
    setShowRequestModal(true);
  }
  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
  }

  const handleCertificateModal = () => {
    setShowCertificateModal(true);
  }
  const handleCloseCertificateModal = () => {
    setShowCertificateModal(false);
  }
  const handleCertificateUpload = async() => {
    setShowCertificateModal(false);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("vaccinedose", "2");
    formData.append("description", `vaksin ke-${2}`);

    await axios
      .post('https://richap.space/certificates', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
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
              <button className="btn btn-secondary">Check In</button>
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
            <div className="d-flex w-50 row">
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
                <button
                  className="btn btn-secondary"
                  style ={{width: "inherit"}}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Jangan lupa validasi tanggalnya"
                  onClick={handleRequestModal}>
                    Request WFO
                </button>
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
                    <Modal.Footer>
                      <Button variant="outline-tertiary" onClick={handleCloseRequestModal}>
                        Kembali
                      </Button>
                      <Button variant="secondary" onClick={handleCloseRequestModal}>
                        Kirim Permohonan WFO
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {/* History Section */}
          <div className="container d-flex col p-2 mr-4 mt-2" style={{border: "1px solid grey", borderRadius: "5px", width: "90%"}}>
            <div className="row">
              <div>
                <h6>Riwayat Permohonan Work from Office (WFO)</h6>
              </div>
              <div>
                <table className="table table-borderless table-hover">
                  <thead style={{backgroundColor: "lightgrey"}}>
                    <tr>
                      <th scope="col" className="align-middle">No</th>
                      <th scope="col" className="align-middle" style={{position: "relative"}}>
                        Tanggal &nbsp; <span onClick={() => console.log("clicked")} style={{position: "absolute", top: "16%"}}><FaSort /></span>
                      </th>
                      <th scope="col" className="align-middle">Lokasi</th>
                      <th scope="col" className="align-middle">Status</th>
                      <th scope="col" className="align-middle">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>25 Januari 2022</td>
                      <td>BSD</td>
                      <td><RequestStatusLabel content="Diterima"/></td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>22 Januari 2022</td>
                      <td>BSD</td>
                      <td><RequestStatusLabel content="Pending"/></td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>20 Januari 2022</td>
                      <td>Jakarta</td>
                      <td><RequestStatusLabel content="Ditolak"/></td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-outline-secondary m-1" style={{border: "none"}}>{"<"}</button>
                <button className="btn btn-outline-secondary m-1" style={{border: "none"}}>{1}</button>
                <button className="btn btn-outline-secondary m-1" style={{border: "none"}}>{2}</button>
                <button className="btn btn-outline-secondary m-1" style={{border: "none"}}>{"..."}</button>
                <button className="btn btn-outline-secondary m-1" style={{border: "none"}}>{10}</button>
                <button className="btn btn-outline-secondary m-1" style={{border: "none"}}>{">"}</button>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom 2 */}
        <div className="col col-md-3">
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
              <div className="d-flex row align-items-center w-50">
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
            <ul>
              {certificates?.map((certificate: string, index: number) => (
                <li key={index}
                  className="d-flex container justify-content-between pb-1">
                  <div className="col">
                    <div>
                      {`Vaksin ${index+1}`}
                    </div>
                    <div className="text-muted" style={{fontSize: '0.7rem'}}>
                      {certificate.includes('.png') ? certificateStatus[2] : certificateStatus[0]}
                    </div>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    {certificate.includes('.png')
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
                        <Modal.Title>Unggah Sertifikat Vaksin {index+1}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <input type="file"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const fileList = e.target.files;
                            if(!fileList) return;
                            setFile(fileList);
                          }}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="outline-tertiary" onClick={handleCloseCertificateModal}>
                          Kembali
                        </Button>
                        <Button variant="secondary" onClick={handleCertificateModal}>
                          Unggah File
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </li>
              ))}
            </ul>
            {employeeVaccineStat === "Approve"
            ? <div className="container mb-2 p-2" style={{backgroundColor: "lightgrey", margin: "0 auto", width: "calc(100% - 10px)", borderRadius: "5px"}}>
                <span><FaSyringe /></span> &nbsp; Verifikasi vaksinasi selesai
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
