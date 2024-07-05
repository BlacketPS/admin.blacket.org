import { useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { ButtonRow, Button } from "@components/index";

import styles from "./home.module.scss";

export default function Home() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) return;

        localStorage.setItem("token", token);

        window.location.href = "/dashboard";
    }, [token]);

    const { user } = useUser();

    if (user) return <Navigate to="/dashboard" />;

    if (!token) return (
        <div className={styles.container}>
            <div className={styles.message}>
                You must be authorized to access this page.

                <ButtonRow>
                    <Button onClick={() => window.location.href = "https://dev.blacket.org/settings/admin-handover"}>Authorize</Button>
                </ButtonRow>
            </div>
        </div>
    );
    else return (
        <div className={styles.container}>
            <div className={styles.message}>
                Authorizing...
            </div>
        </div>
    );
}
