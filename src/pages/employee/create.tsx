import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar";
import TextInput from "../../components/textInput";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { office, register } from "../../types";
import Footer from "../../components/footer";

const Create = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [officeId, setOfficeId] = useState(0);
  const [office, setOffice] = useState<office[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOffice();
  }, []);

  const handleCreate = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    registerUser({
      name,
      email,
      nik,
      password,
      office_id: officeId,
    });
  };

  const registerUser = async (body: register) => {
    await axios
      .post("/register", body)
      .then(() => {
        Swal.fire(
          "Success!",
          "Employee Account has been created.",
          "success"
        ).then((res) => {
          if (res.isConfirmed) {
            navigate("/");
          }
        });
      })
      .catch((err: any) => {
        Swal.fire("I'm sorry", err.message, "error");
      });
  };

  const fetchOffice = async () => {
    await axios.get("/offices").then((res) => {
      const { data } = res;
      setOffice(data);
    });
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ minHeight: "calc(100vh - 156px)" }}>
        <h3 className="pt-3">Tambah Employee</h3>
        <form className="row g-3 mb-5" onSubmit={handleCreate}>
          <div className="col-md-5">
            <TextInput
              label="Nama"
              type="text"
              placeholder="James"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
          <div className="col-md-1" />
          <div className="col-md-5">
            <TextInput
              label="Email"
              type="email"
              placeholder="example@mail.com"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="col-md-5">
            <TextInput
              label="No. NIK"
              type="text"
              placeholder="0123456789123456"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNik(e.target.value)
              }
            />
          </div>
          <div className="col-md-1" />
          <div className="col-md-5">
            <p className="mt-3">
              Kantor Utama
              <span className="input text-danger">*</span>
            </p>
            <select
              className="form-select"
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setOfficeId(Number(e.target.value));
              }}
            >
              <option defaultValue="">Pilih lokasi kantor</option>
              {office.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <TextInput
              label="Password"
              type="password"
              placeholder="1234"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <div className="col-12">
            <div className="row g-3 mt-3 justify-content-center">
              <div className="col-md-2 d-grid">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </div>
              <div className="col-md-2 d-grid">
                <button type="submit" className="btn btn-success">
                  Create
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Create;
