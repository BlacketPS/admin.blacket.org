import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { User } from "blacket-types";

const UserStoreContext = createContext<{
    user: User | null,
    setUser: (user: User | null) => void
}>({
    user: null,
    setUser: () => null
});

export function useUser() {
    return useContext(UserStoreContext);
}

export function UserStoreProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any | null>(null);
    useEffect(() => {
        const fetchUser = async () => await window.fetch2.get("/api/users/me")
            .then((res: Fetch2Response) => setUser(res.data));

        if (localStorage.getItem("token")) fetchUser()
            .then(() => setLoading(false))
            .catch(() => {
                setLoading(false);

                localStorage.removeItem("token");
            });
        else {
            setUser(null);
            setLoading(false);
        }
    }, []);

    return <UserStoreContext.Provider value={{ user, setUser }}>{!loading ? children : null}</UserStoreContext.Provider>;
}
