import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Modal } from "@components/index";

import { Modals, type ModalStoreContext } from "./modal.d";

const ModalStoreContext = createContext<ModalStoreContext>({
    modals: [],
    setModals: () => { },
    createModal: () => "",
    closeModal: () => { }
});

export function useModal() {
    return useContext(ModalStoreContext);
}

export function ModalStoreProvider({ children }: { children: ReactNode }) {
    const [modals, setModals] = useState<Modals[]>([]);

    const createModal = (modal: ReactNode) => {
        const id: string = Math.random().toString(36).slice(2);

        setModals((modals: Modals[]) => [...modals, { id, modal }]);

        return id;
    };

    const closeModal = () => setModals((modals: Modals[]) => modals.filter((_: unknown, i: number) => i !== 0));

    useEffect(() => {
        if (modals.length > 0) document.body.style.overflow = "hidden";
        else document.body.style.removeProperty("overflow");
    }, [modals]);

    return (
        <ModalStoreContext.Provider value={{ modals, setModals, createModal, closeModal }}>
            {modals[0] && <Modal.GenericModal>{modals[0].modal}</Modal.GenericModal>}

            {children}
        </ModalStoreContext.Provider>
    );
}
