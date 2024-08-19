import { Button, Dropdown, ErrorContainer, Form, ImageOrVideo, Input, Modal, ResourcePicker, Toggle } from "@components/index";
import { PermissionType, Resource } from "blacket-types";
import { useEffect, useState } from "react";

import { GroupModalProps } from "../groups.d";
import { useModal } from "@stores/ModalStore/index";
import { useResource } from "@stores/ResourceStore/index";

import styles from "../groups.module.scss";

export default function GroupModal({ group, onCreate, onUpdate, onDelete }: GroupModalProps) {
    const { resources } = useResource();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>(group?.name || "");
    const [description, setDescription] = useState<string>(group?.description || "");
    const [imageResource, setImageResource] = useState<Resource | null>(null);
    const [permissions, setPermissions] = useState<PermissionType[]>(group?.permissions || []);

    const { closeModal } = useModal();

    useEffect(() => {
        if (group) setImageResource(resources.find((resource) => resource.id === group.imageId) || null);
    }, [group, resources]);

    const submitForm = (mode: "create" | "update" | "delete") => {
        if (name.length < 1) return setError("Please enter a name.");

        switch (mode) {
            case "create":
                setLoading(true);
                onCreate?.({ name, description, imageId: imageResource?.id, permissions })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "update":
                setLoading(true);
                if (group) onUpdate?.(group.id, { name, description, imageId: imageResource?.id, permissions })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "delete":
                if (name !== "delete") return setError("Are you sure you want to delete this group? Type \"delete\" in the name field to confirm.");

                setLoading(true);
                if (group) onDelete?.(group.id)
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
        }
    };

    return (
        <>
            <Modal.ModalHeader>{onCreate ? "Create" : "Update"} Group</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out the fields below.</Modal.ModalBody>

            <Form onSubmit={submitForm}>
                <Input icon="fas fa-tag"
                    placeholder="Name"
                    value={name}
                    onClick={() => setError("")}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input icon="fas fa-pencil"
                    placeholder="Description"
                    value={description}
                    onClick={() => setError("")}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <ResourcePicker
                    onPick={(resource) => setImageResource(resource)}
                    allowedTypes={["png", "jpg", "jpeg", "gif", "webp", "mp4", "webm"]}
                >
                    Image Resource: {imageResource ? <>[{imageResource.id}] <ImageOrVideo src={imageResource.path} /></> : "None"}
                </ResourcePicker>

                <div className={styles.permissionsArrayContainer}>
                    <div className={styles.permissionsArray}>
                        {Object.keys(PermissionType)
                            .filter((key) => isNaN(Number(key)))
                            .map((type) => {
                                const permission = PermissionType[type as keyof typeof PermissionType];

                                return <Toggle
                                    key={permission}
                                    checked={permissions.includes(permission)}
                                    onClick={() => {
                                        if (permissions.includes(permission)) setPermissions(permissions.filter((p) => p !== permission));
                                        else setPermissions([...permissions, permission]);
                                    }}
                                >
                                    {type}
                                </Toggle>;
                            })}
                    </div>
                </div>

                <Modal.ModalButtonContainer>
                    <Button
                        icon="fas fa-times"
                        onClick={() => setImageResource(null)}
                    >
                        Reset Image
                    </Button>
                </Modal.ModalButtonContainer>

                {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

                <Modal.ModalButtonContainer loading={loading}>
                    {onCreate && <Button type="submit" onClick={() => submitForm("create")}>Create</Button>}
                    {onUpdate && <Button type="submit" onClick={() => submitForm("update")}>Update</Button>}
                    {onDelete && <Button type="submit" onClick={() => submitForm("delete")}>Delete</Button>}
                    <Button onClick={closeModal}>Cancel</Button>
                </Modal.ModalButtonContainer>
            </Form>
        </>
    );
}
