import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";

import { Item } from "blacket-types";

const ItemStoreContext = createContext<{
    items: Item[],
    setItems: (rarities: Item[]) => void
}>({
    items: [],
    setItems: () => null
});

export function useItem() {
    return useContext(ItemStoreContext);
}

export function ItemStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<Item[]>([]);

    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/staff/admin/items")
            .then((res: Fetch2Response) => setItems(res.data))
            .catch(() => setError(true));

        if (user) fetchData()
            .then(() => setLoading(false));
        else setLoading(false);
    }, [user]);

    if (error) throw new Error("An error occurred while fetching items.");
    else return <ItemStoreContext.Provider value={{ items, setItems }}>{!loading ? children : null}</ItemStoreContext.Provider>;
}
