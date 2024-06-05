import { HTMLAttributes } from "react";

import { Pack } from "blacket-types";

export interface PackPickerProps extends HTMLAttributes<HTMLDivElement> {
    onPick: (pack: Pack | null) => void;
}
