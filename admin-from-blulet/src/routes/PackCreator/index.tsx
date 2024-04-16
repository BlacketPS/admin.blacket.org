import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Loader from "@components/Loader";
import all from "@styles/all.module.scss";
import styles from "@styles/packCreator.module.scss";
import axios from "axios";

export default function PackCreator() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(20);
    const [colors, setColors] = useState("");
    const [blues, setBlues] = useState("");
    const [image, setImage] = useState("");

    const createPack = () => {
        if (!name || !price || !colors || !blues || !image) return setError("Please fill out all fields.");
        setLoading(true);
        setError("");
        const colorsArray = colors.split(",");
        const bluesArray = blues.split(",");
        axios.post("/api/v1/packs/create", { name, price, colors: colorsArray, blues: bluesArray, image }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            if (response.status === 200) {
                setLoading(false);
                setError("");    
            };
        }).catch((error) => {
            console.error(error);
            setLoading(false);
            setError("Something went wrong.");
        });
    };

    return (
        <>
            <Header />
            <div className={all.regularBody}>
                <Sidebar />
                <form className={all.insideContainer}>
                    <div className={all.header}>Pack Creator</div>
                    <div className={all.subHeader}>Pack Name</div>
                    <input type="text" placeholder="Name" maxLength={16} className={styles.input} onChange={(event) => setName(event.target.value)} />
                    <div className={all.subHeader}>Pack Price</div>
                    <input type="number" placeholder="Price" defaultValue={price} className={styles.input} onChange={(event) => setPrice(parseInt(event.target.value))} />
                    <div className={all.subHeader}>Pack Colors</div>
                    <input type="text" placeholder="Colors (comma separated)" className={styles.input} onChange={(event) => setColors(event.target.value)} />
                    <div className={all.subHeader}>Pack Blues</div>
                    <input type="text" placeholder="Blues (comma separated)" className={styles.input} onChange={(event) => setBlues(event.target.value)} />
                    <div className={all.subHeader}>Pack Image</div>
                    <input type="text" placeholder="Image Name" className={styles.input} onChange={(event) => setImage(event.target.value)} />
                    <div className={all.subHeader}>All Done?</div>
                    <div className={styles.buttonRow}>
                        {loading ? <Loader /> : <div className={styles.button} role="button" tabIndex={0} onClick={() => createPack()}>Create</div>}
                    </div>

                    {error && <div className={all.error}>{error}</div>}
                </form>
            </div>
        </>
    );
};