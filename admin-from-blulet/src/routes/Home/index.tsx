import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "@components/Header";
import styles from "@styles/all.module.scss";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/dashboard");
    }, []);

    return (
        <>
            <Header />
            <div className={styles.regularBody} style={{ overflow: "hidden" }}>
                <div className={styles.background} />
                <div className={styles.container}>
                    <div className={styles.loginHeader}>Login</div>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            axios.post("/api/v1/login", { token: credentialResponse.credential }).then((response) => {
                                if (response.status === 200) {
                                    localStorage.setItem("token", response.data.signedToken);
                                    navigate("/dashboard");
                                };
                            }).catch((error) => console.error(error));
                        }}
                    />
                </div>
            </div>
        </>
    );
};