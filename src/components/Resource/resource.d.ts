import { HTMLAttributes } from "react";

import { Resource } from "blacket-types";

export interface ResourceProps extends HTMLAttributes<HTMLDivElement> {
    resource: Resource;
    hideGroup?: boolean;
    fit?: boolean;
}
