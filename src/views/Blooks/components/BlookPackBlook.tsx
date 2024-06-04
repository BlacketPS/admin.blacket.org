import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResourceIdToPath } from "@functions/index";
import styles from "../blooks.module.scss";

import { BlookPackBlookProps } from "../blooks.d";

export default function BlookPackBlook({ blook, moveable, ...props }: BlookPackBlookProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: blook.id,
        disabled: !moveable
    });

    return (
        <li className={styles.blookPackBlookHolder} style={{
            transform: CSS.Transform.toString(transform),
            transition: transition ?? undefined
        }} ref={setNodeRef} data-moveable={moveable} {...attributes} {...listeners} {...props}>
            <p>{blook.id}</p>
            <img src={useResourceIdToPath(blook.imageId)} draggable={false} />
        </li>
    );
}
