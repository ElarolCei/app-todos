import {useParams} from '@remix-run/react';
import {useEffect, useRef} from 'react';

export function links() {
    return [{ rel: "stylesheet", href: "/styles/main.css" }];
}

export default function EditItem() {
    const {id, userId} = useParams();
    const textAreaRef = useRef();

    useEffect(() => {
        async function loadItem() {
            const response = await fetch(`/users/${userId}/items/${id}`);
            if (response.ok) {
                const item = response.json().then(body => {
                    textAreaRef.current.value = body.name
                });
            } else {
                window.location.href = `/main/${userId}`;
            }
        }
        loadItem();
    }, []);

    async function updateItem() {
        const datos = {
            id: id,
            userId: userId,
            name: textAreaRef.current.value,
        };

        const response = await fetch(`/users/${userId}/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            window.location.href = `/main/${userId}`;
        }
    }

    return (
        <div>
            <h1>Editar tarea</h1>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    updateItem();
                }}
            >
                <label>Introduce la nueva tarea:</label>
                <div>
                    <textarea ref={textAreaRef} cols='30' rows='10'></textarea>
                </div>
                <input type='submit' value='Actualizar'/>
            </form>
        </div>
    );
}
