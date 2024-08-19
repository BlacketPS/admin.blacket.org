import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResourceIdToPath } from "@functions/index";
import { ImageOrVideo } from "@components/index";
import styles from "../items.module.scss";

import { ItemProps } from "../items.d";

export default function Item({ item, moveable, ...props }: ItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: item.id,
        disabled: !moveable
    });

    return (
        <div className={styles.itemContainer} data-moveable={moveable} style={{
            transform: CSS.Transform.toString(transform),
            transition
        }} ref={setNodeRef} {...attributes} {...listeners} {...props}>
            {item.id}
            <ImageOrVideo src={useResourceIdToPath(item.imageId)} draggable={false} alt={item.name} />
            {item.name}
        </div>
    );
}
