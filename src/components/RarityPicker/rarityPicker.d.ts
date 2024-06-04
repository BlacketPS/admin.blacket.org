import { HTMLAttributes } from "react";

import { Rarity } from "blacket-types";

export interface RarityPickerProps extends HTMLAttributes<HTMLDivElement> {
    onPick: (rarity: Rarity) => void;
}
