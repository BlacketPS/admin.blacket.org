import { HTMLAttributes } from "react";

import { Resource } from "blacket-types";

export interface ViewProps extends HTMLAttributes<HTMLDivElement> {
    resources: Resource[];
}
