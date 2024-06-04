import { ReactNode } from "react";

import { UserStoreProvider } from "./UserStore";
import { ResourceStoreProvider } from "./ResourceStore";
import { RarityStoreProvider } from "./RarityStore";
import { PackStoreProvider } from "./PackStore";
import { BlookStoreProvider } from "./BlookStore";
import { ModalStoreProvider } from "./ModalStore";

export default function StoreWrapper({ children }: { children: ReactNode }) {
    return (
        <UserStoreProvider>
            <ResourceStoreProvider>
                <RarityStoreProvider>
                    <PackStoreProvider>
                        <BlookStoreProvider>
                            <ModalStoreProvider>
                                {children}
                            </ModalStoreProvider>
                        </BlookStoreProvider>
                    </PackStoreProvider>
                </RarityStoreProvider>
            </ResourceStoreProvider>
        </UserStoreProvider>
    );
}
