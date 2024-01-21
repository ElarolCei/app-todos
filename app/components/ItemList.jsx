import {Link} from "@remix-run/react";
import {useState} from "react";

export function ItemList({user, loadUser}) {
    const [error, setError] = useState();

    async function deleteItem(itemId) {
        const options = {
            method: "DELETE",
        };
        const response = await fetch(`/users/${user.id}/items/${itemId}`, options);
        if (response.ok) {
            loadUser();
        } else {
            setError(itemId);
        }
    }

    const style = {
        border: "red 3px solid",
        borderRadius: "3px",
    };

    return user && user.items ? (
        <ol>
            {user.items.map((item, index) => (
                <li key={index} style={error === index ? style : {}}>
                    {item.name}
                    <button onClick={() => deleteItem(item.id)}>X</button>
                    <Link to={`/main/${user.id}/edit-item/${item.id}`}>Editar</Link>
                </li>
            ))}
        </ol>
    ) : (
        <h2>Cargando...</h2>
    );
}
