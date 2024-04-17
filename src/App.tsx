import { createBrowserRouter, Navigate, RouterProvider, Outlet } from "react-router-dom";
import StoreWrapper from "./stores";

import { Home } from "./views";

import { Header, RegularBody, Sidebar } from "./components";

import "./all.scss";

const router = createBrowserRouter([{
    id: "app",
    errorElement: <h1 className="somethingWentWrong">Something went wrong</h1>,
    element: <StoreWrapper>
        <Header />

        <RegularBody>
            <Sidebar />

            <Outlet />
        </RegularBody>
    </StoreWrapper>,
    children: [
        { id: "*", path: "*", element: <Navigate to="/" /> },
        { id: "home", path: "/", element: <Home /> },
        { id: "dashboard", path: "/dashboard", element: <h1>Dashboard</h1> }
    ]
}]);

export default function App() {
    return <RouterProvider router={router} />;
}
