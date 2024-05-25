import { useModal } from "@stores/ModalStore";
import { Modal, Button } from "@components/index";

import { ErrorModalProps } from "./errorModal.d";

export default function ErrorModal({ onClick, children }: ErrorModalProps) {
    const { closeModal } = useModal();

    return (
        <>
            <Modal.ModalHeader>Error</Modal.ModalHeader>
            <Modal.ModalBody>{children ? children : "Something went wrong."}</Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <Button onClick={() => {
                    if (onClick) onClick();

                    closeModal();
                }}>Okay</Button>
            </Modal.ModalButtonContainer>
        </>
    );
}
