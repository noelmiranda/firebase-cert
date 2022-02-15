import React, { useState } from "react";
import { Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function NavbarComponent() {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function goProfile() {
    navigate("/user");
  }

  async function handleLogout() {
    setError("");
    try {
      logout();
      console.log("you have successfully exited");
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }
  return (
    <Navbar
      className="bg-dark bg-gradient d-flex justify-content-end"
      variant="dark"
    >
      <Button variant="primary" className="btn-sm m-1" onClick={goProfile}>
        Profile
      </Button>
      <Button variant="danger" className="btn-sm m-1" onClick={handleLogout}>
        Log Out
      </Button>
    </Navbar>
  );
}
