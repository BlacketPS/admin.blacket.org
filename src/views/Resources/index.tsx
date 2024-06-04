import { ButtonRow, Button, Resource } from "@components/index";
import { ResourceModal } from "./components/index";
import { useModal } from "@stores/ModalStore/index";
import { useResource } from "@stores/ResourceStore/index";
import styles from "./resources.module.scss";

import { StaffAdminCreateResourceDto, StaffAdminUpdateResourceDto, Resource as ResourceType } from "blacket-types";

export default function Resources() {
    const { createModal } = useModal();
    const { resources, setResources } = useResource();

    const createResource = (dto: StaffAdminCreateResourceDto) => new Promise((resolve, reject) => {
        window.fetch2.post("/api/staff/admin/resources", dto)
            .then((res: Fetch2Response) => {
                setResources([...resources, res.data]);

                resolve(res);
            })
            .catch(reject);
    });

    const updateResource = (id: number, dto: StaffAdminUpdateResourceDto) => new Promise((resolve, reject) => {
        window.fetch2.put(`/api/staff/admin/resources/${id}`, dto)
            .then((res: Fetch2Response) => {
                const resource = { ...resources.find((resource) => resource.id === id), ...dto };

                const newResources = resources.map((r) => r.id === id ? resource : r) as ResourceType[];

                setResources(newResources);
                resolve(res);
            })
            .catch(reject);
    });

    const deleteResource = (id: number) => new Promise((resolve, reject) => {
        window.fetch2.delete(`/api/staff/admin/resources/${id}`, {})
            .then((res: Fetch2Response) => {
                setResources(resources.filter((resource) => resource.id !== id));

                resolve(res);
            })
            .catch(reject);
    });

    return (
        <>
            <h1>Resource Manager</h1>

            <div className={styles.resourcesWrapper}>
                <ButtonRow>
                    <Button
                        icon="fas fa-plus"
                        onClick={() => createModal(<ResourceModal onCreate={createResource} />)}>
                        Create Resource
                    </Button>
                </ButtonRow>

                <div className={styles.resourcesContainer}>
                    {resources.map((resource) => (
                        <Resource
                            key={resource.id}
                            resource={resource}
                            onClick={() => createModal(<ResourceModal resource={resource} onUpdate={updateResource} onDelete={deleteResource} />)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
