import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Loader from "@components/Loader";
import all from "@styles/all.module.scss";
import styles from "@styles/packCreator.module.scss";
import axios from "axios";

export default function BlueCreator() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [rarity, setRarity] = useState("");
    const [price, setPrice] = useState(0);
    const [chance, setChance] = useState(0); 
    const [image, setImage] = useState("");
    const [background, setBackground] = useState("");

    const createPack = () => {
        if (!name || !rarity || !price || !chance || !image || !background) return setError("Please fill out all fields.");
        setLoading(true);
        setError("");
        axios.post("/api/v1/blues/create", { name, rarity, price, chance, image, background }, {
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
                    <div className={all.header}>Blue Creator</div>
                    <div className={all.subHeader}>Blue Name</div>
                    <input type="text" placeholder="Name" maxLength={25} className={styles.input} onChange={(event) => setName(event.target.value)} />
                    <div className={all.subHeader}>Blue Rarity</div>
                    <input type="text" placeholder="Rarity" className={styles.input} onChange={(event) => setRarity(event.target.value)} />
                    <div className={all.subHeader}>Blue Price</div>
                    <input type="number" placeholder="Price" defaultValue={price} className={styles.input} onChange={(event) => setPrice(parseInt(event.target.value))} />
                    <div className={all.subHeader}>Blue Chance</div>
                    <input type="number" placeholder="Chance" defaultValue={chance} className={styles.input} onChange={(event) => setChance(parseFloat(event.target.value))} />
                    <div className={all.subHeader}>Blue Image</div>
                    <input type="text" placeholder="Image" className={styles.input} onChange={(event) => setImage(event.target.value)} />
                    <div className={all.subHeader}>Blue Background</div>
                    <input type="text" placeholder="Background" className={styles.input} onChange={(event) => setBackground(event.target.value)} />
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