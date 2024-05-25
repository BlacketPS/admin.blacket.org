import { ReactNode } from "react";

import { UserStoreProvider } from "./UserStore";
import { ModalStoreProvider } from "./ModalStore";

export default function StoreWrapper({ children }: { children: ReactNode }) {
    return (
        <UserStoreProvider>
            <ModalStoreProvider>
                {children}
            </ModalStoreProvider>
        </UserStoreProvider>
    );
}
