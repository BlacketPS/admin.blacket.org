import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";

import { Blook } from "blacket-types";

const BlookStoreContext = createContext<{
    blooks: Blook[],
    setBlooks: (blooks: Blook[]) => void
}>({
    blooks: [],
    setBlooks: () => null
});

export function useBlook() {
    return useContext(BlookStoreContext);
}

export function BlookStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [blooks, setBlooks] = useState<Blook[]>([]);

    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/staff/admin/blooks")
            .then((res: Fetch2Response) => setBlooks(res.data))
            .catch(() => setError(true));

        if (user) fetchData()
            .then(() => setLoading(false));
        else setLoading(false);
    }, [user]);

    if (error) throw new Error("An error occurred while fetching blooks.");
    else return <BlookStoreContext.Provider value={{ blooks, setBlooks }}>{!loading ? children : null}</BlookStoreContext.Provider>;
}
