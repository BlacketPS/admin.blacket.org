import styles from "../blooks.module.scss";

import { BlookPackCategoryProps } from "../blooks.d";

export default function BlookPackCategory({ pack, children }: BlookPackCategoryProps) {
    return (
        <div className={styles.blookPackCategoryHolder}>
            <div className={styles.blookPackCategoryTitle}>{pack?.name ?? "Miscellaneous"} Pack</div>
            <div className={styles.blookPackCategoryDivider} />
            <div className={styles.blookPackCategoryBlookHolder}>
                {children}
            </div>
        </div>
    );
}
