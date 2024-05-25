import { HTMLAttributes, ReactNode } from "react";

export interface GenericModalProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
