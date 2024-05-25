import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../packs.module.scss";

import { PackProps } from "../packs.d";

export default function Pack({ pack, onClick }: PackProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: pack.id
    });

    return (
        <div className={styles.packContainer} style={{
            background: `radial-gradient(circle, ${pack.innerColor} 0%, ${pack.outerColor} 100%)`,
            transform: CSS.Transform.toString(transform),
            transition: transition ?? undefined
        }} onClick={onClick} ref={setNodeRef} {...attributes} {...listeners}>
            <div className={styles.packImageContainer}>
                <img src={`https://rewrite.blacket.org${pack.image}`} draggable={false} />
            </div>

            <div className={styles.packTop}>
                {pack.priority}
            </div>

            <div className={styles.packBottom}>
                <img src="https://rewrite.blacket.org/content/token.png" draggable={false} />
                {pack.price}
            </div>
        </div>
    );
}
