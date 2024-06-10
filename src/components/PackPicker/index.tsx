import { useEffect, useRef, useState } from "react";
import { Input } from "@components/index";
import { useResource } from "@stores/ResourceStore/index";
import { usePack } from "@stores/PackStore/index";
import styles from "./packPicker.module.scss";

import { PackPickerProps } from "./packPicker.d";

export default function PackPicker({ onPick, children }: PackPickerProps) {
    const [packSelectorOpen, setRaritySelectorOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const packPickerButtonRef = useRef<HTMLDivElement>(null);
    const packSelectorRef = useRef<HTMLDivElement>(null);

    const { resourceIdToPath } = useResource();
    const { packs } = usePack();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                packSelectorRef.current
                && !packSelectorRef.current.contains(event.target as Node)
                && !packPickerButtonRef.current?.contains(event.target as Node)
            ) setRaritySelectorOpen(false);
        }

        if (packSelectorOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [packSelectorOpen]);

    return (
        <>
            <div className={styles.packPickerContainer}>
                <div ref={packPickerButtonRef} className={styles.packPickerButton} onClick={() => setRaritySelectorOpen(!packSelectorOpen)}>
                    {children ?? "Selected Pack:"}
                </div>
            </div>

            {packSelectorOpen && <div className={styles.packSelectorContainer} style={{ transform: `translateY(${window.innerWidth < 650 ? "-310px" : "-10px"})` }}>
                <div ref={packSelectorRef} className={styles.packSelector}>
                    {window.innerWidth > 650 && <Input
                        placeholder="Search for a pack..."
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

                    <div className={styles.packList}>
                        {packs.filter((pack) => pack.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? packs.filter((pack) => pack.name.toLowerCase().includes(searchQuery.toLowerCase())).map((pack) => (
                            <div className={styles.packListPack} key={pack.id} onClick={() => {
                                onPick(pack);

                                setRaritySelectorOpen(false);
                            }}>
                                {<img src={resourceIdToPath?.(pack.imageId)} alt={pack.name} />}
                                [{pack.id}] {pack.name}
                            </div>
                        )) : <div className={styles.noPacks}>No packs found.</div>}

                        <div className={styles.packListPack} onClick={() => {
                            onPick(null);

                            setRaritySelectorOpen(false);
                        }}>
                            <img src="https://cdn.blacket.org/static/content/packs/Miscellaneous.png" alt="None" />
                            None
                        </div>
                    </div>

                    {window.innerWidth <= 650 && <Input
                        placeholder="Search for a pack..."
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
