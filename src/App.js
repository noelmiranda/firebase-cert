import React  from "react";
import Signup from "./components/authentication/Signup";
import { AuthProvider } from "./components/contexts/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./components/authentication/Profile";
import ForgotPassword from "./components/authentication/ForgotPassword";
import Login from "./components/authentication/Login";
import Dashboard from "./components/Drive/Dashboard";
import Hero from "./Hero";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Hero */}

          <Route exact path="/" element={<Hero />} />

          {/* Drive */}
          <Route exact path="/dashboard" element={<Dashboard />} />

          {/* Profile */}
          <Route exact path="/user" element={<Profile />} />

          {/* Auth */}
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;
