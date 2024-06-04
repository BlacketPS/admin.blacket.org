import { useState } from "react";
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
    sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { useModal } from "@stores/ModalStore/index";
import { usePack } from "@stores/PackStore/index";
import { useBlook } from "@stores/BlookStore/index";
import { ButtonRow, Button } from "@components/index";
import { BlookModal, BlookPackCategory, BlookPackBlook } from "./components/index";
import styles from "./blooks.module.scss";

export default function Blooks() {
    const [editMode, setEditMode] = useState<boolean>(true);

    const { createModal } = useModal();
    const { packs } = usePack();
    const { blooks, setBlooks } = useBlook();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        const activeBlook = blooks.find((blook) => blook.id === active.id);
        const overBlook = blooks.find((blook) => blook.id === over.id);

        if (activeBlook?.packId !== overBlook?.packId) return;

        if (active.id !== over.id) {
            const oldIndex = blooks.findIndex((blook) => blook.id === active.id);
            const newIndex = blooks.findIndex((blook) => blook.id === over.id);

            const newBlooks = arrayMove(blooks.filter((blook) => blook.packId === blooks[oldIndex].packId), oldIndex, newIndex);
            newBlooks.forEach((blook, index) => blook.priority = index);

            setBlooks(newBlooks);

            window.fetch2.put("/api/staff/admin/blooks/update-priorities", { blookMap: newBlooks.map((blook) => ({ blookId: blook.id, priority: blook.priority })) });
        }
    };

    const createBlook = (blook: any) => {
    };

    const updateBlook = (id: number, blook: any) => {
    };

    const deleteBlook = (id: number) => {
    };

    return (
        <>
            <h1>Blook Manager</h1>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className={styles.blooksWrapper}>
                    <ButtonRow>
                        <Button icon="fas fa-plus" onClick={() => createModal(<BlookModal onCreate={createBlook} />)}>
                            Create Blook
                        </Button>

                        <Button onClick={() => setEditMode(!editMode)}>
                            Mode: {editMode ? "Edit" : "Move"}
                        </Button>
                    </ButtonRow>

                    {packs.map((pack) => <BlookPackCategory pack={pack}>
                        <SortableContext items={!editMode ? blooks.filter((blook) => blook.packId === pack.id).map((blook) => blook.id) : []}>
                            {blooks.filter((blook) => blook.packId === pack.id).map((blook) => <BlookPackBlook
                                key={blook.id}
                                blook={blook}
                                moveable={!editMode}
                                onClick={() => createModal(<BlookModal blook={blook} onUpdate={updateBlook} onDelete={deleteBlook} />)}
                            />)}
                        </SortableContext>
                    </BlookPackCategory>)}

                    <BlookPackCategory pack={null}>
                        <SortableContext items={!editMode ? blooks.filter((blook) => !blook.packId && blook.name !== "Default").map((blook) => blook.id) : []}>
                            {blooks.filter((blook) => !blook.packId && blook.name !== "Default").map((blook) => <BlookPackBlook
                                key={blook.id}
                                blook={blook}
                                moveable={!editMode}
                                onClick={() => createModal(<BlookModal blook={blook} onUpdate={updateBlook} onDelete={deleteBlook} />)}
                            />)}
                        </SortableContext>
                    </BlookPackCategory>
                </div>
            </DndContext >
        </>
    );
}
