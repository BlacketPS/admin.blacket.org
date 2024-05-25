import { FormEvent } from "react";

import { FormProps } from "./form.d";

export default function Form({ children, onSubmit, ...props }: FormProps) {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (onSubmit) onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} {...props}>
            {children}
        </form>
    );
}
