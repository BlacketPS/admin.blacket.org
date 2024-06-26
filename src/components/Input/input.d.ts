import { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: string;
    containerProps?: React.HTMLProps<HTMLDivElement>;
}
