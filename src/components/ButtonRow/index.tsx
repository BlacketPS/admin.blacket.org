import styles from "./buttonRow.module.scss";

import { ButtonRowProps } from "./buttonRow.d";

export default function ButtonRow({ children, ...props }: ButtonRowProps) {
    return <div className={styles.buttonRow} {...props}>{children}</div>;
}
