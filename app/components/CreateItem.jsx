import {useRef, useState} from "react";

export function CreateItem({user, loadUser}) {
    const inputRef = useRef();
    const [error, setError] = useState("");

    async function submit(event) {
        event.preventDefault();

        const options = {
            method: "POST",
            body: JSON.stringify({
                name: inputRef.current.value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(`/users/${user.id}/items`, options);
        if (response.ok) {
            inputRef.current.value = "";
            loadUser();
        } else {
            const error = await response.text();
            setError(error);
        }
    }

    return (
        <div className="form-tarea">
            <form  onSubmit={submit}>
                <label htmlFor="nuevaTarea">Añade una nueva tarea:</label>
                <input ref={inputRef} type="text" id="nuevaTarea"/>
                <input type="submit" value="Crear nueva tarea"/>
            </form>
            <p id="errores" style={{color: "red"}}>
                {error}
            </p>
        </div>
    );
}
