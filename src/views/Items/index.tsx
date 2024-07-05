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
import { ButtonRow, Button } from "@components/index";
import { useModal } from "@stores/ModalStore/index";
import { useItem } from "@stores/ItemStore/index";
import { ItemModal, Item } from "./components/index";
import styles from "./items.module.scss";

import { Item as ItemType, StaffAdminCreateItemDto, StaffAdminUpdateItemDto } from "blacket-types";

export default function Items() {
    const [editMode, setEditMode] = useState<boolean>(true);

    const { createModal } = useModal();
    const { items, setItems } = useItem();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            newItems.forEach((item, index) => item.priority = index + 1);

            setItems(newItems);

            window.fetch2.put("/api/staff/admin/items/update-priorities", { itemMap: newItems.map((item) => ({ itemId: item.id, priority: item.priority })) });
        }
    };

    const createItem = (dto: StaffAdminCreateItemDto) => new Promise((resolve, reject) => {
        window.fetch2.post("/api/staff/admin/items", dto)
            .then((res: Fetch2Response) => {
                setItems([...items, res.data]);

                resolve(res);
            })
            .catch(reject);
    });

    const updateItem = (id: number, dto: StaffAdminUpdateItemDto) => new Promise((resolve, reject) => {
        window.fetch2.put(`/api/staff/admin/items/${id}`, dto)
            .then((res: Fetch2Response) => {
                const item = { ...items.find((item) => item.id === id), ...dto };

                const newItems = items.map((i) => i.id === id ? item : i) as ItemType[];

                setItems(newItems);

                resolve(res);
            })
            .catch(reject);
    });

    const deleteItem = (id: number) => new Promise((resolve, reject) => {
        window.fetch2.delete(`/api/staff/admin/items/${id}`, {})
            .then((res: Fetch2Response) => {
                setItems(items.filter((item) => item.id !== id));

                resolve(res);
            })
            .catch(reject);
    });

    return (
        <>
            <h1>Item Manager</h1>

            <ButtonRow>
                <Button
                    icon="fas fa-plus"
                    onClick={() => createModal(<ItemModal onCreate={createItem} />)}
                >
                    Create Item
                </Button>

                <Button
                    onClick={() => setEditMode(!editMode)}
                >
                    Mode: {editMode ? "Edit" : "Move"}
                </Button>
            </ButtonRow>

            <div className={styles.itemsWrapper}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map((item) => item.id)}
                    >
                        {items.map((item) => {
                            return (
                                <Item
                                    key={item.id}
                                    item={item}
                                    moveable={!editMode}
                                    onClick={() => createModal(<ItemModal item={item} onUpdate={updateItem} onDelete={deleteItem} />)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();

                                        createModal(<ItemModal item={item} onCreate={createItem} />);
                                    }}
                                />
                            );
                        })}
                    </SortableContext>
                </DndContext>
            </div>
        </>
    );
}
