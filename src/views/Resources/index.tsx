import { useEffect, useState } from "react";

import { Loader } from "@components/index";
import { Resource } from "./components/index";
import styles from "./resources.module.scss";

import { Resource as ResourceType } from "blacket-types";

export default function Resources() {
    const [loading, setLoading] = useState<boolean>(true);
    const [resources, setResources] = useState<ResourceType[]>([]);

    useEffect(() => {
        window.fetch2.get("/api/staff/resources")
            .then((res: Fetch2Response) => {
                setResources(res.data);

                setLoading(false);
            });
    }, []);

    return (
        <>
            <h1>Resource Manager</h1>

            {!loading ? <>
                <div className={styles.resourcesWrapper}>
                    <div className={styles.resourceContainer}>
                        <i className="fas fa-plus" />
                        <div>Add Resource</div>
                    </div>

                    {resources.map((resource: ResourceType) => (
                        <Resource key={resource.id} resource={resource} />
                    ))}
                </div>
            </> : <Loader />}
        </>
    );
}
