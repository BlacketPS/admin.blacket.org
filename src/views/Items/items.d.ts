import { HTMLAttributes } from "react";
import { Item, StaffAdminCreateItemDto, StaffAdminUpdateItemDto } from "blacket-types";

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
    item: Item;
    moveable: boolean;
}

export interface ItemModalProps {
    item?: Item;
    onCreate?: (dto: StaffAdminCreateItemDto) => Promise;
    onUpdate?: (id: number, dto: StaffAdminUpdateItemDto) => Promise;
    onDelete?: (id: number) => Promise;
}
