import { HTMLAttributes } from "react";

import { Resource } from "blacket-types";

export interface ResourcePickerProps extends HTMLAttributes< HTMLDivElement > {
    onPick: (resource: Resource) => void;
    allowedTypes?: string[];
}
