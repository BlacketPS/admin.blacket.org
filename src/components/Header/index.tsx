import { Link } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import styles from "./headerComponent.module.scss";

export default function Header() {
    const { user } = useUser();

    return (
        <div className={styles.navHeader}>
            <Link to={user ? "/dashboard" : "/"} className={styles.homeLink}>
                <img className={styles.logo} src="https://cdn.blacket.org/static/content/logo.png" alt="Blacket Logo" />

                <div><span className={styles.title}>{import.meta.env.VITE_NAME}</span> <div className={styles.pipe} /> Admin</div>
            </Link>

            {user && <div className={styles.rightSide}>
                <div className={styles.button} onClick={() => {
                    localStorage.removeItem("token");

                    window.location.href = "/";
                }}>
                    <i className="fas fa-sign-out-alt" />
                </div>
            </div>}
        </div>
    );
}
