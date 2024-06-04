import { HTMLAttributes } from "react";

import { Pack, StaffAdminCreatePackDto, StaffAdminUpdatePackDto } from "blacket-types";

export interface PackProps extends HTMLAttributes<HTMLDivElement> {
    pack: Pack;
    moveable: boolean;
}

export interface PackModalProps {
    pack?: Pack;
    onCreate?: (dto: StaffAdminCreatePackDto) => Promise;
    onUpdate?: (id: number, dto: StaffAdminUpdatePackDto) => Promise;
    onDelete?: (id: number) => Promise;
}
