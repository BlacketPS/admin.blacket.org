import { Header, Background } from "@components/index";
import styles from "./home.module.scss";

import useUser from "@stores/UserStore/index";

export default function Home() {
    const { user } = useUser();

    console.log(user);

    return (
        <>
            <Header />

            <div className="regularBody" style={{ overflow: "hidden" }}>
                <Background />
                <div className="container">
                    <div className={styles.message}>
                        {
                            user ? (
                                <>
                                    <h1>Welcome back, {user.username}!</h1>
                                    <p>It's good to see you again.</p>
                                </>
                            ) : <>You must be authorized to access this page.</>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
