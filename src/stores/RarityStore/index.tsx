import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";

import { Rarity } from "blacket-types";

const RarityStoreContext = createContext<{
    rarities: Rarity[],
    setRarities: (rarities: Rarity[]) => void
}>({
    rarities: [],
    setRarities: () => null
});

export function useRarity() {
    return useContext(RarityStoreContext);
}

export function RarityStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [rarities, setRarities] = useState<Rarity[]>([]);

    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/staff/admin/rarities")
            .then((res: Fetch2Response) => setRarities(res.data))
            .catch(() => setError(true));

        if (user) fetchData()
            .then(() => setLoading(false));
        else setLoading(false);
    }, [user]);

    if (error) throw new Error("An error occurred while fetching rarities.");
    else return <RarityStoreContext.Provider value={{ rarities, setRarities }}>{!loading ? children : null}</RarityStoreContext.Provider>;
}
