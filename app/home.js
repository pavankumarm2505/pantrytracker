"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Container, AppBar, Toolbar } from "@mui/material";

const HomePage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/inventory");
  };
  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pantry Tracker
          </Typography>
          <Button color="inherit" onClick={handleSignIn}>
            Sign In
          </Button>
          <Button color="inherit" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          textAlign="center"
          gap={4}
          
          
        >
          <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
          >
            Welcome to Pantry Tracker!
          </Typography>
          <Typography
            variant="h5"
            component="p"
            color = "textSecondary"
          >
            The right place to keep track of your pantry!
          </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={handleButtonClick}>
            Go to Inventory Tracker
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;