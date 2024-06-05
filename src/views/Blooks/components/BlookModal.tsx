import { useEffect, useState } from "react";
import { Modal, Form, Input, RarityPicker, ResourcePicker, PackPicker, ErrorContainer, Button } from "@components/index";
import { useModal } from "@stores/ModalStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useRarity } from "@stores/RarityStore/index";
import { usePack } from "@stores/PackStore/index";

import { BlookModalProps } from "../blooks.d";
import { Rarity, Resource, Pack } from "blacket-types";

export default function BlookModal({ blook, onCreate, onUpdate, onDelete }: BlookModalProps) {
    const { resources } = useResource();
    const { rarities } = useRarity();
    const { packs } = usePack();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>(blook?.name || "");
    const [chance, setChance] = useState<string>(blook?.chance.toString() || "");
    const [price, setPrice] = useState<string>(blook?.price.toString() || "");
    const [rarity, setRarity] = useState<Rarity | null>(null);
    const [imageResource, setImageResource] = useState<Resource | null>(null);
    const [backgroundResource, setBackgroundResource] = useState<Resource | null>(null);
    const [pack, setPack] = useState<Pack | null>(null);

    const { closeModal } = useModal();

    useEffect(() => {
        if (blook) {
            setImageResource(resources.find((resource) => resource.id === blook.imageId) || null);
            setBackgroundResource(resources.find((resource) => resource.id === blook.backgroundId) || null);
            setRarity(rarities.find((rarity) => rarity.id === blook.rarityId) || null);
            setPack(packs.find((pack) => pack.id === blook.packId) || null);
        }
    }, [blook, resources, rarities, packs]);

    const submitForm = (mode: "create" | "update" | "delete") => {
        switch (mode) {
            case "create":
                if (name.length < 1) return setError("Please enter a name.");
                if (price.length < 1) return setError("Please enter a price.");
                if (chance.length < 1) return setError("Please enter a chance.");
                if (price.length < 1) return setError("Please enter a price.");
                if (!rarity) return setError("Please select a rarity.");
                if (!imageResource) return setError("Please select an image resource.");
                if (!backgroundResource) return setError("Please select a background resource.");

                setLoading(true);
                onCreate?.({ name, chance: parseFloat(chance), price: parseFloat(price), rarityId: rarity.id, imageId: imageResource.id, backgroundId: backgroundResource.id, packId: pack?.id })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "update":
                if (name.length < 1) return setError("Please enter a name.");
                if (price.length < 1) return setError("Please enter a price.");
                if (chance.length < 1) return setError("Please enter a chance.");
                if (price.length < 1) return setError("Please enter a price.");
                if (!rarity) return setError("Please select a rarity.");
                if (!imageResource) return setError("Please select an image resource.");
                if (!backgroundResource) return setError("Please select a background resource.");

                setLoading(true);
                if (blook) onUpdate?.(blook.id, { name, chance: parseFloat(chance), price: parseFloat(price), rarityId: rarity.id, imageId: imageResource.id, backgroundId: backgroundResource.id, packId: pack?.id })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "delete":
                if (name !== "delete") return setError("Are you sure you want to delete this blook? Type \"delete\" in the name field to confirm.");

                setLoading(true);
                if (blook) onDelete?.(blook.id)
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
        }
    };

    return (
        <>
            <Modal.ModalHeader>{onCreate ? "Create" : "Update"} Blook</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out the fields below.</Modal.ModalBody>

            <Form onSubmit={submitForm}>
                <Input icon="fas fa-tag"
                    placeholder="Name"
                    value={name}
                    onClick={() => setError("")}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input icon="fas fa-percent"
                    placeholder="Chance"
                    value={chance}
                    onClick={() => setError("")}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.match(/^-?\d*\.?\d{0,2}$/)) setChance(value);
                    }}
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

                <RarityPicker onPick={(rarity) => setRarity(rarity)}>
                    Rarity: {rarity ? <>[{rarity.id}] <span style={{ color: rarity.color, marginLeft: 5 }}>{rarity.name}</span></> : "None"}
                </RarityPicker>

                <ResourcePicker
                    onPick={(resource) => setImageResource(resource)}
                    allowedTypes={["png", "jpg", "jpeg", "gif", "webp"]}
                >
                    Image Resource: {imageResource ? <>[{imageResource.id}] <img src={imageResource.path} /></> : "None"}
                </ResourcePicker>

                <ResourcePicker
                    onPick={(resource) => setBackgroundResource(resource)}
                    allowedTypes={["png", "jpg", "jpeg", "gif", "webp"]}
                >
                    Background Resource: {backgroundResource ? <>[{backgroundResource.id}] <img src={backgroundResource.path} /></> : "None"}
                </ResourcePicker>

                <PackPicker onPick={(pack) => setPack(pack)}>
                    Pack: {pack ? <>[{pack.id}] {pack.name}</> : "None"}
                </PackPicker>

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
