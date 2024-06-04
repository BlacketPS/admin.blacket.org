import { Resource as ResourceType } from "blacket-types";

import { ViewProps } from "./index.d";
import Resource from "@components/Resource";

import styles from "./styles/view.module.scss";

function isOfGroup(resource: ResourceType, group: string) {
    return resource.path?.split("/")[2] === group;
}

export default function Banners({ resources }: ViewProps) {
    return (
        <div className={styles.resourceGroupWrapper}>
            <h1>Banner Listing</h1>
            <div className={styles.divider} />
            {resources.filter((x) => isOfGroup(x, "banners")).map((resource) => (
                <Resource key={resource.id} resource={resource} />
            ))}
        </div>
    );
}
