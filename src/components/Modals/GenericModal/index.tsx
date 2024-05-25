import styles from "./genericModal.module.scss";

import { GenericModalProps } from "./genericModal.d";

export default function GenericModal({ children }: GenericModalProps) {
    return (
        <div className={styles.modal}>
            <div className={styles.content}>
                <div className={styles.container}>
                    {children}
                </div>
            </div>
        </div>
    );
}
