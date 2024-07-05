import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResourceIdToPath } from "@functions/index";
import styles from "../packs.module.scss";

import { PackProps } from "../packs.d";

export default function Pack({ pack, moveable, onClick }: PackProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: pack.id,
        disabled: !moveable
    });

    return (
        <div className={styles.packContainer} data-moveable={moveable} style={{
            background: `radial-gradient(circle, ${pack.innerColor} 0%, ${pack.outerColor} 100%)`,
            transform: CSS.Transform.toString(transform),
            transition: transition ?? undefined
        }} onClick={onClick} ref={setNodeRef} {...attributes} {...listeners}>
            <div className={styles.packImageContainer}>
                <img src={useResourceIdToPath(pack.imageId)} draggable={false} />
            </div>

            <div className={styles.packTop}>
                {pack.id}
            </div>

            <div className={styles.packBottom}>
                <img src="https://cdn.blacket.org/static/content/token.png" draggable={false} />
                {pack.price}
            </div>
        </div>
    );
}
