import React, { useState } from "react";
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Context from "../store/context";

const Header = () => {
  const { logout } = Context();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const state = useSelector((state) => state.reducer);
  return (
    <>
      <Drawer variant="persistent" anchor="left" open={sidebarOpen}>
        <Box width={250} style={{ marginTop: "70px" }}>
          {state.authStatus && (
            <Link
              style={{ textDecoration: "none", marginTop: "50px" }}
              to="/visitor"
            >
              <Typography
                style={{
                  textAlign: "center",
                  fontWeight: 600,
                  color: "black",
                  borderBottom: "1px solid #75757530",
                  padding: "10px",
                }}
                variant="h6"
                gutterBottom
              >
                Visitor
              </Typography>
            </Link>
          )}
          {state.authUser?.type === 1 && (
            <>
              <Link style={{ textDecoration: "none" }} to="/guard">
                <Typography
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    color: "black",
                    borderBottom: "1px solid #75757530",
                    padding: "10px",
                  }}
                  variant="h6"
                  gutterBottom
                >
                  Guards
                </Typography>
              </Link>
              <Link style={{ textDecoration: "none" }} to="/employee">
                <Typography
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    color: "black",
                    borderBottom: "1px solid #75757530",
                    padding: "10px",
                  }}
                  variant="h6"
                  gutterBottom
                >
                  Employees
                </Typography>
              </Link>
              <Link style={{ textDecoration: "none" }} to="/log">
                <Typography
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    color: "black",
                    borderBottom: "1px solid #75757530",
                    padding: "10px",
                  }}
                  variant="h6"
                  gutterBottom
                >
                  Logs
                </Typography>
              </Link>
            </>
          )}
          {state.authStatus && (
            <Button
              variant="contained"
              color="primary"
              onClick={logout}
              style={{ margin: "10px", width: "-webkit-fill-available" }}
            >
              Logout
            </Button>
          )}
          {/* Add your sidebar content here */}
        </Box>
      </Drawer>
      <AppBar position="fixed" style={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleSidebarToggle}
          >
            <MenuIcon />
          </IconButton>

          <Link style={{ textDecoration: "none" }} to="/">
            <Typography variant="h6" style={{ flexGrow: 1, color: "white" }}>
              Home
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
