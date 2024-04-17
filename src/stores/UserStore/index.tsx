import { createContext, useContext, useEffect, useState, ReactElement } from "react";

type UserStoreContextType = {
    user: any,
    setUser: React.Dispatch<any>
};

const UserStoreContext = createContext<UserStoreContextType | undefined>(undefined);

export default function useUser() {
    return useContext(UserStoreContext);
}

export function UserStoreProvider({ children }: { children: ReactElement }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState("stewart");

    useEffect(() => {
        const fetchUser = async () => await window.fetch2.get("/api/users/me")
            .then((res) => setUser(res.data.user))
            .catch(() => localStorage.removeItem("token"));

        if (localStorage.getItem("token")) fetchUser()
            .finally(() => setLoading(false));
        else {
            setUser("fewfw");
            setLoading(false);
        }
    }, []);

    return <UserStoreContext.Provider value={{ user, setUser }}>{!loading ? children : null}</UserStoreContext.Provider>;
}
