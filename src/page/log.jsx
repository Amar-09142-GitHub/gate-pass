import React, { useState, useEffect } from 'react';
import {
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
} from '@mui/material';
import { useSelector } from 'react-redux';
import Context from '../store/context';
import Loader from '../components/loader';
import { useNavigate } from 'react-router-dom';

const Log = () => {
  const { getLog } = Context();
  const nav = useNavigate();
  const state = useSelector((state) => state.reducer);

  const [load, setLoad] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    
    if(!state.authStatus)
      nav("/login")
    if(state.authUser?.type === 2)
      nav("/")
  }, [nav, state.authStatus, state.authUser?.type])

  useEffect(() => {
    const fetchData = async () => {
      await getLog();
      setLoad(false);
    };
    fetchData();
  }, []);

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


  const filteredData = state.log?.filter((row) => {
    const effectiveId = row.effective_id?.toString().toLowerCase();
    const description = row.description?.toString().toLowerCase();
    const by = row.b_y?.toString().toLowerCase();
    const filterText = filter?.toLowerCase();

    return (
      effectiveId.includes(filterText) ||
      description.includes(filterText) ||
      by.includes(filterText)
    );
  });

  if (load) return <Loader />;

  return (
    <Container maxWidth="xl" style={{ marginTop: 64, flexGrow: 1, padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Logs
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <TextField
          label="Filter"
          variant="outlined"
          value={filter}
          onChange={handleFilterChange}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sl No.</TableCell>
            <TableCell>Effective ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.effective_id}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.b_y}</TableCell>
          
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
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
    </Container>
  );
};

export default Log;
