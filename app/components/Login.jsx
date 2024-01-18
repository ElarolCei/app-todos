import {useRef, useState} from "react";

export function Login() {

    const userRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState();

    async function validate() {
        const data = {
            username: userRef.current.value,
            password: passwordRef.current.value,
        };
        console.log('Credentials: ' + JSON.stringify(data));
        fetch(`http://localhost:3000/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            if (res.status === 200) {
                res.json().then(({id}) => {
                    window.location.href = "/main";
                });
            } else {
                setError("Usuario o contraseña incorrectos.");
            }
        }).catch(err => {
            setError(err);
        })
    }

    return (
        <div>
            <form onSubmit={(event) => {
                event.preventDefault();
                validate();
            }}>
                <label htmlFor="user">Usuario</label>
                <input type="text" id="user" ref={userRef}/>
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" ref={passwordRef}/>
                <input type="submit" value="Login"/>
                {error && <p className="text-red-600">{error}</p>}
            </form>
        </div>
    );
}