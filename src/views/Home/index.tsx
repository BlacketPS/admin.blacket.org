import Header from "@components/Header";
import styles from "./styles.module.scss";

export default function Home() {
    return (
        <>
            <Header />

            <div className="regularBody" style={{ overflow: "hidden" }}>
                <div className="background" />
                <div className="container">
                    <div className={styles.message}>
                        Unauthorized
                    </div>
                </div>
            </div>
        </>
    );
}
