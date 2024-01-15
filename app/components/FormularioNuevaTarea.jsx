import { useRef, useState } from "react";

export function FormularioNuevaTarea({ cargarTareas }) {
  const inputRef = useRef();
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();

    const options = {
      method: "POST",
      body: JSON.stringify({
        tarea: inputRef.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch("/tareas", options);
    if (response.ok) {
      inputRef.current.value = "";
      cargarTareas();
    } else {
      const error = await response.text();
      setError(error);
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label htmlFor="nuevaTarea">Añadir tarea:</label>
        <input ref={inputRef} type="text" id="nuevaTarea" />
        <input type="submit" value="Crear" />
      </form>
      <p id="errores" style={{ color: "red" }}>
        {error}
      </p>
    </div>
  );
}
