import { HTMLAttributes } from "react";
import { Group, StaffAdminCreateGroupDto, StaffAdminUpdateGroupDto } from "blacket-types";

export interface GroupProps extends HTMLAttributes<HTMLDivElement> {
    group: Group;
    moveable: boolean;
}

export interface GroupModalProps {
    group?: Group;
    onCreate?: (dto: StaffAdminCreateGroupDto) => Promise;
    onUpdate?: (id: number, dto: StaffAdminUpdateGroupDto) => Promise;
    onDelete?: (id: number) => Promise;
}
