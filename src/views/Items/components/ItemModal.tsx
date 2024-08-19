import { Button, Dropdown, ErrorContainer, Form, ImageOrVideo, Input, Modal, RarityPicker, ResourcePicker, Toggle } from "@components/index";
import { ItemType, Rarity, Resource } from "blacket-types";
import { useEffect, useState } from "react";

import { ItemModalProps } from "../items.d";
import { useModal } from "@stores/ModalStore/index";
import { useRarity } from "@stores/RarityStore/index";
import { useResource } from "@stores/ResourceStore/index";

export default function ItemModal({ item, onCreate, onUpdate, onDelete }: ItemModalProps) {
    const { rarities } = useRarity();
    const { resources } = useResource();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>(item?.name || "");
    const [description, setDescription] = useState<string>(item?.description || "");
    const [rarity, setRarity] = useState<Rarity | null>(null);
    const [imageResource, setImageResource] = useState<Resource | null>(null);
    const [type, setType] = useState<ItemType>(item?.type || ItemType.NONE);
    const [boosterDuration, setBoosterDuration] = useState<string | null>(item?.boosterDuration ? item.boosterDuration.toString() : null);
    const [canUse, setCanUse] = useState<boolean>(item?.canUse || false);
    const [canAuction, setCanAuction] = useState<boolean>(item?.canAuction || true);
    const [canTrade, setCanTrade] = useState<boolean>(item?.canTrade || true);
    const [maxUses, setMaxUses] = useState<string | null>(item?.maxUses ? item.maxUses.toString() : null);

    const { closeModal } = useModal();

    useEffect(() => {
        if (item) {
            setRarity(rarities.find((rarity) => rarity.id === item.rarityId) || null);
            setImageResource(resources.find((resource) => resource.id === item.imageId) || null);
        }
    }, [item, rarities, resources]);

    const submitForm = (mode: "create" | "update" | "delete") => {
        if (name.length < 1) return setError("Please enter a name.");

        if (mode !== "delete") {
            if (!rarity) return setError("Please select a rarity.");
            if (!imageResource) return setError("Please select an image resource.");
        }

        switch (mode) {
            case "create":
                setLoading(true);
                onCreate?.({ name, description, rarityId: rarity?.id || 0, imageId: imageResource?.id || 0, type, boosterDuration: boosterDuration ? Number(boosterDuration) : 0, canUse, canAuction, canTrade, maxUses: maxUses ? Number(maxUses) : 0 })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "update":
                setLoading(true);
                if (item) onUpdate?.(item.id, { name, description, rarityId: rarity?.id || 0, imageId: imageResource?.id || 0, type, boosterDuration: boosterDuration ? Number(boosterDuration) : 0, canUse, canAuction, canTrade, maxUses: maxUses ? Number(maxUses) : 0 })
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
            case "delete":
                if (name !== "delete") return setError("Are you sure you want to delete this rarity? Type \"delete\" in the name field to confirm.");

                setLoading(true);
                if (item) onDelete?.(item.id)
                    .then(() => closeModal())
                    .catch((err: Fetch2Response) => setError(err.data.message))
                    .finally(() => setLoading(false));
                break;
        }
    };

    return (
        <>
            <Modal.ModalHeader>{onCreate ? "Create" : "Update"} Item</Modal.ModalHeader>
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

                <RarityPicker onPick={(rarity) => setRarity(rarity)}>
                    Rarity: {rarity ? <>[{rarity.id}] <span style={{ color: rarity.color, marginLeft: 5 }}>{rarity.name}</span></> : "None"}
                </RarityPicker>

                <ResourcePicker
                    onPick={(resource) => setImageResource(resource)}
                    allowedTypes={["png", "jpg", "jpeg", "gif", "webp", "mp4", "webm"]}
                >
                    Image Resource: {imageResource ? <>[{imageResource.id}] <ImageOrVideo src={imageResource.path} /></> : "None"}
                </ResourcePicker>

                <Dropdown
                    options={Object.keys(ItemType)
                        .filter((key) => isNaN(Number(key)))
                        .map((type) => ({ name: type, value: ItemType[type as keyof typeof ItemType] }))}
                    onPick={(option) => setType(option)}
                >
                    Item Type: {ItemType[type]}
                </Dropdown>

                {type === ItemType.BOOSTER && <Input icon="fas fa-clock"
                    placeholder="Booster Duration (in minutes)"
                    value={boosterDuration?.toString() || ""}
                    onClick={() => setError("")}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.match(/^-?\d*\.?\d{0,2}$/)) setBoosterDuration(value);
                    }}
                />}

                <Modal.ModalToggleContainer>
                    <Toggle onClick={() => setCanUse(!canUse)} checked={canUse}>
                        Can Use
                    </Toggle>

                    <Toggle onClick={() => setCanAuction(!canAuction)} checked={canAuction}>
                        Can Auction
                    </Toggle>

                    <Toggle onClick={() => setCanTrade(!canTrade)} checked={canTrade}>
                        Can Trade
                    </Toggle>
                </Modal.ModalToggleContainer>

                <Input icon="fas fa-hashtag"
                    placeholder="Max Uses"
                    value={maxUses?.toString() || ""}
                    onClick={() => setError("")}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.match(/^-?\d*\.?\d{0,2}$/)) setMaxUses(value);
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
