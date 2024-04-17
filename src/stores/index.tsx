import { ReactNode } from "react";

import { UserStoreProvider } from "./UserStore";

export default function StoreWrapper({ children }: { children: ReactNode }) {
    return (
        <UserStoreProvider>
            <>{children}</>
        </UserStoreProvider>
    );
}
