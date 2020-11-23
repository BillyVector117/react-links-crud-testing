import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
const LinkForm = (props) => {
  const initialStateValues = {
    url: "",
    name: "",
    description: "",
  };

  const [values, setValues] = useState(initialStateValues);

  const handleInputChange = (e) => {
    // Muestra el name del input y el valor que se ha typeado (ES6 destructuración de objetos (del e.target))
    const { name, value } = e.target;
    // console.log(name, value); Muestra cada typeo que se hace en cualquier input
    // Cambia del initial state (Actualizar datos)
    setValues({ ...values, [name]: value }); // Cópia el valor actual (...values) y agrega en la propiedad 'name' (name de cada input) su valor typeado('value')
  };

  const getLinkById = async (id) => {
    const docs = await db.collection("links").doc(id).get(); // Query, de la colección 'links' busca el document que tenga el id indicado y capturalo
    // console.log(docs.data())
    setValues({ ...docs.data() });
  };

  // Función para validar las URL typeadas del form
  const validateURL = (str) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      str
    );
  };

  useEffect(() => {
    try {
      // Si el state de currentId esta vacio, significa que esta GUARDANDO, no actualizando
      if (props.currentId === "") {
        setValues({ ...initialStateValues }); // Inicia los valores de los inputs en vacio
      } else {
        // Si tiene un id guardado (seleccionó editar)
        console.log(props.currentId);
        getLinkById(props.currentId); // Función obtiene los datos relacionados con esa nota (sus inputs)
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.currentId]); // inicia el useEffect con el state currentId

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita submit automatico
    if (!validateURL(values.url)) {
      return toast("Invalid URL :(", {
        type: "warning",
      });
    }
    props.addAndEdit(values); // Ejecuta función al dar submit, viene de props.
    setValues({ ...initialStateValues }); // Regresa al estado inicial los valores de los inputs  (reset)
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
            placeholder="https://nothing.com"
            name="url"
            onChange={handleInputChange}
            value={values.url} // Tiene como valor el estado inicial (vacio o con datos cargados)
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
            value={values.name} // Tiene como valor el estado inicial (vacio o con datos cargados)
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            name="description"
            rows="2"
            placeholder="Write a description"
            onChange={handleInputChange}
            value={values.description} // Tiene como valor el estado inicial (vacio o con datos cargados)
          ></textarea>
        </div>
        <button className="btn btn-primary btn-block">
          {/* Si el state de currentId es vacio, inserta Save, de lo contrario inserta Update */}
          {props.currentId === "" ? "Save" : "Update"}
        </button>
      </form>
    </div>
  );
};

export default LinkForm;
