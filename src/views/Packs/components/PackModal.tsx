import { useEffect, useState } from "react";
import { Modal, Form, Input, ColorPicker, ResourcePicker, Toggle, ErrorContainer, Button } from "@components/index";
import { useModal } from "@stores/ModalStore/index";
import { useResource } from "@stores/ResourceStore/index";

import { PackModalProps } from "../packs.d";
import { Resource } from "blacket-types";

export default function CreatePackModal({ pack, onCreate, onUpdate, onDelete }: PackModalProps) {
    const { resources } = useResource();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>(pack?.name || "");
    const [price, setPrice] = useState<string>(pack?.price.toString() || "");
    const [innerColor, setInnerColor] = useState<string>(pack?.innerColor || "#ffffff");
    const [outerColor, setOuterColor] = useState<string>(pack?.outerColor || "#000000");
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [enabled, setEnabled] = useState<boolean>(pack?.enabled || false);

    const { closeModal } = useModal();

    useEffect(() => {
        if (pack) setSelectedResource(resources.find((resource) => resource.id === pack.imageId) || null);
    }, [pack, resources]);

    const submitForm = (mode: "create" | "update" | "delete") => {
        switch (mode) {
            case "create":
                if (name.length < 1) return setError("Please enter a name.");
                if (price.length < 1) return setError("Please enter a price.");
                if (!selectedResource) return setError("Please select a resource.");

                setLoading(true);
                onCreate?.({ name, price: parseFloat(price), innerColor, outerColor, imageId: selectedResource.id, enabled })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "update":
                if (name.length < 1) return setError("Please enter a name.");
                if (price.length < 1) return setError("Please enter a price.");
                if (!selectedResource) return setError("Please select a resource.");

                setLoading(true);
                if (pack) onUpdate?.(pack.id, { name, price: parseFloat(price), innerColor, outerColor, imageId: selectedResource.id, enabled })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "delete":
                if (name !== "delete") return setError("Are you sure you want to delete this pack? Type \"delete\" in the name field to confirm.");

                setLoading(true);
                if (pack) onDelete?.(pack.id)
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
        }
    };

    return (
        <>
            <Modal.ModalHeader>{onCreate ? "Create" : "Update"} Pack</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out the fields below.</Modal.ModalBody>

            <Form onSubmit={submitForm}>
                <Input icon="fas fa-tag"
                    placeholder="Name"
                    value={name}
                    onClick={() => setError("")}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input icon="fas fa-dollar-sign"
                    placeholder="Price"
                    value={price}
                    onClick={() => setError("")}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.match(/^-?\d*\.?\d{0,2}$/)) setPrice(value);
                    }}
                />

                <ColorPicker initialColor={innerColor} onPick={(color) => setInnerColor(color)}>
                    Inner Color
                </ColorPicker>

                <ColorPicker initialColor={outerColor} onPick={(color) => setOuterColor(color)}>
                    Outer Color
                </ColorPicker>

                <ResourcePicker
                    onPick={(resource) => setSelectedResource(resource)}
                    allowedTypes={["png", "jpg", "jpeg", "gif", "webp"]}
                >
                    Pack Image: {selectedResource ? <>[{selectedResource.id}] <img src={selectedResource.path} /></> : "None"}
                </ResourcePicker>

                <Toggle onClick={() => setEnabled(!enabled)} checked={enabled}>
                    Enabled
                </Toggle>

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
