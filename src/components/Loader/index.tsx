import styles from "./loader.module.scss";

import { LoaderProps } from "./loader.d";

export default function Loader({ ...props }: LoaderProps) {
    return (
        <div className={styles.loaderContainer} {...props}>
            <div className={styles.loader} />
        </div>
    );
}
