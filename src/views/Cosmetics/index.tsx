import { useState, useEffect, useRef } from "react";

import { ButtonRow, Button } from "@components/index";
import CategoryButton from "./components/CategoryButton";

import styles from "./cosmetics.module.scss";

import { Fonts, Titles, Banners } from "./views";
import { Resource } from "blacket-types";

export default function Cosmetics() {
    const [selected, setSelected] = useState("Fonts");

    const expandable = useRef<HTMLDivElement>(null);

    const headerRef = useRef<HTMLHeadingElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [resources, setResources] = useState<Resource[]>([]);

    const setSelectedState: (selected: string) => void = (selected: string) => {
        if (!headerRef.current || !contentRef.current) return;

        contentRef.current?.scrollTo(0, 0);

        contentRef.current.style.animation = "none";
        contentRef.current?.offsetHeight;
        contentRef.current.style.animation = "";

        headerRef.current.style.animation = "none";
        headerRef.current.offsetHeight;
        headerRef.current.style.animation = "";

        setSelected(selected);

        return;
    };

    useEffect(() => {
        window.fetch2.get("/api/staff/resources")
            .then((res: Fetch2Response) => {
                setResources(res.data);
            });
    }, []);

    const states = {
        selectedState: setSelectedState,
        getSelected: selected
    };

    return (
        <>
            <h1>Cosmetics</h1>

            <ButtonRow style={{
                position: "relative",
                paddingBottom: "20px",
                boxSizing: "border-box"
            }}>
                <CategoryButton title="Fonts" fw={1} {...states} icon="fas fa-font" />
                <CategoryButton title="Titles" fw={2} {...states} icon="fas fa-heading" />
                <CategoryButton title="Banners" fw={3} {...states} icon="fas fa-flag" />
            </ButtonRow>

            <div className={styles.divider} />

            <div className={styles.expandable} ref={expandable}>
                <h1><span className={styles.icon}>{
                    selected === "Fonts" ? <i className="fas fa-font"></i> :
                    selected === "Titles" ? <i className="fas fa-heading"></i> :
                    selected === "Banners" ? <i className="fas fa-flag"></i> : ""
                }</span><span className={styles.contentHeader} ref={headerRef}>{selected}</span></h1>

                <div className={styles.containerDivider} />

                <div className={styles.content}>
                    <div className={styles.innerContent} ref={contentRef}>
                        {selected === "Fonts" ? (
                            <Fonts resources={resources} />
                        ) : selected === "Titles" ? (
                            <Titles resources={resources} />
                        ) : selected === "Banners" ? (
                            <Banners resources={resources} />
                        ) : ""}
                    </div>
                </div>
            </div>
        </>
    );
}
