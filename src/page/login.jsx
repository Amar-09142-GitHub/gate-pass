import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import logo from '../logo.svg';
import Context from '../store/context';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const nav = useNavigate()
  const {login} = Context();
  const data = useSelector( state => state.reducer.authStatus);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');




  const handleLogin = async () => {
    const formData = new FormData();
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);

    try {
      const response = await login(formData);
      console.log(response.data);
      // handle success
    } catch (error) {
      console.error(error);
      // handle error
    }
  };
  useEffect(() => {
    if(data)
      nav("/")
    }, [handleLogin])

  return (
    <Container maxWidth="sm">
        <img src={logo} alt='logo' />
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Login
      </Button>
    </Container>
  );
};

export default Login;
