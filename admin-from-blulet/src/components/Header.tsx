import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "@styles/all.module.scss";

export default function Header() {
    return (
        <>
            <div className={styles.navHeader}>
                <Link to="/" className={styles.homeLink}>
                    <img className={styles.logo} src="https://media.blulet.org/admin/logo.png" alt="Blulet" />
                    <div>Admin</div>
                </Link>
                <div className={styles.rightSide}>
                    <Link to="/login" className={styles.button}>
                        <FontAwesomeIcon icon={faHome} />
                    </Link>
                    <Link to="/logout" className={styles.button}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </Link>
                </div>
            </div>
        </>
    );
};