import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getWebsites, onGetWebsites } from "../../firestoreConf";
import { WebsiteCard } from "./WebsiteCard";
import { useAuth } from "../contexts/AuthContext";

export default function GetWebsites() {
  const { currentUser } = useAuth();
  const [websites, setWebsites] = useState([]);
  console.log(currentUser.uid);
  const getLinks = async () => {
    const querySnapshot = await getWebsites();
    onGetWebsites((querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      console.log(docs);
      setWebsites(docs);
    });
  };

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <Container className="d-flex align-content-start flex-wrap mt-5">
      {websites.map((link) => (
        <div className="col-md-4" key={link.id}>
          <WebsiteCard link={link} />
        </div>
      ))}
    </Container>
  );
}
