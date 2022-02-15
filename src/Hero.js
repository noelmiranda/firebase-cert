import React from "react";
import { Container, Button } from "react-bootstrap";
import imageHome from "../src/Img/pexels-miguel-á-padriñán-1591060.jpg";
import { useNavigate } from "react-router-dom";
const style = {
  backgroundImage: `url(${imageHome})`,
  backgroundSize: "cover",
};
export default function Hero() {
  const Navigate = useNavigate();
  function getStarted() {
    Navigate("/login");
  }

  return (
    <Container
      fluid
      className="background-overlay text-white py-5 min-vw-100 min-vh-100"
      responsive="sm"
      style={style}
    >
      <div className="container mt-4">
        <div className="text-center justify-content-center align-self-center">
          <h1 className="display-4 text-white">My</h1>
          <hr />
        </div>
        <div className="w-100 text-center mt-2">
          <Button variant="primary" className="mt-5" onClick={getStarted}>
            Get Started
          </Button>
        </div>
      </div>
    </Container>
  );
}
