import React, { useEffect, useState } from "react";
import LinkForm from "./LinkForm";
import { db } from "../firebase"; // Importa modulo firebase
import { toast } from "react-toastify";

const Links = () => {
  const [links, setLinks] = useState([]); // Iniciar state con array vacio
  const [currentId, setCurrentId] = useState(""); // Iniciar state con string vacio
  // Función para agregar un site (POST)
  const addAndEdit = async (linkObject) => {
    console.log(linkObject); // Muestra un objeto con los valores typeados en cada input (eventualmente se enviaran a la db)
    // Si el state currentId es vacio, entonces guarda el documento, de lo contrario se actualizara
    if (currentId === "") {
      // Query, Desde la db, crea una colección llamada 'links', guarda un documento nuevo(coloca id) y guarda los datos pasados en el form
      await db
        .collection("links")
        .doc()
        .set(linkObject)
        .then(function () {
          // Con .then avisa cuando sea exitoso
          toast("Page successfully Created!", {
            type: "success",
          });
          console.log("Document successfully written!");
        });
    } else {
      // Query, de la colección links, busca el documento por el state 'currentId' y actualizalo por el objeto pasado en el form
      await db.collection('links').doc(currentId).update(linkObject)
      .then(function () {
        // Con .then avisa cuando sea exitoso
        toast("Page successfully updated!", {
          type: "info",
        });
        setCurrentId(''); // resetear el estado 'currentId'
    })
  };
}
  // Función para eliminar un documento
  const onDeleteLink = async (id) => {
    if (window.confirm("Confirm to delete this Web Site!")) {
      console.log(id); // id del documento en especifico a eliminar
      // Query, de la colección 'links' del documento con el id indicado, eliminalo
      await db
        .collection("links")
        .doc(id)
        .delete()
        .then(function () {
          toast("Page successfully Deleted!", {
            type: "error",
            autoClose: 2000,
          });
          console.log("Document successfully deleted!");
        });
    }
  };

  const getLinks = async () => {
    // Query para capturar toda la data de una colección, querySnapshot se ejecuta cada vez que la data cambié
    db.collection("links").onSnapshot((querySnapshot) => {
      const docs = []; // Iniciar array vacio para incluir tanto la data de cada doc, como su id (vienen separados)

      querySnapshot.forEach((doc) => {
        // Por cada data encontrada realiza...
        // console.log(doc.data());
        // console.log(doc.id)
        docs.push({ ...doc.data(), id: doc.id }); // Combinar la data y el id de cada doc y guardarlo en el array
      });
      console.log(docs); // Muestra un array con los objetos/docs creados
      setLinks(docs); // Enviarle la data al state
    });
  };

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <div className="d-flex">
      <div className="col-md-auto p-2">
        {/* Envia el state actual de currentId, links y la función addAndEdit */}
        <LinkForm {...{ addAndEdit, currentId, links }}></LinkForm>
      </div>
      <div className="col-md-12 p-2">
        {/* Mapea el state de links, para cada elm* crea su tarjeta y agregale sus datos en base a su mapeo */}
        {links.map((link) => (
          <div className="card mb-1" key={link.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4>{link.name}</h4>
                <div>
                  <i
                    className="material-icons text-danger"
                    onClick={() => {
                      onDeleteLink(link.id);
                    }}
                  >
                    close
                  </i>
                  <i
                    className="material-icons"
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

/* 
https://test.com
*/
