import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

// props receives addAndEdit(), currentId (In case edit) and 'links' state (contains all documents from database) from 'links' component
const LinkForm = (props) => {
  const initialStateValues = {
    url: "",
    name: "",
    description: "",
  };

  const [values, setValues] = useState(initialStateValues);

  const handleInputChange = (event) => {
    // Extract 'name-input' (Link & Web-Site name) and its value
    const { name, value } = event.target;
    // Update 'values' state
    setValues({ ...values, [name]: value }); // Copy 'values' state, adding typed value at 'name' key
  };

  // Save a single document (id necessary)
  const getLinkById = async (id) => {
    const docs = await db.collection("links").doc(id).get();
    // console.log(docs.data())
    setValues({ ...docs.data() }); // To set info data into Input-placeholders, then execute handleSubmit() when submit
  };

  // Regular expression to check URL values
  const validateURL = (str) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      str
    );
  };

  useEffect(() => {
    try {
      // Is Adding/creating a document if 'currentId' is empty
      if (props.currentId === "") {
        setValues({ ...initialStateValues }); // Empty values
      } else {
        // In case edit
        // console.log(props.currentId); // Document/link ID (Provided by FireStore)
        getLinkById(props.currentId); // getLinkById() find the clicked editing-document
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.currentId]); // Execute this Effect every 'currentID' changed

  // Input submit
  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate URL
    if (!validateURL(values.url)) {
      // Fail case:
      return toast("Invalid URL, Try again  :(", {
        type: "warning",
      });
    }
    props.addAndEdit(values);
    // Once addAndEdit() is finished, clean input-values
    setValues({ ...initialStateValues });
  };
  return (
    <div className="container ml-auto">
      <form className="card card-body" onSubmit={handleSubmit}>
        <div className="form-group input-group">
          <div className="input-group-text bg-light">
            <i className="material-icons">insert_link</i>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="https://somelink.com"
            name="url"
            onChange={handleInputChange}
            value={values.url}
          />
        </div>
        <div className="form-group input-group">
          <div className="input-group-text bg-light">
            <i className="material-icons">create</i>
          </div>
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Write Web site name"
            onChange={handleInputChange}
            value={values.name}
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            name="description"
            rows="2"
            placeholder="Write a description"
            onChange={handleInputChange}
            value={values.description}
          ></textarea>
        </div>
        <button className="btn btn-primary btn-block">
          {/* Validate 'currentId' state */}
          {props.currentId === "" ? "Save" : "Update"}
        </button>
      </form>
    </div>
  );
};

export default LinkForm;
