/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { reduxAction } from "../stores/actions/action";
import { RootState } from "../stores/reducers/reducer";
import { userInfo } from "../stores/types/type";
import axios from "axios";
import jwtDecode from "jwt-decode";
import moment from "moment";
import App from "../App";
import Error from "../pages/error";
import Login from "../pages/login";
import Create from "../pages/employee/create";
import "moment/locale/id";
moment.locale("id");

const Index = () => {
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userInfo: userInfo = jwtDecode(token);
      dispatch(reduxAction("isLoggedIn", true));
      dispatch(reduxAction("userInfo", userInfo));
    }
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : ``;
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <App /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={isLoggedIn ? <Create /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Error />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Index;
