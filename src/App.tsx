import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import StoreWrapper from "./stores";

import { Home } from "./views";

import "./all.scss";

const router = createBrowserRouter([{
    id: "app",
    errorElement: <h1 className="somethingWentWrong">Something went wrong</h1>,
    children: [
        { id: "*", path: "*", element: <Navigate to="/" /> },
        { id: "home", path: "/", element: <Home /> }
    ]
}]);

export default function App() {
    return (
        <StoreWrapper>
            <RouterProvider router={router} />
        </StoreWrapper>
    );
}
