import {useRef} from "react";

export function Login() {

    const userRef = useRef();
    const passwordRef = useRef();
    async function validate() {
        const data = {
            username: userRef.current.value,
            password: passwordRef.current.value,
        };
        console.log('Credentials: ' + JSON.stringify(data));
        // TODO validar contra el backend, guardar cookie en sesion, proteger rutas
        /*
        if (await callBackend(data)) {
            window.location.href = "/main";
        }
        */
        window.location.href = "/main";
    }

    async function callBackend(data) {
        const response = await fetch(`/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.ok;
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
            </form>
        </div>
    );
}