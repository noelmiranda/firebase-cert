import { deleteWebsite } from "../../firestoreConf";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function WebsiteCard({ link }) {
  const navigate = useNavigate();

  const onDeleteLink = async (id) => {
    if (window.confirm("are you sure you want to delete this link?")) {
      await deleteWebsite(id);
      toast("Link Removed Successfully", {
        type: "error",
        autoClose: 2000,
      });
    }
  };

  return (
    <div
      className="card m-2 card-website bg-dark bg-gradient  text-white "
      key={link.id}
      onClick={() => navigate(`/edit/${link.id}`)}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h4>{link.name}</h4>
          <button
            className="btn btn-danger btn-sm d-flex bg-gradient align-items-center"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteLink(link.id);
            }}
          >
            <i className="material-icons">
              <FontAwesomeIcon icon={faTrashCan} />
            </i>
          </button>
        </div>
        <p>{link.description}</p>
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          Go to Website
        </a>
      </div>
    </div>
  );
}
