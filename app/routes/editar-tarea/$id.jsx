import { useParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

export default function EditarTarea() {
  const { id } = useParams();
  const textAreaRef = useRef();

  useEffect(() => {
    async function cargarTarea() {
      const response = await fetch(`http://localhost:3000/tareas/${id}`);
      if (response.ok) {
        const tarea = response.json().then(body => {
          textAreaRef.current.value = body.name
        });
      } else {
        window.location.href = "/main";
      }
    }
    cargarTarea();
  }, []);

  async function actualizarTarea() {
    const datos = {
      id: id,
      userId: '1',
      name: textAreaRef.current.value,
    };

    const response = await fetch(`http://localhost:3000/tareas/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      window.location.href = "/main";
    }
  }

  return (
    <div>
      <h1>Editar tarea</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          actualizarTarea();
        }}
      >
        <label>Introduce la nueva tarea:</label>
        <div>
          <textarea ref={textAreaRef} cols="30" rows="10"></textarea>
        </div>
        <input type="submit" value="Actualizar" />
      </form>
    </div>
  );
}
