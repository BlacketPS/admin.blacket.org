import { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useModal } from "@stores/ModalStore/index";
import { Loader, Modal } from "@components/index";
import { Pack, CreatePackModal } from "./components/index";
import styles from "./packs.module.scss";

export default function Packs() {
    const [loading, setLoading] = useState<boolean>(true);
    const [packs, setPacks] = useState<any[]>([]);

    const { createModal } = useModal();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    useEffect(() => {
        window.fetch2.get("/api/data/packs")
            .then((res: Fetch2Response) => {
                setPacks(res.data);

                setLoading(false);
            });
    }, []);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) setPacks((packs) => {
            const oldIndex = packs.findIndex((pack: any) => pack.id === active.id);
            const newIndex = packs.findIndex((pack: any) => pack.id === over.id);

            const newPacks = arrayMove(packs, oldIndex, newIndex);

            newPacks.forEach((pack, index) => pack.priority = index + 1);

            return newPacks;
        });
    };

    return (
        <>
            <h1>Pack Manager</h1>

            {!loading ? <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={packs.map((pack: any) => pack.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className={styles.packsWrapper}>
                        {packs.map((pack: any) => (
                            <Pack key={pack.id} pack={pack} />
                        ))}

                        <div className={styles.addPackContainer} onClick={() => createModal(<CreatePackModal />)}>
                            <i className="fas fa-plus" />
                        </div>
                    </div>
                </SortableContext>
            </DndContext> : <Loader />}
        </>
    );
}
