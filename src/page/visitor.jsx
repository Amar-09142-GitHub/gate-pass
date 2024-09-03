import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  TablePagination,
  Typography,
} from "@mui/material";
import axios from "axios";
import Context from "../store/context";
import { useSelector } from "react-redux";
import Loader from "../components/loader";
import VisitorCheckIn from "../components/VisitorCheckIn";
import VisitorCheckOut from "../components/VisitorCheckOut";
import { useNavigate } from "react-router-dom";

const Visitor = () => {
  const imageUrl = useSelector((state) => state.reducer.imageUrl);
  const { getVisitor } = Context();
  const state = useSelector((state) => state.reducer);
  const [load, setLoad] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOutOpen, setModalOutOpen] = useState(false);
  const nav = useNavigate()
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

    
  useEffect(() => {
    
    if(!state.authStatus)
      nav("/login")
  }, [nav, state.authStatus])

  useEffect(() => {
    getVisitor();
    if (state.visitor !== null) {
      setLoad(false);
    }
  }, []);

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };
  const handleModalOutToggle = () => {
    setModalOutOpen(!modalOutOpen);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = state.visitor?.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  if (load) return <Loader />;

  return (
    <Container
      maxWidth="xl"
      style={{ marginTop: 64, flexGrow: 1, padding: 24 }}
    >
      <Typography variant="h4" gutterBottom>
        Visitor Page
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <TextField
          label="Filter"
          variant="outlined"
          value={filter}
          onChange={handleFilterChange}
        />
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleModalToggle}
          >
            Check-In
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleModalOutToggle}
          >
            Check-Out
          </Button>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sl No.</TableCell>
            <TableCell>Badge No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Phone No</TableCell>
            <TableCell>Purpose</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Check-In Time</TableCell>
            <TableCell>Check-Out Time</TableCell>
            <TableCell>Extra Information</TableCell>
            <TableCell>Image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.badge_no}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.phone_no}</TableCell>
                  <TableCell>{row.purpose}</TableCell>
                  <TableCell>{row.fro_m}</TableCell>
                  <TableCell>
                    {row.employee_name} ({row.employee_phone_no})
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.in_time}</TableCell>
                  <TableCell>{row.check_out}</TableCell>
                  <TableCell>
                    {row.vehicle_no && "Vehicle No.: " + row.vehicle_no} <br />
                    {row.aadhar_no && "Aadhaar No.: " + row.aadhar_no} <br />
                    {row.no_of_worker &&
                      "No. of Worker: " + row.no_of_worker}{" "}
                    <br />
                    {row.hrs && "Hours: " + row.hrs} <br />
                    {row.rate && "Rate: " + row.rate}
                  </TableCell>
                  <TableCell>
                    <img
                      src={imageUrl + row.image_in}
                      alt={row.name}
                      width="80"
                      style={{ borderRadius: "5px" }}
                    />
                    {row.type === "vehicle" && (
                      <img
                        src={imageUrl + row.image_out}
                        alt={row.name}
                        width="80"
                        style={{ borderRadius: "5px" }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={15} align="center">
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <VisitorCheckIn
        modalOpen={modalOpen}
        handleModalToggle={handleModalToggle}
      />
      <VisitorCheckOut
        modalOpen={modalOutOpen}
        handleModalToggle={handleModalOutToggle}
      />
    </Container>
  );
};

export default Visitor;
