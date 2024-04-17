import { ReactNode } from "react";
import styles from "./regularBodyComponent.module.scss";

export default function RegularBody({ children }: { children: ReactNode }) {
    return <div className={styles.regularBody}>{children}</div>;
}
