import { ReactNode } from "react";

import { UserStoreProvider } from "./UserStore";
import { ResourceStoreProvider } from "./ResourceStore";
import { GroupStoreProvider } from "./GroupStore";
import { RarityStoreProvider } from "./RarityStore";
import { PackStoreProvider } from "./PackStore";
import { BlookStoreProvider } from "./BlookStore";
import { ModalStoreProvider } from "./ModalStore";
import { ItemStoreProvider } from "./ItemStore";

export default function StoreWrapper({ children }: { children: ReactNode }) {
    return (
        <UserStoreProvider>
            <ResourceStoreProvider>
                <GroupStoreProvider>
                    <RarityStoreProvider>
                        <PackStoreProvider>
                            <BlookStoreProvider>
                                <ItemStoreProvider>
                                    <ModalStoreProvider>
                                        {children}
                                    </ModalStoreProvider>
                                </ItemStoreProvider>
                            </BlookStoreProvider>
                        </PackStoreProvider>
                    </RarityStoreProvider>
                </GroupStoreProvider>
            </ResourceStoreProvider>
        </UserStoreProvider>
    );
}
