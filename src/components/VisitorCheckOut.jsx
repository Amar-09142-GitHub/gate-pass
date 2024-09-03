import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Modal,
  Autocomplete,
} from "@mui/material";
import CameraComponent from "./CameraComponent";
import { useSelector } from "react-redux";
import Context from "../store/context";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EngineeringIcon from "@mui/icons-material/Engineering";

const VisitorCheckOut = ({ modalOpen, handleModalToggle }) => {
  const visitorList = useSelector((state) => state.reducer.visitor);
  const { getVisitor, checkOut } = Context();
  const [activeStep, setActiveStep] = useState(0);
  const [visitorType, setVisitorType] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [capturedImage, setCapturedImage] = useState("");

  const handleVisitorTypeSelect = (type) => {
    setVisitorType(type);
    setActiveStep(1);
  };

  useEffect(() => {
    getVisitor();
  }, [visitorType]);

  const handleVisitorSelect = (event, visitor) => {
    setSelectedVisitor(visitor);
  };

  const handleCapture = (photo) => {
    setCapturedImage(photo);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("id", selectedVisitor.id);
    formData.append("image_out", capturedImage);

    try {
      const response = await checkOut(formData);
      console.log("Check-out details submitted:", response);
      handleModalToggle();
      setSelectedVisitor(null);
      setCapturedImage("");
      setActiveStep(0);
    } catch (error) {
      console.error("Error submitting check-out details:", error);
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
          Visitor Check-Out
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {["Select Visitor", "Submit Details"].map((label) => (
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
            <Autocomplete
              options={visitorList.filter(
                (data) => data.type === visitorType && data.check_out === null
              )}
              getOptionLabel={(option) => option.name}
              onChange={handleVisitorSelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Visitor"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              )}
            />
            {selectedVisitor && (
              <Box marginTop={2}>
                <Typography variant="body1">
                  Name: {selectedVisitor.name}
                </Typography>
                <Typography variant="body1">
                  Badge No.: {selectedVisitor.badge_no}
                </Typography>
                <Typography variant="body1">
                  Permission To Check-out:{" "}
                  {selectedVisitor.permission ? "Yes" : "No"}
                </Typography>
                {selectedVisitor.vehicle_no && (
                  <Typography variant="body1">
                    Vehicle No.: {selectedVisitor.vehicle_no}
                  </Typography>
                )}
                {selectedVisitor.aadhar_no && (
                  <Typography variant="body1">
                    Aadhaar No.: {selectedVisitor.aadhar_no}
                  </Typography>
                )}
                {selectedVisitor.no_of_worker && (
                  <Typography variant="body1">
                    No. of Worker: {selectedVisitor.no_of_worker}
                  </Typography>
                )}
                {selectedVisitor.hrs && (
                  <Typography variant="body1">
                    Hours: {selectedVisitor.hrs}
                  </Typography>
                )}
                {selectedVisitor.rate && (
                  <Typography variant="body1">
                    Rate: {selectedVisitor.rate}
                  </Typography>
                )}

                {visitorType === "vehicle" && (
                  <CameraComponent onCapture={handleCapture} />
                )}
              </Box>
            )}
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
                onClick={handleSubmit}
                disabled={!selectedVisitor?.permission}
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

export default VisitorCheckOut;
