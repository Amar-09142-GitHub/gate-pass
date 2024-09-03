import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/login";
import User from "./page/user";
import Layout from "./components/Layout";
import Employee from "./page/employee";
import Visitor from "./page/visitor";
import StoreProvider from "./store/storeProvider";
import { ToastContainer } from "react-toastify";
import Home from "./page/home";
import Log from "./page/log";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
    <StoreProvider>
      <Layout>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
          <Route path="/guard" element={<User />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/visitor" element={<Visitor />} />
          <Route path="/log" element={<Log />} />
          <Route path="*" element={<h1>Page Not Found</h1> } />
        </Routes>
        <ToastContainer />
      </Layout>
      
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
