import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AddFoldeButton from "./AddFoldeButton";
import GetWebsites from "../Drive/GetWebsites";
import Navbar from "./Navbar";
import imageHome from "../../Img/pexels-pixabay-531880.jpg";
const style = {
  backgroundImage: `url(${imageHome})`,
  backgroundSize: "cover",
};

export default function Dashboard() {
  return (
    <>
      <Navbar />
      {/* <Background/> */}
      <Container
        fluid
        className="background-overlay text-white py-5 h-50"
        responsive="sm"
        style={style}
      >
        <Row>
          <Col xs={12} md={3}>
            <AddFoldeButton />
          </Col>
          <Col xs={12} md={8}>
            <GetWebsites />
          </Col>
        </Row>
      </Container>
    </>
  );
}
