import { PropsWithChildren, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

type Auth = {
    loggedIn: boolean;
    token: string;
} | null;

export const useAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await axios.get("/api/v1/users/verify-token", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 200) {
        return {
            loggedIn: true,
            token
        };
    }

    return null;
};

export const AuthRequired = (props: PropsWithChildren) => {
    const [auth, setAuth] = useState<Auth>(null);

    useEffect(() => {
        const getAuth = async () => {
            const auth = await useAuth();
            setAuth(auth);
        };

        getAuth();
    }, []);

    if (!auth) return null;
    if (!auth.loggedIn) return <Navigate to="/login" />;

    return props.children;
};