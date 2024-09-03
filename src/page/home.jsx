import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import VisitorCheckIn from "../components/VisitorCheckIn";
import VisitorCheckOut from "../components/VisitorCheckOut";
import {
  Login as CheckInIcon,
  Logout as CheckOutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOutOpen, setModalOutOpen] = useState(false);
  const nav = useNavigate()
  const state = useSelector(state => state.reducer)

  useEffect(() => {
    if(!state.authStatus)
      nav("/login")
  }, [])

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };

  const handleModalOutToggle = () => {
    setModalOutOpen(!modalOutOpen);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        gap={2}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleModalToggle}
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
          <CheckInIcon style={{ fontSize: 60, marginBottom: 10 }} />
          <Typography variant="button" style={{ fontSize: 16 }}>
            CHECK-IN
          </Typography>
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleModalOutToggle}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 120,
            height: 120,
            borderRadius: 10,
            padding: 10,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#d32f2f",
            color: "#fff",
          }}
        >
          <CheckOutIcon style={{ fontSize: 60, marginBottom: 10 }} />
          <Typography variant="button" style={{ fontSize: 16 }}>
            CHECK-OUT
          </Typography>
        </Button>
      </Box>
      <VisitorCheckIn
        modalOpen={modalOpen}
        handleModalToggle={handleModalToggle}
      />
      <VisitorCheckOut
        modalOpen={modalOutOpen}
        handleModalToggle={handleModalOutToggle}
      />
    </>
  );
}
