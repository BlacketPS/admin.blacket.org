import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";

import { Pack } from "blacket-types";

const PackStoreContext = createContext<{
    packs: Pack[],
    setPacks: (packs: Pack[]) => void
}>({
    packs: [],
    setPacks: () => null
});

export function usePack() {
    return useContext(PackStoreContext);
}

export function PackStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [packs, setPacks] = useState<Pack[]>([]);

    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/staff/admin/packs")
            .then((res: Fetch2Response) => setPacks(res.data))
            .catch(() => setError(true));

        if (user) fetchData()
            .then(() => setLoading(false));
        else setLoading(false);
    }, [user]);

    if (error) throw new Error("An error occurred while fetching packs.");
    else return <PackStoreContext.Provider value={{ packs, setPacks }}>{!loading ? children : null}</PackStoreContext.Provider>;
}
