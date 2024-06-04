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
import { ButtonRow, Button } from "@components/index";
import { Pack, CreatePackModal } from "./components/index";
import styles from "./packs.module.scss";

import { StaffAdminCreatePackDto, StaffAdminUpdatePackDto, Pack as PackType } from "blacket-types";

export default function Packs() {
    const [editMode, setEditMode] = useState<boolean>(true);

    const { createModal } = useModal();
    const { packs, setPacks } = usePack();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = packs.findIndex((pack) => pack.id === active.id);
            const newIndex = packs.findIndex((pack) => pack.id === over.id);

            const newPacks = arrayMove(packs, oldIndex, newIndex);
            newPacks.forEach((pack, index) => pack.priority = index + 1);

            setPacks(newPacks);

            window.fetch2.put("/api/staff/admin/packs/update-priorities", { packMap: newPacks.map((pack) => ({ packId: pack.id, priority: pack.priority })) });
        }
    };

    const createPack = (pack: StaffAdminCreatePackDto) => new Promise((resolve, reject) => {
        window.fetch2.post("/api/staff/admin/packs", pack)
            .then((res) => {
                setPacks([...packs, res.data]);
                resolve(res);
            })
            .catch((err) => reject(err));
    });

    const updatePack = (id: number, dto: StaffAdminUpdatePackDto) => new Promise((resolve, reject) => {
        window.fetch2.put(`/api/staff/admin/packs/${id}`, dto)
            .then((res) => {
                const pack = { ...packs.find((pack) => pack.id === id), ...dto };

                const newPacks = packs.map((p) => p.id === id ? pack : p) as PackType[];

                setPacks(newPacks);
                resolve(res);
            })
            .catch((err) => reject(err));
    });

    const deletePack = (id: number) => new Promise((resolve, reject) => {
        window.fetch2.delete(`/api/staff/admin/packs/${id}`, {})
            .then((res) => {
                setPacks(packs.filter((pack) => pack.id !== id));
                resolve(res);
            })
            .catch((err) => reject(err));
    });

    return (
        <>
            <h1>Pack Manager</h1>

            <ButtonRow>
                <Button icon="fas fa-plus" onClick={() => createModal(<CreatePackModal onCreate={createPack} />)}>Create Pack</Button>
                <Button onClick={() => setEditMode(!editMode)}>Mode: {editMode ? "Edit" : "Move"}</Button>
            </ButtonRow>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={!editMode ? packs.map((pack) => pack.id) : []}
                >
                    <div className={styles.packsWrapper}>
                        {packs.map((pack) => <Pack
                            key={pack.id}
                            pack={pack}
                            moveable={!editMode}
                            onClick={() => {
                                if (!editMode) return;

                                createModal(<CreatePackModal onUpdate={updatePack} onDelete={deletePack} pack={pack} />);
                            }}
                        />)}
                    </div>
                </SortableContext>
            </DndContext>
        </>
    );
}
