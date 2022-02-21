import { ChangeEvent, FormEvent, useState } from "react";
import TextInput from "../components/textInput";
import Logo from "../assets/images/logo.svg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { reduxAction } from "../stores/actions/action";
import Swal from "sweetalert2";

type body = {
  email: string;
  password: string;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInValid, setIsInvalid] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    LoginUser({
      email: email,
      password: password,
    });
  };

  const LoginUser = async (body: body) => {
    await axios
      .post("/login", body)
      .then((res) => {
        const { data } = res;
        localStorage.setItem("token", data.token);
        dispatch(reduxAction("isLoggedIn", true));
      })
      .catch(async (err) => {
        setIsInvalid(true);
        await Swal.fire("I'm sorry", err.message, "error");
      });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center mt-5">
        <div className="text-center col col-md-5 col-lg-3">
          <img
            src={Logo}
            alt="logo"
            height="100"
            className="d-inline-block align-text-top mb-3"
          />
          <div className="text-start">
            <h2 className="mb-0">Welcome back!</h2>
            <small>Please enter your details.</small>
          </div>
          <form className="mt-3" onSubmit={handleLogin}>
            <TextInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              isInvalid={isInValid}
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              isInvalid={isInValid}
            />
            <div className="col d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-success">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
