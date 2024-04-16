import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

import logo from "../../assets/logo.png";

export default function Header() {
    return (
        <div className={styles.navHeader}>
            <Link to="/" className={styles.homeLink}>
                <img className={styles.logo} src={logo} alt="Blacket Logo" />

                <div>Admin</div>
            </Link>
            <div className={styles.rightSide}>
                <Link to="/login" className={styles.button}>
                    <i className="fas fa-home" />
                </Link>

                <Link to="/logout" className={styles.button}>
                    <i className="fas fa-sign-out-alt" />
                </Link>
            </div>
        </div>
    );
}
