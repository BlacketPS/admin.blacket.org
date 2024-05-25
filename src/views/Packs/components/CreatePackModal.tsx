import { useState } from "react";
import { Modal, Form, Input, Toggle, ErrorContainer, Button } from "@components/index";
import { useModal } from "@stores/ModalStore";

import { CreatePackModalProps } from "../packs.d";

export default function CreatePackModal({ onClick }: CreatePackModalProps) {
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<string>("0");
    const [enabled, setEnabled] = useState<boolean>(false);

    const { closeModal } = useModal();

    const submitForm = () => {
        if (name.length < 1) return setError("Please enter a name.");
        if (price.length < 1) return setError("Please enter a price.");
    };

    return (
        <>
            <Modal.ModalHeader>Create Pack</Modal.ModalHeader>
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

                <Toggle onClick={() => setEnabled(!enabled)} checked={enabled}>
                    Enabled
                </Toggle>

                {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

                <Modal.ModalButtonContainer>
                    <Button type="submit" onClick={submitForm}>Create</Button>
                    <Button onClick={closeModal}>Cancel</Button>
                </Modal.ModalButtonContainer>
            </Form>
        </>
    );
}
