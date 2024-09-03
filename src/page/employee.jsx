import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  IconButton,
} from "@mui/material";
import axios from "axios";
import { Delete, Edit } from "@mui/icons-material";
import Context from "../store/context";
import { useSelector } from "react-redux";
import Loader from "../components/loader";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const { insertGuard, getEmployee } = Context();
  const nav = useNavigate()
  const state = useSelector((state) => state.reducer);
  const imageUrl = useSelector((state) => state.reducer.imageUrl);
  const [load, setLoad] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "",
    phone_no: "",
    image: "",
    email: "",
    address: "",
  });
  const [tableData, setTableData] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    console.log(state)
    if(!state.authStatus)
      nav("/login")
    if(state.authUser?.type === 2)
      nav("/")
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await getEmployee();
      setLoad(false);
    };
    fetchData();

  }, []);

  const handleDialogToggle = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleEmployeeDetailsChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmitEmployeeDetails = async () => {
    try {
      const fd = new FormData();
      fd.append("name", employeeDetails.name);
      fd.append("phone_no", employeeDetails.phone_no);
      fd.append("image", employeeDetails.image);
      fd.append("email", employeeDetails.email);
      fd.append("address", employeeDetails.address);

      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:3015/api/employee/${employeeDetails.id}`, fd);
      } else {
        response = await insertGuard(fd);
      }

      console.log("Employee details submitted:", response.data);
      handleDialogToggle();
      setIsEditing(false);
      setEmployeeDetails({
        name: "",
        phone_no: "",
        image: "",
        email: "",
        address: "",
      });
    } catch (error) {
      console.error("Error submitting employee details:", error);
    }
  };

  const handleCancel = () => {
    setEmployeeDetails({
      name: "",
      phone_no: "",
      image: "",
      email: "",
      address: "",
    });
    handleDialogToggle();
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

  const handleEdit = (row) => {
    setEmployeeDetails(row);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3015/api/employee/${id}`);
      setTableData(tableData.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const filteredData = state.employee?.filter(
    (row) =>
      row.name?.toLowerCase().includes(filter.toLowerCase()) ||
      row.phone_no?.toLowerCase().includes(filter.toLowerCase()) ||
      row.email?.toLowerCase().includes(filter.toLowerCase()) ||
      row.address?.toLowerCase().includes(filter.toLowerCase())
  );

  if (load) return <Loader />;

  return (
    <Container
      maxWidth="xl"
      style={{ marginTop: 64, flexGrow: 1, padding: 24 }}
    >
      <Typography variant="h4" gutterBottom>
        Employee Page
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsEditing(false);
            setDialogOpen(true);
          }}
        >
          Add Employee
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sl No.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone No</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone_no}</TableCell>
                  <TableCell>
                    <img
                      src={imageUrl + row.image}
                      alt={row.name}
                      width="80"
                      height="80"
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(row)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
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
      <Dialog
        open={dialogOpen}
        onClose={handleDialogToggle}
        scroll="paper"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Update Employee Details" : "Add Employee Details"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={employeeDetails.name}
            onChange={handleEmployeeDetailsChange}
          />
          <TextField
            name="phone_no"
            label="Phone No"
            variant="outlined"
            fullWidth
            margin="normal"
            value={employeeDetails.phone_no}
            onChange={handleEmployeeDetailsChange}
          />
          <TextField
            name="image"
            label="Image URL"
            variant="outlined"
            fullWidth
            margin="normal"
            value={employeeDetails.image}
            onChange={handleEmployeeDetailsChange}
          />
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={employeeDetails.email}
            onChange={handleEmployeeDetailsChange}
          />
          <TextField
            name="address"
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={employeeDetails.address}
            onChange={handleEmployeeDetailsChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitEmployeeDetails}
          >
            Submit
          </Button>
          <Button variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employee;
