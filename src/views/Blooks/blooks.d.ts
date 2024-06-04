import { HTMLAttributes } from "react";

import { Blook, Pack, StaffAdminCreateBlookDto, StaffAdminUpdateBlookDto } from "blacket-types";

export interface PackProps extends HTMLAttributes<HTMLDivElement> {
    pack: Pack;
}

export interface BlookPackCategoryProps extends HTMLAttributes<HTMLDivElement> {
    pack: Pack | null;
}

export interface BlookPackBlookProps extends HTMLAttributes<HTMLLIElement> {
    blook: Blook;
    moveable: boolean;
}

export interface BlookModalProps {
    blook?: Blook;
    onCreate?: (dto: StaffAdminCreateBlookDto) => Promise;
    onUpdate?: (id: number, dto: StaffAdminUpdateBlookDto) => Promise;
    onDelete?: (id: number) => Promise;
}
