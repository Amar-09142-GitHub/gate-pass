import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const OTPComponent = ({ onOTPVerified }) => {
    const [otpSend, setOtpSend] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isPhoneNumberDisabled, setIsPhoneNumberDisabled] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }
    return () => clearTimeout(timer);
  }, [isCountdownActive, countdown]);

  const handleSendOTP = () => {
    if (phoneNumber) {
      // Logic to send OTP to the phone number
      const send = Math.floor(100000 + Math.random() * 900000)
      console.log('Sending OTP to', phoneNumber);
      setOtpSend(send)
      console.log('Sending OTP is', send);
      setIsPhoneNumberDisabled(true);
      setIsOTPSent(true);
      setIsCountdownActive(true);
      setCountdown(30);
    }
  };

  const handleVerifyOTP = () => {
    if (otp) {
      // Logic to verify OTP
      console.log('Verifying OTP', otp);
      const isVerified = otpSend === parseInt(otp); // Replace with actual verification logic
      if (isVerified) {
        onOTPVerified({phone_no: phoneNumber, verification:isVerified});
      } else {
        alert('Invalid OTP');
      }
    }
  };

  const handleResendOTP = () => {
    if (!isCountdownActive) {
      handleSendOTP();
    }
  };

  const handleChangeNumber = () => {
    setIsPhoneNumberDisabled(false);
    setIsOTPSent(false);
    setOtp('');
    setCountdown(0);
    setIsCountdownActive(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2} gap={2}>
      <TextField
        label="Phone Number"
        variant="outlined"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        disabled={isPhoneNumberDisabled}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSendOTP} disabled={isPhoneNumberDisabled || !phoneNumber}>
        Send OTP
      </Button>
      {isOTPSent && (
        <>
          <TextField
            label="OTP"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleVerifyOTP} disabled={!otp}>
            Verify OTP
          </Button>
          <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
            <Button variant="outlined" onClick={handleResendOTP} disabled={isCountdownActive}>
              Resend OTP {isCountdownActive && `(${countdown})`}
            </Button>
            <Button variant="outlined" onClick={handleChangeNumber}>
              Change Number
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default OTPComponent;
