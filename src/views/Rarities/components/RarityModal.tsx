import { useState } from "react";
import { Modal, Form, Input, ColorPicker, ResourcePicker, Toggle, ErrorContainer, Button } from "@components/index";
import { useModal } from "@stores/ModalStore/index";

import { RarityModalProps } from "../rarities.d";

export default function RarityModal({ rarity, onCreate, onUpdate, onDelete }: RarityModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>(rarity?.name || "");
    const [color, setColor] = useState<string>(rarity?.color || "#ffffff");
    const [animationType, setAnimationType] = useState<1 | 2 | 3 | 4 | 5 | 6>(rarity?.animationType || 1);
    const [experience, setExperience] = useState<string>(rarity?.experience.toString() || "");

    const { closeModal } = useModal();

    const submitForm = (mode: "create" | "update" | "delete") => {
        switch (mode) {
            case "create":
                if (name.length < 1) return setError("Please enter a name.");

                setLoading(true);
                onCreate?.({ name, color, animationType, experience: parseInt(experience) })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "update":
                if (name.length < 1) return setError("Please enter a name.");

                setLoading(true);
                if (rarity) onUpdate?.(rarity.id, { name, color, animationType, experience: parseInt(experience) })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "delete":
                if (name !== "delete") return setError("Are you sure you want to delete this rarity? Type \"delete\" in the name field to confirm.");

                setLoading(true);
                if (rarity) onDelete?.(rarity.id)
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
        }
    };

    return (
        <>
            <Modal.ModalHeader>{onCreate ? "Create" : "Update"} Rarity</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out the fields below.</Modal.ModalBody>

            <Form onSubmit={submitForm}>
                <Input icon="fas fa-tag"
                    placeholder="Name"
                    value={name}
                    onClick={() => setError("")}
                    onChange={(e) => setName(e.target.value)}
                />

                <ColorPicker initialColor={color} onPick={(color) => setColor(color)}>
                    Color
                </ColorPicker>

                <Input icon="fas fa-star"
                    placeholder="Experience"
                    value={experience}
                    onClick={() => setError("")}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.match(/^-?\d*\.?\d{0,2}$/)) setExperience(value);
                    }}
                />
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
