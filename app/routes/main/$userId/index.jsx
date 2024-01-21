import {useParams} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {CreateItem} from '../../../components/CreateItem';
import {ItemList} from '../../../components/ItemList';

export function links() {
    return [{ rel: "stylesheet", href: "/styles/main.css" }];
}

export default function Main() {

    const {userId} = useParams();
    const [user, setUser] = useState([]);

    function loadUser() {
        fetch(`/users/${userId}`)
            .then((response) => response.json())
            .then((data) => setUser(data));
    }

    useEffect(() => {
        const userData = localStorage ? localStorage.getItem('user-data') : null;
        if (userData) {
            setUser(JSON.parse(userData));
        }
        loadUser();
    }, []);

    return (
        <div className="titulo-form">
            <h2 className="text-xl font-bold">{"Bienvenid@"} {user.username}</h2>
            <CreateItem user={user} loadUser={loadUser}/>
            <ItemList user={user} loadUser={loadUser}/>
        </div>
    );
}
