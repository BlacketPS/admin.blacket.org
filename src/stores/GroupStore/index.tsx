import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@stores/UserStore/index";

import { Group } from "blacket-types";

const GroupStoreContext = createContext<{
    groups: Group[],
    setGroups: (resources: Group[]) => void,
}>({
    groups: [],
    setGroups: () => null
});

export function useGroup() {
    return useContext(GroupStoreContext);
}

export function GroupStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [groups, setGroups] = useState<Group[]>([]);

    const { user } = useUser();

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/staff/admin/groups")
            .then((res: Fetch2Response) => setGroups(res.data))
            .catch(() => setError(true));

        if (user) fetchData()
            .then(() => setLoading(false));
        else setLoading(false);
    }, [user]);

    if (error) throw new Error("An error occurred while fetching groups.");
    else return <GroupStoreContext.Provider value={{ groups, setGroups }}>{!loading ? children : null}</GroupStoreContext.Provider>;
}
