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

        const response = await fetch(`http://localhost:3000/users/${user.id}/items`, options);
        if (response.ok) {
            inputRef.current.value = "";
            loadUser();
        } else {
            const error = await response.text();
            setError(error);
        }
    }

    return (
        <div>
            <form onSubmit={submit}>
                <label htmlFor="nuevaTarea">Añadir item:</label>
                <input ref={inputRef} type="text" id="nuevaTarea"/>
                <input type="submit" value="Crear"/>
            </form>
            <p id="errores" style={{color: "red"}}>
                {error}
            </p>
        </div>
    );
}
