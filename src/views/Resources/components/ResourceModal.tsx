import { useState } from "react";
import { Modal, Form, Input, ErrorContainer, Button } from "@components/index";
import { useModal } from "@stores/ModalStore";
import styles from "../resources.module.scss";

import { ResourceModalProps } from "../resources.d";

export default function UpdateOrDeleteResourceModal({ resource, onCreate, onUpdate, onDelete }: ResourceModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [path, setPath] = useState<string>(resource?.path || "");

    const { closeModal } = useModal();

    const submitForm = (mode: string) => {
        if (path.length < 1) return setError("Please enter a path.");

        switch (mode) {
            case "create":
                setLoading(true);
                onCreate?.({ path })
                    .then(closeModal)
                    .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                    .finally(() => setLoading(false));
                break;
            case "update":
                if (!resource?.id) return setError("Resource ID not found.");

                setLoading(true);
                onUpdate?.(resource.id, { path })
                    .then(closeModal)
                    .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                    .finally(() => setLoading(false));
                break;
            case "delete":
                if (path !== "delete") return setError("Are you sure you want to delete this resource? Type \"delete\" in the file path field to confirm.");
                if (!resource?.id) return setError("Resource ID not found.");

                setLoading(true);
                onDelete?.(resource.id)
                    .then(closeModal)
                    .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                    .finally(() => setLoading(false));
        }
    };

    return (
        <>
            <Modal.ModalHeader>{onCreate ? "Create" : "Update"} Resource</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out the fields below.</Modal.ModalBody>

            <Form onSubmit={submitForm}>
                <Input
                    icon="fas fa-file"
                    placeholder="File Path"
                    value={path}
                    onClick={() => setError("")}
                    onChange={(e) => setPath(e.target.value)}
                />

                <div className={styles.addResourceModalImageContainer}>
                    {["jpeg", "jpg", "png", "gif", "webp"].includes(path.split(".").pop()?.toLowerCase() ?? "") ? <img
                        src={path}
                        onError={(e) => e.currentTarget.style.visibility = "hidden"}
                        onLoad={(e) => e.currentTarget.style.visibility = "visible"}
                    /> : <i className="fas fa-file" />}
                </div>

                {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

                <Modal.ModalButtonContainer loading={loading}>
                    {onCreate && <Button type="submit" onClick={() => submitForm("create")}>Create</Button>}
                    {onUpdate && <Button type="submit" onClick={() => submitForm("update")}>Update</Button>}
                    {onDelete && <Button onClick={() => submitForm("delete")}>Delete</Button>}
                    <Button onClick={closeModal}>Cancel</Button>
                </Modal.ModalButtonContainer>
            </Form>
        </>
    );
}
