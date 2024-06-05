import { useEffect, useRef, useState } from "react";
import { Input } from "@components/index";
import { useRarity } from "@stores/RarityStore/index";
import styles from "./rarityPicker.module.scss";

import { RarityPickerProps } from "./rarityPicker.d";

export default function RarityPicker({ onPick, children }: RarityPickerProps) {
    const [raritySelectorOpen, setRaritySelectorOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const rarityPickerButtonRef = useRef<HTMLDivElement>(null);
    const raritySelectorRef = useRef<HTMLDivElement>(null);

    const { rarities } = useRarity();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                raritySelectorRef.current
                && !raritySelectorRef.current.contains(event.target as Node)
                && !rarityPickerButtonRef.current?.contains(event.target as Node)
            ) setRaritySelectorOpen(false);
        }

        if (raritySelectorOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [raritySelectorOpen]);

    return (
        <>
            <div className={styles.rarityPickerContainer}>
                <div ref={rarityPickerButtonRef} className={styles.rarityPickerButton} onClick={() => setRaritySelectorOpen(!raritySelectorOpen)}>
                    {children ?? "Selected Rarity:"}
                </div>
            </div>

            {raritySelectorOpen && <div className={styles.raritySelectorContainer} style={{ transform: `translateY(${window.innerWidth < 650 ? "-310px" : "-10px"})` }}>
                <div ref={raritySelectorRef} className={styles.raritySelector}>
                    {window.innerWidth > 650 && <Input
                        placeholder="Search for a rarity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        containerProps={{
                            style: {
                                width: "100%",
                                maxWidth: "unset",
                                margin: "unset"
                            }
                        }}
                    />}

                    <div className={styles.rarityList}>
                        {rarities.filter((rarity) => rarity.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? rarities.filter((rarity) => rarity.name.toLowerCase().includes(searchQuery.toLowerCase())).map((rarity) => (
                            <div className={styles.rarityListRarity} style={{ color: rarity.color }} key={rarity.id} onClick={() => {
                                onPick(rarity);

                                setRaritySelectorOpen(false);
                            }}>
                                <i className="fas fa-sparkle" />
                                [{rarity.id}] {rarity.name}
                            </div>
                        )) : <div className={styles.noRarities}>No rarities found.</div>}
                    </div>

                    {window.innerWidth <= 650 && <Input
                        placeholder="Search for a rarity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        containerProps={{
                            style: {
                                width: "100%",
                                maxWidth: "unset",
                                margin: "unset"
                            }
                        }}
                    />}
                </div>
            </div>}
        </>
    );
}
