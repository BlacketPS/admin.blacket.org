import { DashboardProps } from "./dashboard.d";
import { Link } from "react-router-dom";
import styles from "./dashboard.module.scss";

export default function Dashboard({ fromInvalidPage }: DashboardProps) {
    return (
        <>
            {fromInvalidPage ? (
                <div className={styles.fromInvalidPagePrompt}>
                    <span className={styles.fromInvalidPagePromptTag}>
                        <i className="fas fa-exclamation-triangle" />
                    </span>
                    <span className={styles.fromInvalidPagePromptText}>Couldn't find that page. <span className={styles.inlineDivider} /> to the <Link to="/">Dashboard</Link>!</span>
                </div>
            ) : (
                <h1>Dashboard</h1>
            )}
        </>
    );
}
