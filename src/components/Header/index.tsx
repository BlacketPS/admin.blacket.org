import { Link } from "react-router-dom";
import useUser from "@stores/UserStore";
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
                <Link to="/logout" className={styles.button}>
                    <i className="fas fa-sign-out-alt" />
                </Link>
            </div>}
        </div>
    );
}
