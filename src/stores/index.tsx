import { ReactElement } from "react";

import { UserStoreProvider } from "./UserStore";

export default function StoreWrapper({ children }: { children: ReactElement }) {
    return (
        <UserStoreProvider>
            {children}
        </UserStoreProvider>
    );
}
