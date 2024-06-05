import { ButtonRow, Button } from "@components/index";
import { useModal } from "@stores/ModalStore/index";
import { useRarity } from "@stores/RarityStore/index";
import { RarityModal } from "./components/index";
import styles from "./rarities.module.scss";

import { StaffAdminCreateRarityDto, StaffAdminUpdateRarityDto } from "blacket-types";

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) return { r: 0, g: 0, b: 0 };

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
};

const isLight = (r: number, g: number, b: number) => {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
};

export default function Rarities() {
    const { createModal } = useModal();
    const { rarities, setRarities } = useRarity();

    /* const addResource = (dto: StaffAdminCreateResourceDto) => new Promise((resolve, reject) => {
        window.fetch2.post("/api/staff/admin/resources", dto)
            .then((res: Fetch2Response) => {
                setResources([...resources, res.data]);

                resolve(res);
            })
            .catch(reject);
    });

    const placeholder = () => new Promise((resolve) => {
        resolve("");
    });

    const deleteResource = (id: number) => new Promise((resolve, reject) => {
        window.fetch2.delete(`/api/staff/admin/resources/${id}`, {})
            .then((res: Fetch2Response) => {
                setResources(resources.filter((resource) => resource.id !== id));

                resolve(res);
            })
            .catch(reject);
    }); */

    const createRarity = (dto: StaffAdminCreateRarityDto) => new Promise((resolve, reject) => {
        window.fetch2.post("/api/staff/admin/rarities", dto)
            .then((res: Fetch2Response) => {
                setRarities([...rarities, res.data]);

                resolve(res);
            })
            .catch(reject);
    });

    const updateRarity = (id: number, dto: StaffAdminUpdateRarityDto) => new Promise((resolve, reject) => {
        window.fetch2.put(`/api/staff/admin/rarities/${id}`, dto)
            .then((res: Fetch2Response) => {
                const rarity = { ...rarities.find((rarity) => rarity.id === id), ...dto };

                const newRarities = rarities.map((r) => r.id === id ? rarity : r);

                setRarities(newRarities);

                resolve(res);
            })
            .catch(reject);
    });

    const deleteRarity = (id: number) => new Promise((resolve, reject) => {
        window.fetch2.delete(`/api/staff/admin/rarities/${id}`, {})
            .then((res: Fetch2Response) => {
                setRarities(rarities.filter((rarity) => rarity.id !== id));

                resolve(res);
            })
            .catch(reject);
    });

    return (
        <>
            <h1>Rarity Manager</h1>

            <ButtonRow>
                <Button
                    icon="fas fa-plus"
                    onClick={() => createModal(<RarityModal onCreate={createRarity} />)}
                >
                    Create Rarity
                </Button>
            </ButtonRow>

            <div className={styles.raritiesWrapper}>
                {rarities.map((rarity) => {
                    const color = hexToRgb(rarity.color);
                    const textColor = isLight(color.r, color.g, color.b) ? "black" : `rgb(${color.r}, ${color.g}, ${color.b})`;

                    return (
                        <div
                            key={rarity.id}
                            style={{
                                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`
                            }}
                            className={styles.rarityContainer}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = textColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "var(--accent-color)";
                            }}
                            onClick={() => createModal(<RarityModal
                                rarity={rarity}
                                onUpdate={updateRarity}
                                onDelete={deleteRarity}
                            />)}
                        >
                            <i className="fas fa-sparkle" />
                            <p>{rarity.name}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
