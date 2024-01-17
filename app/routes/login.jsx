import {Login} from "../components/Login";

export function links() {
    return [{ rel: "stylesheet", href: "/styles/main.css" }];
}

export default function Index() {
  return (
      <div>
        <Login></Login>
      </div>
  );
}
