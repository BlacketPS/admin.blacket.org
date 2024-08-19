import { Button, ErrorContainer, Form, Input, Modal } from "@components/index";

import { ResourceModalProps } from "../resources.d";
import styles from "../resources.module.scss";
import { useModal } from "@stores/ModalStore";
import { useState } from "react";

export default function UpdateOrDeleteResourceModal({ resource, onCreate, onUpdate, onDelete }: ResourceModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [path, setPath] = useState<string>(resource?.path || "");
    const [fileExtension, setFileExtension] = useState<string>(path.split(".").pop()?.toLowerCase() || "");

    const { closeModal } = useModal();

    const submitForm = (mode: string) => {
        if (path.length < 1) return setError("Please enter a path.");

        switch (mode) {
            case "create":
                setLoading(true);
                onCreate?.({ path })
                    .then(closeModal)
                    .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                    .finally(() => setLoading(false));
                break;
            case "update":
                if (!resource?.id) return setError("Resource ID not found.");

                setLoading(true);
                onUpdate?.(resource.id, { path })
                    .then(closeModal)
                    .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                    .finally(() => setLoading(false));
                break;
            case "delete":
                if (path !== "delete") return setError("Are you sure you want to delete this resource? Type \"delete\" in the file path field to confirm.");
                if (!resource?.id) return setError("Resource ID not found.");

                setLoading(true);
                onDelete?.(resource.id)
                    .then(closeModal)
                    .catch((err: Fetch2Response) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
                    .finally(() => setLoading(false));
        }
    };

    const textCycles = ["Ab", "The quick brown fox jumps over the lazy dog", "1234567890", "abcdefghijklmnopqrstuvwxyz"];

    return (
        <>
            <Modal.ModalHeader>{onCreate ? "Create" : "Update"} Resource</Modal.ModalHeader>
            <Modal.ModalBody>Please fill out the fields below.</Modal.ModalBody>

            <Form onSubmit={submitForm}>
                <Input
                    icon="fas fa-file"
                    placeholder="File Path"
                    value={path}
                    onClick={() => setError("")}
                    onChange={(e) => {
                        setPath(e.target.value);
                        setFileExtension(e.target.value.split(".").pop()?.toLowerCase() || "");
                    }}
                />

                <div className={styles.addResourceModalImageContainer}>
                    {["jpeg", "jpg", "png", "gif", "webp"].includes(fileExtension) ? (
                        <img
                            src={path}
                            onError={(e) => e.currentTarget.style.visibility = "hidden"}
                            onLoad={(e) => e.currentTarget.style.visibility = "visible"}
                        />
                    ) : ["mp4", "webm"].includes(fileExtension) ? (
                        <video
                            src={path}
                            autoPlay
                            muted
                            loop
                            controls={false}
                            onError={(e) => e.currentTarget.style.visibility = "hidden"}
                            onLoad={(e) => e.currentTarget.style.visibility = "visible"}
                        />
                    ) : ["ttf", "woff", "woff2"].includes(fileExtension) ? (() => {
                        const fontId = path.split("/")?.pop()?.split(".")[0] + "-font-inline-" + Math.random().toString(36).substring(7);
                        return (
                            <>
                                <style>{`
                                    @font-face {
                                        font-family: '${fontId}';
                                        src: url('${path}');
                                    }
                                `}
                                </style>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%"
                                }}>
                                    <span style={{
                                        fontFamily: fontId,
                                        fontSize: "3rem",
                                        color: "white",
                                        margin: 0,
                                        marginLeft: "auto",
                                        width: "350px",
                                        overflow: "hidden",
                                        verticalAlign: "middle",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "3.5rem"
                                    }} id="preview-font-curr">Ab</span>
                                    <div className={styles.addResourceModalArrowButton} style={{
                                        fontSize: "2rem",
                                        color: "white",
                                        verticalAlign: "middle"
                                    }} onClick={() => {
                                        const previewFont = document.getElementById("preview-font-curr");

                                        if (previewFont) {
                                            const currentText = previewFont.innerText;
                                            const currentTextIndex = textCycles.indexOf(currentText);

                                            previewFont.style.opacity = "0";
                                            previewFont.innerText = textCycles[(currentTextIndex + 1) % textCycles.length];
                                            previewFont.style.animation = "";
                                            previewFont.offsetHeight;
                                            previewFont.style.animation = `${styles.addResourceModalFontSlideIn} 0.5s cubic-bezier(0, 1, 0, 1) forwards`;


                                            if (previewFont.innerText.length < 5) {
                                                previewFont.style.fontSize = "3rem";
                                                return;
                                            }
                                            previewFont.style.fontSize = 500 / previewFont.innerText.length + "px";
                                        }
                                    }}>
                                        <i className="fas fa-arrow-right" />
                                    </div>
                                </div>
                            </>
                        );
                     })() :<i className="fas fa-file" />}
                </div>

                {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

                <Modal.ModalButtonContainer loading={loading}>
                    {onCreate && <Button type="submit" onClick={() => submitForm("create")}>Create</Button>}
                    {onUpdate && <Button type="submit" onClick={() => submitForm("update")}>Update</Button>}
                    {onDelete && <Button onClick={() => submitForm("delete")}>Delete</Button>}
                    <Button onClick={closeModal}>Cancel</Button>
                </Modal.ModalButtonContainer>
            </Form>
        </>
    );
}
