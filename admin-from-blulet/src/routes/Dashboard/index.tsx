import { useEffect, useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import all from "@styles/all.module.scss";
import styles from "@styles/dashboard.module.scss";
import axios from "axios";

export default function Dashboard() {
    const [users, setUsers] = useState<number>(0);
    const [banned, setBanned] = useState<number>(0);
    const [blacklisted, setBlacklisted] = useState<number>(0);
    const [messages, setMessages] = useState<number>(0);
    const [packs, setPacks] = useState<number>(0);
    const [blues, setBlues] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        const getDashboard = async () => {
            const response = await axios.get("/api/v1/users/count", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const data = response.data;
                setUsers(data.users);
                setBanned(data.banned);
                setBlacklisted(data.blacklisted);
                setMessages(data.messages);
                setPacks(data.packs);
                setBlues(data.blues);
            };
        };

        getDashboard();
    }, []);

    return (
        <>
            <Header />
            <div className={all.regularBody}>
                <Sidebar />
                <div className={all.insideContainer}>
                    <div className={all.header}>Dashboard</div>
                    <div className={styles.countContainer}>Users: {users.toLocaleString()}</div>
                    <div className={styles.countContainer}>Banned: {banned.toLocaleString()}</div>
                    <div className={styles.countContainer}>Blacklisted: {blacklisted.toLocaleString()}</div>
                    <div className={styles.countContainer}>Messages: {messages.toLocaleString()}</div>
                    <div className={styles.countContainer}>Packs: {packs.toLocaleString()}</div>
                    <div className={styles.countContainer}>Blues: {blues.toLocaleString()}</div>
                </div>
            </div>
        </>
    );
};