import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResourceIdToPath } from "@functions/index";
import { ImageOrVideo } from "@components/index";
import styles from "../groups.module.scss";

import { GroupProps } from "../groups.d";

export default function Group({ group, moveable, ...props }: GroupProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: group.id,
        disabled: !moveable
    });

    return (
        <div className={styles.groupContainer} data-moveable={moveable} style={{
            transform: CSS.Transform.toString(transform),
            transition
        }} ref={setNodeRef} {...attributes} {...listeners} {...props}>
            {group.id}
            <ImageOrVideo
                src={useResourceIdToPath(group.imageId)}
                draggable={false}
                alt={group.name}
                onError={(e) => e.currentTarget.style.visibility = "hidden"}
            />
            {group.name}
        </div>
    );
}
