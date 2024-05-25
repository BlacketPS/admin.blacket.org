import styles from "./input.module.scss";

import { InputProps } from "./input.d";

export default function Input({ icon, ...props }: InputProps) {
    return (
        <div className={styles.inputContainer}>
            {icon && <i className={icon} />}
            <input data-icon={icon ? true : false} {...props} />
        </div>
    );
}
