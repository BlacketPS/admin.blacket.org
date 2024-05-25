import { Link } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import styles from "./headerComponent.module.scss";

import logo from "@assets/logo.png";

export default function Header() {
    const { user } = useUser();

    return (
        <div className={styles.navHeader}>
            <Link to={user ? "/dashboard" : "/"} className={styles.homeLink}>
                <img className={styles.logo} src={logo} alt="Blacket Logo" />

                <div>{import.meta.env.VITE_NAME} Admin</div>
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
