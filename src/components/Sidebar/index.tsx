import { useLocation, Link } from "react-router-dom";
import useUser from "@stores/UserStore";

import styles from "./sidebarComponent.module.scss";

export interface SidebarPage {
    name: string;
    icon: string;
    path: string;
}

const pages: SidebarPage[] = [
    { name: "Dashboard", icon: "fas fa-home", path: "/dashboard" }
];

export default function Sidebar() {
    const location = useLocation().pathname.split("/")[1];

    const { user } = useUser();

    if (user) return (
        <div className={styles.sidebar}>
            {pages.map((page, index) => <Link to={page.path} key={index} data-selected={location === page.path.split("/")[1]} className={styles.page}>
                <i className={`${styles.pageIcon} ${page.icon}`} />

                <div className={styles.pageText}>{page.name}</div>
            </Link>)}
        </div>
    );
}
