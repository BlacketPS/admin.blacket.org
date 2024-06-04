import { Resource, StaffAdminCreateResourceDto, StaffAdminUpdateResourceDto } from "blacket-types";

export interface ResourceModalProps {
    resource?: Resource;
    onCreate?: (dto: StaffAdminCreateResourceDto) => Promise;
    onUpdate?: (id: number, dto: StaffAdminUpdateResourceDto) => Promise;
    onDelete?: (id: number) => Promise;
}
