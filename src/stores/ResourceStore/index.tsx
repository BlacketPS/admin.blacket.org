import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";

import { Resource } from "blacket-types";

const ResourceStoreContext = createContext<{
    resources: Resource[],
    setResources: (resources: Resource[]) => void
}>({
    resources: [],
    setResources: () => null
});

export function useResource() {
    return useContext(ResourceStoreContext);
}

export function ResourceStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [resources, setResources] = useState<Resource[]>([]);

    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/staff/admin/resources")
            .then((res: Fetch2Response) => setResources(res.data))
            .catch(() => setError(true));

        if (user) fetchData()
            .then(() => setLoading(false));
        else setLoading(false);
    }, [user]);

    if (error) throw new Error("An error occurred while fetching resources.");
    else return <ResourceStoreContext.Provider value={{ resources, setResources }}>{!loading ? children : null}</ResourceStoreContext.Provider>;
}
