import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Home } from "./views";

import "./all.scss";

const router = createBrowserRouter([
    {
        id: "app",
        children: [
            { id: "*", path: "*", element: <Navigate to="/" /> },
            { id: "home", path: "/", element: <Home /> }
        ]
    }
]);

export default function App() {
    return <RouterProvider router={router} />;
}
