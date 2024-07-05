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
import { Blook, StaffAdminCreateBlookDto, StaffAdminUpdateBlookDto } from "blacket-types";

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

            const newBlooks = arrayMove(blooks, oldIndex, newIndex);
            newBlooks.forEach((blook, index) => blook.priority = index);

            setBlooks(newBlooks);

            window.fetch2.put("/api/staff/admin/blooks/update-priorities", { blookMap: newBlooks.map((blook) => ({ blookId: blook.id, priority: blook.priority })) });
        }
    };

    const createBlook = (dto: StaffAdminCreateBlookDto) => new Promise((resolve, reject) => {
        window.fetch2.post("/api/staff/admin/blooks", dto)
            .then((res: Fetch2Response) => {
                setBlooks([...blooks, res.data]);

                resolve(res);
            })
            .catch(reject);
    });

    const updateBlook = (id: number, dto: StaffAdminUpdateBlookDto) => new Promise((resolve, reject) => {
        window.fetch2.put(`/api/staff/admin/blooks/${id}`, dto)
            .then((res: Fetch2Response) => {
                const blook = { ...blooks.find((blook) => blook.id === id), ...dto };

                const newBlooks = blooks.map((b) => b.id === id ? blook : b) as Blook[];

                setBlooks(newBlooks);
                resolve(res);
            })
            .catch(reject);
    });

    const deleteBlook = (id: number) => new Promise((resolve, reject) => {
        window.fetch2.delete(`/api/staff/admin/blooks/${id}`, {})
            .then((res: Fetch2Response) => {
                setBlooks(blooks.filter((blook) => blook.id !== id));

                resolve(res);
            })
            .catch(reject);
    });

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
                                onContextMenu={(e) => {
                                    e.preventDefault();

                                    createModal(<BlookModal blook={blook} onCreate={createBlook} />);
                                }}
                            />)}
                            {blooks.filter((blook) => blook.packId === pack.id).length === 0 && <div className={styles.noBlooks}>No blooks are in this pack.</div>}
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
                            {blooks.filter((blook) => !blook.packId && blook.name !== "Default").length === 0 && <div className={styles.noBlooks}>No blooks are in this pack.</div>}
                        </SortableContext>
                    </BlookPackCategory>
                </div>
            </DndContext >
        </>
    );
}
