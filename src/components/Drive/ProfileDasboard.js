import React, { useState,useEffect} from 'react'
import { Container } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";

export default function ProfileDasboard() {
    const { currentUser, logout } = useAuth();
    const [photoURL, setPhotoURL] = useState(
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
      );

    useEffect(() => {
        if (currentUser?.photoURL) {
          setPhotoURL(currentUser.photoURL);
        }
      }, [currentUser]);
      
  return (
    <Container className='mt-5 p-5'>
      <strong>User:</strong> {currentUser.email}
        <img
              src={photoURL}
              alt="Avatar"
              className="avatar img-fluid rounded mt-2"
            />
    </Container>
  )
}
