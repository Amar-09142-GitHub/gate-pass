import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TextField,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Modal,
} from "@mui/material";
import OTPComponent from "./OTPComponent";
import CameraComponent from "./CameraComponent";
import { useSelector } from "react-redux";
import Context from "../store/context";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EngineeringIcon from "@mui/icons-material/Engineering";

const VisitorCheckIn = ({ modalOpen, handleModalToggle }) => {
  const emp = useSelector((state) => state.reducer.employee);
  const { getEmployee, checkIn } = Context();
  const [activeStep, setActiveStep] = useState(0);
  const [visitorType, setVisitorType] = useState("");
  const [visitorDetails, setVisitorDetails] = useState({
    phone_no: "",
    otp: "",
    name: "",
    purpose: "",
    badge_no: "",
    employee_id: "",
    fro_m: "",
    vehicle_no: "",
    aadhar_no: "",
    hrs: "",
    rate: "",
    no_of_worker: "",
    image_in: "",
  });

  useEffect(() => {
    getEmployee();
  }, []);

  const handleVisitorDetailsChange = (e) => {
    const { name, value } = e.target;
    setVisitorDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleVisitorTypeSelect = (type) => {
    setVisitorType(type);
    setActiveStep(1);
  };

  const handleOTPVerification = async ({ phone_no, verification }) => {
    if (verification) {
      setVisitorDetails((prevDetails) => ({
        ...prevDetails,
        phone_no: phone_no,
      }));
      setActiveStep(2);
    }
  };

  const handleCapture = async (photo) => {
    setVisitorDetails((prevDetails) => ({ ...prevDetails, image_in: photo }));
  };

  const handleSubmitVisitorDetails = async () => {
    const formData = new FormData();
    formData.append("type", visitorType);
    Object.keys(visitorDetails).forEach((key) => {
      formData.append(key, visitorDetails[key]);
    });

    try {
      const response = await checkIn(formData);
      console.log("Visitor details submitted:", response);
      handleModalToggle();
      setVisitorDetails({
        phone_no: "",
        otp: "",
        name: "",
        purpose: "",
        badge_no: "",
        employee_id: "",
        fro_m: "",
        vehicle_no: "",
        aadhar_no: "",
        hrs: "",
        rate: "",
        no_of_worker: "",
        image_in: "",
      });
      setActiveStep(0);
      console.log("Message sent to employee:", visitorDetails.employee_id);
    } catch (error) {
      console.error("Error submitting visitor details:", error);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Modal open={modalOpen} onClose={handleModalToggle}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        style={{
          transform: "translate(-50%, -50%)",
          width: 400,
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "white",
          padding: 24,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Visitor Check-In
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {["Select Type", "Verify Phone", "Submit Details"].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box display="flex" justifyContent="space-around" marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleVisitorTypeSelect("people")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 120,
                height: 120,
                borderRadius: 10,
                padding: 10,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#1976d2",
                color: "#fff",
              }}
            >
              <PeopleIcon style={{ fontSize: 60, marginBottom: 10 }} />
              <Typography variant="button" style={{ fontSize: 16 }}>
                People
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleVisitorTypeSelect("vehicle")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 120,
                height: 120,
                borderRadius: 10,
                padding: 10,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#1976d2",
                color: "#fff",
              }}
            >
              <DirectionsCarIcon style={{ fontSize: 60, marginBottom: 10 }} />
              <Typography variant="button" style={{ fontSize: 16 }}>
                Vehicle
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleVisitorTypeSelect("contractor")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 120,
                height: 120,
                borderRadius: 10,
                padding: 10,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#1976d2",
                color: "#fff",
              }}
            >
              <EngineeringIcon style={{ fontSize: 60, marginBottom: 10 }} />
              <Typography variant="button" style={{ fontSize: 16 }}>
                Contractor
              </Typography>
            </Button>
          </Box>
        )}
        {activeStep === 1 && (
          <Box marginTop={2}>
            <OTPComponent onOTPVerified={handleOTPVerification} />
            <Box display="flex" justifyContent="flex-start" marginTop={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleBack}
              >
                Back
              </Button>
            </Box>
          </Box>
        )}
        {activeStep === 2 && (
          <Box marginTop={2}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={visitorDetails.name}
              onChange={handleVisitorDetailsChange}
            />
            <TextField
              name="purpose"
              label="Purpose"
              variant="outlined"
              fullWidth
              margin="normal"
              value={visitorDetails.purpose}
              onChange={handleVisitorDetailsChange}
            />
            <TextField
              name="badge_no"
              label="Badge No"
              variant="outlined"
              fullWidth
              margin="normal"
              value={visitorDetails.badge_no}
              onChange={handleVisitorDetailsChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Employee ID</InputLabel>
              <Select
                name="employee_id"
                value={visitorDetails.employee_id}
                onChange={handleVisitorDetailsChange}
              >
                {emp?.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="fro_m"
              label="From"
              variant="outlined"
              fullWidth
              margin="normal"
              value={visitorDetails.fro_m}
              onChange={handleVisitorDetailsChange}
            />
            {visitorType === "vehicle" && (
              <TextField
                name="vehicle_no"
                label="Vehicle No"
                variant="outlined"
                fullWidth
                margin="normal"
                value={visitorDetails.vehicle_no}
                onChange={handleVisitorDetailsChange}
              />
            )}
            {visitorType === "contractor" && (
              <>
                <TextField
                  name="aadhar_no"
                  label="Aadhar No"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={visitorDetails.aadhar_no}
                  onChange={handleVisitorDetailsChange}
                />
                <TextField
                  name="hrs"
                  label="Hours"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={visitorDetails.hrs}
                  onChange={handleVisitorDetailsChange}
                />
                <TextField
                  name="rate"
                  label="Rate"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={visitorDetails.rate}
                  onChange={handleVisitorDetailsChange}
                />
                <TextField
                  name="no_of_worker"
                  label="No. of Workers"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={visitorDetails.no_of_worker}
                  onChange={handleVisitorDetailsChange}
                />
              </>
            )}
            <CameraComponent onCapture={handleCapture} />
            <Box display="flex" justifyContent="space-between" marginTop={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitVisitorDetails}
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default VisitorCheckIn;
