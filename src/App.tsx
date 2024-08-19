import { createBrowserRouter, Navigate, RouterProvider, Outlet } from "react-router-dom";
import StoreWrapper from "./stores";

import { Home, Dashboard, Resources, Rarities, Packs, Blooks, Items } from "./views";

import { Header, InsideContainer, RegularBody, Sidebar } from "./components";

import "./all.scss";
import Groups from "./views/Groups";

const router = createBrowserRouter([{
    id: "app",
    errorElement: <h1 className="somethingWentWrong">Something went wrong</h1>,
    element: <StoreWrapper>
        <Header />

        <RegularBody>
            <Sidebar />

            <InsideContainer>
                <Outlet />
            </InsideContainer>
        </RegularBody>
    </StoreWrapper>,
    children: [
        { id: "*", path: "*", element: <Dashboard fromInvalidPage /> },
        { id: "home", path: "/", element: <Home /> },
        { id: "dashboard", path: "/dashboard", element: <Dashboard /> },
        { id: "resources", path: "/resources", element: <Resources /> },
        { id: "groups", path: "/groups", element: <Groups /> },
        { id: "rarities", path: "/rarities", element: <Rarities /> },
        { id: "packs", path: "/packs", element: <Packs /> },
        { id: "blooks", path: "/blooks", element: <Blooks /> },
        { id: "items", path: "/items", element: <Items /> }
    ]
}]);

export default function App() {
    return <RouterProvider router={router} />;
}
