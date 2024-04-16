import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        id: "app",
        children: [
            {
                id: "home",
                path: "/",
                element: <div>Blooket</div>
            }
        ]
    }
]);

export default function App() {
    return <RouterProvider router={router} />;
}
