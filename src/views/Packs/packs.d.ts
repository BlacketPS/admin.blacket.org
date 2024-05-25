import { HTMLAttributes } from "react";

export interface PackProps extends HTMLAttributes<HTMLDivElement> {
    pack: any;
}

export interface CreatePackModalProps {
    onClick?: () => void;
}
