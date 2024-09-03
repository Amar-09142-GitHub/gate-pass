import axios from "axios";
import * as actionType from "./action";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Context() {
  const root = "https://api-gate-pass.basukalaiti.com/api/";
  const dispatch = useDispatch();
  const nav = useNavigate();
  const login = async (payload) => {
    await axios
      .post(`${root}guard/login`, payload)
      .then(({ data }) => {
        if (data.success) {
          toast.success(`${data.message}`);
          dispatch({ type: actionType.LOGIN, data: data.guardData });
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const logout = async (payload) => {
    toast.success(`Logout Successfully`);
    dispatch({ type: actionType.LOGOUT });
    nav("/login")
  };
  const insertGuard = async (payload) => {
    await axios
      .post(`${root}guard/`, payload)
      .then(({ data }) => {
        if (data.success) {
          toast.success(`${data.message}`);
          getGuard();
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const updateGuard = async (payload) => {
    await axios
      .put(`${root}guard/`, payload)
      .then(({ data }) => {
        if (data.success) {
          toast.success(`${data.message}`);
          getGuard();
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const getGuard = async () => {
    await axios
      .get(`${root}guard/`)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: actionType.GETGUARD, guard: data.data });
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const insertEmployee = async (payload) => {
    await axios
      .post(`${root}employee`, payload)
      .then(({ data }) => {
        if (data.success) {
          toast.success(`${data.message}`);
          getEmployee();
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const updateEmployee = async (payload) => {
    await axios
      .put(`${root}employee`, payload)
      .then(({ data }) => {
        if (data.success) {
          toast.success(`${data.message}`);
          getEmployee();
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const getEmployee = async () => {
    await axios
      .get(`${root}employee/`)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: actionType.GETEMPLOYEE, employee: data.data });
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const checkIn = async (payload) => {
    await axios
      .post(`${root}visitor/check_in`, payload)
      .then(({ data }) => {
        console.log(data);
        if (data.success) {
          toast.success(`${data.message}`);
          getVisitor();
          return data;
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const checkOut = async (payload) => {
    await axios
      .put(`${root}visitor/check_out`, payload)
      .then(({ data }) => {
        if (data.success) {
          toast.success(`${data.message}`);
          getVisitor();
          return data;
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const getVisitor = async () => {
    await axios
      .get(`${root}visitor/`)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: actionType.GETVISITOR, visitor: data.data });
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  const getLog = async () => {
    await axios
      .get(`${root}log/`)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: actionType.GETLOG, log: data.data });
        } else toast.warn(`${data.data}`);
      })
      .catch((err) => toast.error(`Error: ${err}`));
  };
  return {
    insertGuard,
    updateGuard,
    getGuard,
    insertEmployee,
    updateEmployee,
    getEmployee,
    checkIn,
    checkOut,
    getVisitor,
    getLog,
    login,
    logout
  };
}
