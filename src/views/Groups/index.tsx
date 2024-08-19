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
import { useGroup } from "@stores/GroupStore/index";
import { Group, GroupModal } from "./components/index";
import styles from "./groups.module.scss";

import { Group as GroupType, StaffAdminCreateGroupDto, StaffAdminUpdateGroupDto } from "blacket-types";

export default function Groups() {
    const [editMode, setEditMode] = useState<boolean>(true);

    const { createModal } = useModal();
    const { groups, setGroups } = useGroup();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = groups.findIndex((group) => group.id === active.id);
            const newIndex = groups.findIndex((group) => group.id === over.id);

            const newGroups = arrayMove(groups, oldIndex, newIndex);
            newGroups.forEach((group, index) => group.priority = index + 1);

            setGroups(newGroups);

            window.fetch2.put("/api/staff/admin/groups/update-priorities", { groupMap: newGroups.map((group) => ({ groupId: group.id, priority: group.priority })) });
        }
    };

    const createGroup = (dto: StaffAdminCreateGroupDto) => new Promise((resolve, reject) => {
        window.fetch2.post("/api/staff/admin/groups", dto)
            .then((res: Fetch2Response) => {
                setGroups([...groups, res.data]);

                resolve(res);
            })
            .catch(reject);
    });

    const updateGroup = (id: number, dto: StaffAdminUpdateGroupDto) => new Promise((resolve, reject) => {
        window.fetch2.put(`/api/staff/admin/groups/${id}`, dto)
            .then((res: Fetch2Response) => {
                const group = { ...groups.find((group) => group.id === id), ...dto };

                const newGroups = groups.map((i) => i.id === id ? group : i) as GroupType[];

                setGroups(newGroups);

                resolve(res);
            })
            .catch(reject);
    });

    const deleteGroup = (id: number) => new Promise((resolve, reject) => {
        window.fetch2.delete(`/api/staff/admin/groups/${id}`, {})
            .then((res: Fetch2Response) => {
                setGroups(groups.filter((group) => group.id !== id));

                resolve(res);
            })
            .catch(reject);
    });

    return (
        <>
            <h1>Group Manager</h1>

            <ButtonRow>
                <Button
                    icon="fas fa-plus"
                    onClick={() => createModal(<GroupModal onCreate={createGroup} />)}
                >
                    Create Group
                </Button>

                <Button
                    onClick={() => setEditMode(!editMode)}
                >
                    Mode: {editMode ? "Edit" : "Move"}
                </Button>
            </ButtonRow>

            <div className={styles.groupsWrapper}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={groups.map((group) => group.id)}
                    >
                        {groups.map((group) => {
                            return (
                                <Group
                                    key={group.id}
                                    group={group}
                                    moveable={!editMode}
                                    onClick={() => createModal(<GroupModal group={group} onUpdate={updateGroup} onDelete={deleteGroup} />)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();

                                        createModal(<GroupModal group={group} onCreate={createGroup} />);
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
