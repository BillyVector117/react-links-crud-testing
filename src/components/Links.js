import React, { useEffect, useState } from "react";
import LinkForm from "./LinkForm";
import { db } from "../firebase";
import { toast } from "react-toastify"; // Messages library

const Links = () => {
  const [links, setLinks] = useState([]); // full data (from database)
  const [currentId, setCurrentId] = useState(""); // Allows to edit a link

  // ADD or EDIT a single document (POST)
  const addAndEdit = async (linkObject) => {
    // console.log(linkObject); // Contains an object with typed values
    // if 'currentId' is empty, is a request to ADD a document, else means a UPDATE document
    if (currentId === "") {
      // Query, creates 'links' collection mounting the Object link info )FireStore provides a random ID for each document
      await db
        .collection("links")
        .doc() // Random ID
        .set(linkObject)
        .then(function () {
          // Success case: toast-message
          toast("successfully Added!", {
            type: "success",
          });
          // console.log("Document successfully stored!");
        });
    } else {
      // Query, Search the clicked document by ID and update with new info
      await db
        .collection("links")
        .doc(currentId) // Here is searching the clicked document (edit-Icon)
        .update(linkObject)
        .then(function () {
          toast("Page successfully updated!", {
            type: "info",
          });
          setCurrentId(""); // clean 'currentID' state
        });
    }
  };

  // DELETE a document
  const onDeleteLink = async (id) => {
    if (window.confirm("Confirm to delete this Web Site!")) {
      console.log(id); // This document (ID) will delete
      await db
        .collection("links")
        .doc(id)
        .delete()
        .then(function () {
          toast("Page successfully deleted!", {
            type: "error",
            autoClose: 2000,
          });
          console.log("Document successfully deleted!");
        });
    }
  };

  // GET/READ data from database (real time)
  const getLinks = async () => {
    // Query to get data in real time
    db.collection("links").onSnapshot((querySnapshot) => {
      const docs = []; // Final array with 'id' for each document

      querySnapshot.forEach((doc) => {
        // console.log("Snapshot doc: ", doc); // No visible data
        // console.log("Snapshot doc.data(): ", doc.data()); // All data-info (Object)
        // console.log("Snapshot doc.id(): ", doc.id); // Capture automathic document's ID (Provided by FireStore)
        docs.push({ ...doc.data(), id: doc.id }); // mix data adding data-id at 'docs' array
      });
      // console.log('All documents: ', docs);
      setLinks(docs); // mount data to 'links' state
    });
  };

  // Execute getLink() first time and every change
  useEffect(() => {
    getLinks();
  }, []);

  return (
    <div className="d-flex">
      <div className="col-md-auto p-2">
        {/* Send addAndEdit(), currentId (In case edit) and 'links' state (contains all documents from database) to link-Form  */}
        <LinkForm {...{ addAndEdit, currentId, links }}></LinkForm>
      </div>
      <div className="col-md-12 p-2">
        {/* store 'links' state (data provided from database) */}
        {links.map((link) => (
          <div className="card mb-1" key={link.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4>{link.name}</h4>
                <div>
                  <i
                    className="material-icons text-danger p-2 icono"
                    onClick={() => {
                      onDeleteLink(link.id);
                    }}
                  >
                    close
                  </i>
                  <i
                    className="material-icons p-2 icono"
                    onClick={() => {
                      setCurrentId(link.id);
                    }}
                  >
                    create
                  </i>
                </div>
              </div>
              <p>{link.description}</p>
              <a href={link.url} target="_blank" rel="noreferrer">
                Go to Website
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Links;
