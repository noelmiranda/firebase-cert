import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  FormLabel,
  FormControl,
  ModalBody,
  FormGroup,
  ModalFooter,
  Container,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { saveWebsites, updateWebsite, timestamp } from "../../firestoreConf";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import ProfileDasboard from "./ProfileDasboard";

export default function AddFoldeButton({ currentFolder }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [url, setUrl] = useState("");
  const params = useParams();
  // const navigate = useNavigate();

  const validURL = (str) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  const { currentUser } = useAuth();

  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validURL(url))
      return toast("invalid url", { type: "warning", autoClose: 1000 });

    if (!params.id) {
      await saveWebsites({
        name: name,
        description: description,
        url: url,
        userId: currentUser.uid,
        createdAt: timestamp,
      });
      toast("New Link Added", {
        type: "success",
      });
      setName("");
      setdescription("");
      setUrl("");
      closeModal();
    } else {
      await updateWebsite(params.id, {
        name: name,
        description: description,
        url: url,
        userId: currentUser.uid,
        createdAt: timestamp,
      });
      toast("Updated", {
        type: "success",
      });
    }
  }

  return (
    <Container fluid className="text-white min-vh-100 text-center">
      <ProfileDasboard />
      <h4>New website</h4>
      <Button onClick={openModal} variant="primary" className="w-100">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <FormLabel>Name</FormLabel>
              <FormControl
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Description</FormLabel>
              <FormControl
                type="text"
                required
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>URL</FormLabel>
              <FormControl
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit" onClick={closeModal}>
              Add Website
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  );
}
