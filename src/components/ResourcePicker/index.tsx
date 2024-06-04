import { useEffect, useRef, useState } from "react";
import { Input, Resource } from "@components/index";
import { useResource } from "@stores/ResourceStore";
import styles from "./resourcePicker.module.scss";

import { ResourcePickerProps } from "./resourcePicker.d";

export default function ResourcePicker({ onPick, allowedTypes, children }: ResourcePickerProps) {
    const [resourceSelectorOpen, setResourceSelectorOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const resourcePickerButtonRef = useRef<HTMLDivElement>(null);
    const resourceSelectorRef = useRef<HTMLDivElement>(null);

    const { resources } = useResource();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                resourceSelectorRef.current
                && !resourceSelectorRef.current.contains(event.target as Node)
                && !resourcePickerButtonRef.current?.contains(event.target as Node)
            ) setResourceSelectorOpen(false);
        }

        if (resourceSelectorOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [resourceSelectorOpen]);

    return (
        <>
            <div className={styles.resourcePickerContainer}>
                <div ref={resourcePickerButtonRef} className={styles.resourcePickerButton} onClick={() => setResourceSelectorOpen(!resourceSelectorOpen)}>
                    {children ?? "Selected Resource:"}
                </div>
            </div>

            {resourceSelectorOpen && <div className={styles.resourceSelectorContainer} style={{ transform: `translateY(${window.innerWidth < 650 ? "-310px" : "-10px"})` }}>
                <div ref={resourceSelectorRef} className={styles.resourceSelector}>
                    {window.innerWidth > 650 && <Input
                        placeholder="Search for a resource..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        containerProps={{
                            style: {
                                width: "100%",
                                maxWidth: "unset",
                                margin: "unset"
                            }
                        }}
                    />}

                    <div className={styles.resourceList}>
                        {resources.filter((resource) => resource.path.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? resources.filter((resource) => resource.path.toLowerCase().includes(searchQuery.toLowerCase())).map((resource) => {
                            const extension = resource.path.split(".").pop()?.toLowerCase();

                            if (allowedTypes && extension && !allowedTypes.includes(extension)) return null;
                            else return <Resource key={resource.id} resource={resource} onClick={() => {
                                onPick(resource);

                                setResourceSelectorOpen(false);
                            }} />;
                        }) : <div className={styles.noResources}>No resources found.</div>}
                    </div>

                    {window.innerWidth <= 650 && <Input
                        placeholder="Search for a resource..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        containerProps={{
                            style: {
                                width: "100%",
                                maxWidth: "unset",
                                margin: "unset"
                            }
                        }}
                    />}
                </div>
            </div>}
        </>
    );
}
