import styles from "@styles/all.module.scss";

export default function Loader() {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.loaderInside}>
                <div className={styles.loader}>
                    <div className={styles.loaderBox}>
                        <img src="https://media.blulet.org/admin/loader.svg" className={styles.loaderBlue} alt="Blue" draggable="false" />
                    </div>
                    <div className={styles.shadow} />
                </div>
            </div>
        </div>
    );
};