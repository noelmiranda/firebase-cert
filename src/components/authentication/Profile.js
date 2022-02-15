import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { upload } from "../../firestoreConf";
import firebaseApp from "../../credentials";
import { getFirestore } from "firebase/firestore";
import CenterContainer from "./CenterContainer";
import imageHome from "../../Img/pexels-pixabay-531880.jpg";
const style = {
  backgroundImage: `url(${imageHome})`,
  backgroundSize: "cover",
};
const firestore = getFirestore(firebaseApp);

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );

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

  function goDashboard() {
    navigate("/dashboard");
  }
  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function handleClick() {
    upload(photo, currentUser, setLoading);
  }
  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  return (
    <Container
      fluid
      className="background-overlay text-white py-5"
      responsive="sm"
      style={style}
    >
      <CenterContainer>
        <Card className="bg-dark text-light d-block">
          <Card.Body className="d-block">
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>Email:</strong> {currentUser.email}
            <img
              src={photoURL}
              alt="Avatar"
              className="avatar img-fluid img-thumbnail mt-2"
            />
            <div className="fields mt-2">
              <input
                type="file"
                placeholder="Change your Avatar"
                onChange={handleChange}
              />
              <button disabled={loading || !photo} onClick={handleClick}>
                Upload
              </button>
            </div>
          </Card.Body>

          <Container fluid>
            <Button
              variant="primary"
              className="w-100 mt-2"
              onClick={goDashboard}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="danger"
              className="w-100 mt-2 mb-2"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Container>
        </Card>
      </CenterContainer>
    </Container>
  );
}
