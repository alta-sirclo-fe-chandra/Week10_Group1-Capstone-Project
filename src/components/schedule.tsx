import { FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import { BsFillClockFill } from "react-icons/bs";
import { RiErrorWarningFill } from "react-icons/ri";
import { useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Schedule = () => {
  const [date, setDate] = useState(new Date());
  const user = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="container">
      <h2>{moment().format("LL")}</h2>
      <div className="row justify-content-between align-items-center">
        <div className="col-auto">
          <p className="m-0">
            <BsFillClockFill className="me-2 mb-1" /> {moment().format("LT")}
          </p>
        </div>
        <div className="col-auto ms-auto pe-0">
          <FaMapMarkerAlt />
        </div>
        <div className="col-auto ps-0">
          <select className="form-select border-0">
            <option defaultValue="1">Traveloka Campus</option>
            <option value="2">SCBD Distric 8</option>
            <option value="3">BSD City</option>
          </select>
        </div>
      </div>
      <div className="row my-5 justify-content-evenly">
        <div className="col-md-5 ">
          <Calendar
            className="border-0 p-4 shadow rounded-3"
            onChange={setDate}
            value={date}
          />
          <div className="row mt-5">
            <div className="col-auto">
              <RiErrorWarningFill className="fs-1" />
            </div>
            <div className="col-10">
              <p>
                Pilih lokasi dan klik tanggal untuk melakukan perubahan kuota
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <p className="fs-4">Karyawan Work from Office (50)</p>
          <div className="overflow-auto row" style={{ height: "20em" }}>
            {user.map(() => (
              <div className="row align-items-center my-2">
                <div className="col-auto">
                  <div className="avatar bg-dark p-2 fs-6 rounded-circle text-white">
                    <FaUserAlt />
                  </div>
                </div>
                <div className="col-auto">
                  <p className="m-0 fw-bold">Arlene McCoy</p>
                  <p className="m-0">
                    <small className="text-end">
                      {moment().format("LL")} @Traveloka Campus
                    </small>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
