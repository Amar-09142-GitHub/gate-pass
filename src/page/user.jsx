import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import { Check, Delete, Edit, Visibility } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import Context from '../store/context';
import Loader from '../components/loader';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const { insertGuard, getGuard, updateGuard } = Context();
  const state = useSelector((state) => state.reducer);
  const [load, setLoad] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone_no: '',
    email: '',
    image: '',
    blood_group: '',
    agency: '',
    address: '',
    password: '',
    c_password: '',
  });
  const [filter, setFilter] = useState('');
  const nav = useNavigate();
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
      await getGuard();
      setLoad(false);
    };
    fetchData();
  }, []);

  const handleDialogToggle = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmitUserDetails = async () => {
    try {
      const fd = new FormData();
      fd.append("name", userDetails.name);
      fd.append("phone_no", userDetails.phone_no);
      fd.append("email", userDetails.email);
      fd.append("address", userDetails.address);
      fd.append("blood_group", userDetails.blood_group);
      fd.append("agency", userDetails.agency);
      fd.append("password", userDetails.password);
      if(isEditing)
        fd.append("id", userDetails.id);
      const response = await !isEditing ? insertGuard(fd) : updateGuard(fd);
      console.log('User details submitted:', response.data);
      handleDialogToggle();
    } catch (error) {
      console.error('Error submitting user details:', error);
    }
  };

  const handleCancel = () => {
    setUserDetails({
      name: '',
      phone_no: '',
      email: '',
      blood_group: '',
      agency: '',
      address: '',
      password: '',
      c_password: '',
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
    setUserDetails(row);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3015/api/guard/${id}`);
      getGuard(); // Re-fetch data after delete
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCheckOut = (id) => {
    console.log(`Check-out user with id: ${id}`);
  };

  const handleView = (row) => {
    console.log('Viewing user details:', row);
  };

  const filteredData = state.guard?.filter(
    (row) =>
      row.name.toLowerCase().includes(filter.toLowerCase()) ||
      row.email.toLowerCase().includes(filter.toLowerCase()) ||
      row.phone_no.toLowerCase().includes(filter.toLowerCase()) ||
      row.agency.toLowerCase().includes(filter.toLowerCase()) ||
      row.blood_group.toLowerCase().includes(filter.toLowerCase()) ||
      row.address.toLowerCase().includes(filter.toLowerCase())
  );

  if (load) return <Loader />;

  return (
    <Container maxWidth="xl" style={{ marginTop: 64, flexGrow: 1, padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Guards
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <TextField
          label="Filter"
          variant="outlined"
          value={filter}
          onChange={handleFilterChange}
        />
        <Button variant="contained" color="primary" 
          onClick={() => {
            setIsEditing(false);
            setDialogOpen(true);
          }}>
          Add Guard
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sl No.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone No</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Blood Group</TableCell>
            <TableCell>Agency</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.phone_no}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <img
                    src={row.image}
                    alt={row.name}
                    width="80"
                    height="80"
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                </TableCell>
                <TableCell>{row.blood_group}</TableCell>
                <TableCell>{row.agency}</TableCell>
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
              <TableCell colSpan={9} align="center">
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
          {isEditing ? "Update" : "Submit" } User Details
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userDetails.name}
            onChange={handleUserDetailsChange}
          />
          <TextField
            name="phone_no"
            label="Phone No"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userDetails.phone_no}
            onChange={handleUserDetailsChange}
          />
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userDetails.email}
            onChange={handleUserDetailsChange}
          />
          <TextField
            name="blood_group"
            label="Blood Group"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userDetails.blood_group}
            onChange={handleUserDetailsChange}
          />
          <TextField
            name="agency"
            label="Agency"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userDetails.agency}
            onChange={handleUserDetailsChange}
          />
          <TextField
            name="address"
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userDetails.address}
            onChange={handleUserDetailsChange}
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userDetails.password}
            onChange={handleUserDetailsChange}
          />
          <TextField
            name="c_password"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userDetails.c_password}
            onChange={handleUserDetailsChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSubmitUserDetails}>
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

export default User;
