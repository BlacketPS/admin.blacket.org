import { Resource } from "blacket-types";

import { ViewProps } from "./index.d";

import styles from "./styles/view.module.scss";

export default function Titles({ resources }: ViewProps) {
    return (
        <div className={styles.resourceGroupWrapper}>
            <h1>Title Listing</h1>
            <div className={styles.divider} />
        </div>
    );
}
