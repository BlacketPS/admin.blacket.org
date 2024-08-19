import { useLocation, Link } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import styles from "./sidebarComponent.module.scss";

import { SidebarPage } from "./sidebar.d";

const pages: SidebarPage[] = [
    { name: "Dashboard", icon: "fas fa-home", path: "/dashboard" },
    { name: "Audit Log", icon: "fas fa-clipboard-list", path: "/audit-log" },
    { name: "Users", icon: "fas fa-user", path: "/users" },
    { name: "Messages", icon: "fas fa-comment", path: "/messages" },
    { name: "Resources", icon: "fas fa-image", path: "/resources" },
    { name: "Groups", icon: "fas fa-users", path: "/groups" },
    { name: "Chat Rooms", icon: "fas fa-door-open", path: "/chat-rooms" },
    { name: "Rarities", icon: "fas fa-sparkles", path: "/rarities" },
    { name: "Packs", icon: "fas fa-square", path: "/packs" },
    { name: "Blooks", icon: "fas fa-suitcase", path: "/blooks" },
    { name: "Items", icon: "fas fa-gem", path: "/items" },
    { name: "Market", icon: "fas fa-store", path: "/market" },
    { name: "Cosmetics", icon: "fas fa-paint-brush", path: "/cosmetics" }
];

export default function Sidebar() {
    const location = useLocation().pathname.split("/")[1];

    const { user } = useUser();

    if (user) return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarItems}>
                    {pages.map((page, index) => <Link to={page.path} key={index} data-selected={location === page.path.split("/")[1]} className={styles.page}>
                        <i className={`${styles.pageIcon} ${page.icon}`} />

                        <div style={{ fontSize: page.fontSize ?? "" }} className={styles.pageText}>{page.name}</div>
                    </Link>)}
                </div>
            </div>
        </div>
    );
}
