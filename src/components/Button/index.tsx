import styles from "./button.module.scss";

import { ButtonProps } from "./button.d";

export default function Button({ children, type = "button", icon, ...props }: ButtonProps) {
    return (
        <button className={styles.button} type={type} {...props}>
            {icon && <i className={icon} />}
            {children}
        </button>
    );
}
