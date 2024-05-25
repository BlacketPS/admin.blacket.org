import { ReactNode } from "react";
import styles from "./insideContainerComponent.module.scss";

export default function InsideContainer({ children }: { children: ReactNode }) {
    return <div className={styles.insideContainer}>{children}</div>;
}
