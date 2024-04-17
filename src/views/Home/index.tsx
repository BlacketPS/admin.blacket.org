import { Navigate } from "react-router-dom";
import useUser from "@stores/UserStore/index";

import styles from "./home.module.scss";

export default function Home() {
    const { user } = useUser();

    if (user) return <Navigate to="/dashboard" />;

    return (
        <div className={styles.container}>
            <div className={styles.message}>
                You must be authorized to access this page.
            </div>
        </div>
    );
}
