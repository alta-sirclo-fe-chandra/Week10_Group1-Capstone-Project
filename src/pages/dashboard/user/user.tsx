import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import EmployeeCard from "../../../components/employeeCard";
import RequestStatusLabel from "../../../components/requestStatusLabel";
import "../user/user.module.css";
import { FaSort } from "react-icons/fa";

const User = () => {
  const token: string | null = localStorage.getItem('token');

  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeEmail, setEmployeeEmail] = useState<string>('');
  const [employeeImage, setEmployeeImage] = useState<string>('');
  const [employeeNIK, setEmployeeNIK] = useState<string>('');
  const [employeeOffice, setEmployeeOffice] = useState<string>('');

  const [offices, setOffices] = useState<string[]>([]);

  const [certificates, setCertificates] = useState<string[]>();

  const certificateStatus: string[] = ['Belum Diunggah', 'Menunggu Verifikasi', 'Terverifikasi'];

  const employees: string[] = ['alpaca', 'barnacle', 'capybara', 'donkey', 'eagle', 'falcon', 'gorilla'];

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
  }, [employeeName])

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
              <h6>{moment().format("dddd, MMMM Do YYYY")}</h6>
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
                  onClickDay={(value, event) => alert(`Clicked day: ${value}`)}/>
              </div>
            </div>
            {/* Attendance Section */}
            <div className="d-flex w-50 row">
              <div>
                Karyawan Work from Office
              </div>
              <div data-bs-spy="scroll" data-bs-offset="0" className="scrollspy-example" tabIndex={0} style={{height: '290px', overflowY: 'scroll'}}>
                {employees?.map((employee: string, index: number) => (
                  <div key={index}>
                    <EmployeeCard
                      image={'https://apsec.iafor.org/wp-content/uploads/sites/37/2017/02/IAFOR-Blank-Avatar-Image.jpg'}
                      employee={employee}
                      wfoDate="20220205"
                      wfoLocation="Traveloka Campus" />
                  </div>
                ))}
              </div>
              <div style={{marginTop: "10px"}}>
                <button className="btn btn-secondary" style ={{width: "inherit"}}>Request WFO</button>
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
          <div className="my-4" style={{border: "1px solid grey", borderRadius: "5px"}}>
            <div className="d-flex row container pt-2">
              Sertifikat Vaksin
              <hr />
            </div>
            <ul>
              {certificates?.map((certificate: string, index: number) => (
                <li key={index}
                  className="d-flex container justify-content-between pb-2">
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
                    : <button className="btn btn-sm" style={{fontSize: "0.7rem"}}>
                        Unggah Sertifikat
                      </button>
                    }
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
};

export default User;
