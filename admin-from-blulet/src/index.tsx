import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthRequired } from "./components/AuthRequired";
import ErrorPage from "./components/ErrorPage";
import routes from "./routes";

import "./index.scss";

const router = createBrowserRouter([
    {
        id: "root",
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <GoogleOAuthProvider clientId="23798758865-m57a4oc5ah2gfm1fog62e9r26edh637l.apps.googleusercontent.com"><routes.Home /></GoogleOAuthProvider>
            },
            {
                path: "/login",
                element: <GoogleOAuthProvider clientId="23798758865-m57a4oc5ah2gfm1fog62e9r26edh637l.apps.googleusercontent.com"><routes.Home /></GoogleOAuthProvider>
            },
            {
                path: "/logout",
                element: <routes.Logout />
            },
            {
                path: "/dashboard",
                element: <AuthRequired><routes.Dashboard /></AuthRequired>
            },
            {
                path: "/user-manager",
                element: <AuthRequired><routes.UserManager /></AuthRequired>
            },
            {
                path: "/pack-manager",
                element: <AuthRequired><routes.PackManager /></AuthRequired>
            },
            {
                path: "/blue-creator",
                element: <AuthRequired><routes.BlueCreator /></AuthRequired>
            },
            {
                path: "/pack-creator",
                element: <AuthRequired><routes.PackCreator /></AuthRequired>
            }
        ]
    }
]);

createRoot(document.getElementById("root") as HTMLElement).render(<RouterProvider router={router} />);