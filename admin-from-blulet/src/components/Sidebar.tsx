import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faShop, faShoppingBasket, faBriefcase, faCashRegister } from "@fortawesome/free-solid-svg-icons";
import styles from "@styles/all.module.scss";

export default function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Link to="/dashboard" className={`${styles.row} ${window.location.pathname === "/dashboard" ? styles.selected : ""}`}>
                <FontAwesomeIcon icon={faHome} className={styles.icon} />
                Dashboard
            </Link>
            <Link to="/user-manager" className={`${styles.row} ${window.location.pathname === "/user-manager" ? styles.selected : ""}`}>
                <FontAwesomeIcon icon={faUser} className={styles.icon} />
                User Manager
            </Link>
            <Link to="/blue-manager" className={`${styles.row} ${window.location.pathname === "/blue-manager" ? styles.selected : ""}`}>
                <FontAwesomeIcon icon={faBriefcase} className={styles.icon} />
                Blue Manager
            </Link>
            <Link to="/pack-manager" className={`${styles.row} ${window.location.pathname === "/pack-manager" ? styles.selected : ""}`}>
                <FontAwesomeIcon icon={faShoppingBasket} className={styles.icon} />
                Pack Manager
            </Link>
            <Link to="/blue-creator" className={`${styles.row} ${window.location.pathname === "/blue-creator" ? styles.selected : ""}`}>
                <FontAwesomeIcon icon={faCashRegister} className={styles.icon} />
                Blue Creator
            </Link>
            <Link to="/pack-creator" className={`${styles.row} ${window.location.pathname === "/pack-creator" ? styles.selected : ""}`}>
                <FontAwesomeIcon icon={faShop} className={styles.icon} />
                Pack Creator
            </Link>
        </div>
    );
};
