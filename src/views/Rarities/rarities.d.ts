import { Rarity, StaffAdminCreateRarityDto, StaffAdminUpdateRarityDto } from "blacket-types";

export interface RarityModalProps {
    rarity?: Rarity;
    onCreate?: (dto: StaffAdminCreateRarityDto) => Promise;
    onUpdate?: (id: number, dto: StaffAdminUpdateRarityDto) => Promise;
    onDelete?: (id: number) => Promise;
}
