import { Link } from "@remix-run/react";
import { useState } from "react";

export function ListaTareas({ tareas, cargarTareas }) {
  const [error, setError] = useState();

  async function borrarTarea(tareaId) {
    const options = {
      method: "DELETE",
    };
    const response = await fetch(`http://localhost:3000/tareas/${tareaId}`, options);

    if (response.ok) {
      cargarTareas();
    } else {
      setError(tareaId);
    }
  }

  const style = {
    border: "red 3px solid",
    borderRadius: "3px",
  };

  return (
    <ol>
      {tareas.map((tarea, index) => (
        <li key={index} style={error === index ? style : {}}>
          {tarea.name}
          <button onClick={() => borrarTarea(tarea.id)}>X</button>
          <Link to={`/editar-tarea/${tarea.id}`}>Editar</Link>
        </li>
      ))}
    </ol>
  );
}
