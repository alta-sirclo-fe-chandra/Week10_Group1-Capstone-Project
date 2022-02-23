import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const User = () => {
  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeEmail, setEmployeeEmail] = useState<string>('');
  const [employeeImage, setEmployeeImage] = useState<string>('');
  const [employeeNIK, setEmployeeNIK] = useState<string>('');
  const [employeeOffice, setEmployeeOffice] = useState<string>('');

  const [offices, setOffices] = useState<string[]>([]);

  const [certificates, setCertificates] = useState<string[]>();

  const vaccines: string[] = ['Vaksin 1', 'Vaksin 2', 'Vaksin 3'];
  const certificateStatus: string[] = ['Belum Diunggah', 'Menunggu Verifikasi', 'Terverifikasi'];

  useEffect(() => {
    axios
      .get('https://virtserver.swaggerhub.com/mufidi-a/capstone-group-1/1.0.0/users')
      .then((res) => {
        const { data } = res;
        setEmployeeName(data[0].name);
        setEmployeeEmail(data[0].email);
        setEmployeeImage(data[0].image_url);
        setEmployeeNIK(data[0].nik);
        setEmployeeOffice(data[0].office[0].office_name);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get('https://virtserver.swaggerhub.com/mufidi-a/capstone-group-1/1.0.0/office')
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
        setCertificates([data.certificate_url_1, data.certificate_url_2, data.certificate_url_3]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [employeeName])

  return (
    <div className="container">
      {/* Whole Page */}
      <div className="d-flex mt-2 mx-5 px-3">
        <h4>Hi, {employeeName}! 👋</h4>
      </div>
      <div className="d-flex justify-content-center mt-2">
        {/* Kolom 1 */}
        <div className="col col-md-8">
          <div className="container d-flex col p-2 mr-4 justify-content-between" style={{border: "1px solid grey", borderRadius: "5px", width: "95%"}}>
            <div className="col">
              <h6>{moment().format("dddd, Do MMMM YYYY")}</h6>
              <h6 style={{fontSize: "0.8rem"}} className="text-muted">{moment().format("HH.MM") + " WIB"}</h6>
            </div>
            <div className="d-flex align-items-center">
              <button className="btn btn-secondary">Check In</button>
            </div>
          </div>
          <div className="container d-flex col p-2 mr-4 mt-2" style={{border: "1px solid grey", borderRadius: "5px", width: "95%"}}>
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
            <div className="d-flex w-50 row">
              <div>
                Karyawan Work from Office
              </div>
              <div>
                <button className="btn btn-secondary" style ={{marginBottom: 0}}>Request WFO</button>
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
              <hr/>
            </div>
            {certificates?.map((certificate: string, index: number) => (
              <div key={index}
                className="d-flex container justify-content-between pb-2">
                <div className="col">
                  <div>
                    {`Vaksin ${index+1}`}
                  </div>
                  <div className="text-muted" style={{fontSize: '0.7rem'}}>
                    {certificate.includes('.png') ? certificateStatus[2] : certificateStatus[0]}
                  </div>
                </div>
                <div className="d-flex align-items-center text-muted" style={{fontSize: '0.7rem'}}>
                  Unggah Sertifikat
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
};

export default User;
