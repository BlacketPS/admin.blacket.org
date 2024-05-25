import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import Loader from "@components/Loader";
import JSONFormatter from "json-formatter-js";
import all from "@styles/all.module.scss";
import styles from "@styles/packManager.module.scss";
import axios from "axios";

interface Pack {
    name: string;
    price: number;
    colors: string[];
    blues: string[];
    image: string;
};

interface ModalConfig {
    showing: boolean;
    title: string;
    inputs: any[];
    buttons: any[];
};

export default function PackManager() {
    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        showing: false,
        title: "",
        inputs: [],
        buttons: []
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [searchData, setSearch] = useState<string>("");
    const [pack, setPack] = useState<Pack | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const formatter = new JSONFormatter("Waiting...", 1, {
            theme: "dark"
        });
        const json = document.getElementById("json");
        if (json) {
            json.innerHTML = "";
            json.appendChild(formatter.render());
        };

        if (new URLSearchParams(window.location.search).get("s") && new URLSearchParams(window.location.search).get("m")) {
            const search = new URLSearchParams(window.location.search).get("s");
            const searchType = new URLSearchParams(window.location.search).get("m");
            axios.get(`/api/v1/packs?${searchType}=${search}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    setPack(response.data);
                    const formatter = new JSONFormatter(response.data, 1, {
                        theme: "dark"
                    });
                    const json = document.getElementById("json");
                    if (json) {
                        json.innerHTML = "";
                        json.appendChild(formatter.render());
                    };
                    setLoading(false);
                };
            }).catch((error) => {
                if (error.response.status === 404) {
                    setPack(null)
                    const formatter = new JSONFormatter("No pack found...", 1, {
                        theme: "dark"
                    });
                    const json = document.getElementById("json");
                    if (json) {
                        json.innerHTML = "";
                        json.appendChild(formatter.render());
                    };
                }
            });
        }
    }, []);

    const search = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/v1/packs?name=${searchData}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((error) => {
            if (error.response.status === 404) {
                setPack(null);
                setLoading(false);
                const formatter = new JSONFormatter("No pack found...", 1, {
                    theme: "dark"
                });
                const json = document.getElementById("json");
                if (json) {
                    json.innerHTML = "";
                    json.appendChild(formatter.render());
                };
            };
        });

        if (response?.status === 200) {
            setPack(response.data);
            const formatter = new JSONFormatter(response.data, 1, {
                theme: "dark"
            });
            const json = document.getElementById("json");
            if (json) {
                json.innerHTML = "";
                json.appendChild(formatter.render());
            };
        }
        setLoading(false);
    };

    return (
        <>
            <Header />
            <div className={all.regularBody}>
                <Sidebar />
                <div className={all.insideContainer}>
                    <div className={all.header}>Pack Manager</div>
                    <form className={styles.searchRow}>
                        <input type="text" placeholder="Search" className={styles.searchInput} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                if (searchData) {
                                    navigate(`/pack-manager?s=${searchData}&m=name`);
                                    search();
                                }
                            }
                        }} />
                        <div className={styles.searchButton} role="button" tabIndex={0} onClick={() => search()}>
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        {loading && <Loader />}
                    </form>
                    <div className={styles.bigRow}>
                        <div className={styles.jsonContainer} id="json" />
                        {pack && <div className={styles.rightSide}>
                            <div className={styles.smallRow}>
                                <div className={styles.packInfo}>Name: {pack?.name}</div>
                            </div>
                            <div className={all.subHeader}>Manage</div>
                            <div className={styles.smallRow}>
                                <div className={styles.button} role="button" tabIndex={0} onClick={() => {
                                    setModalConfig({
                                        title: "Delete this pack?",
                                        inputs: [],
                                        buttons: [
                                            {
                                                text: "Yes",
                                                onClick: () => {
                                                    setLoading(true);
                                                    axios.delete("/api/v1/packs", {
                                                        headers: {
                                                            Authorization: `Bearer ${localStorage.getItem("token")}`
                                                        },
                                                        data: {
                                                            name: pack?.name
                                                        }
                                                    }).then((response) => {
                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setModalConfig({
                                                                showing: false,
                                                                title: "",
                                                                inputs: [],
                                                                buttons: []
                                                            });
                                                            navigate("/pack-manager");
                                                        };
                                                    }).catch((error) => {
                                                        console.error(error);
                                                        setLoading(false);
                                                        setPack(null);
                                                        setModalConfig({
                                                            showing: false,
                                                            title: "",
                                                            inputs: [],
                                                            buttons: []
                                                        });
                                                        navigate("/pack-manager");
                                                    });
                                                }
                                            },
                                            {
                                                text: "No",
                                                onClick: () => setModalConfig({
                                                    showing: false,
                                                    title: "",
                                                    inputs: [],
                                                    buttons: []
                                                })
                                            }
                                        ],
                                        showing: true
                                    })
                                }}>Delete Pack</div>
                            </div>
                        </div>}

                    </div>
                </div>
            </div>

            {modalConfig.showing && <div className={all.modal}>
                <form className={all.modalContainer}>
                    <div className={all.text}>{modalConfig.title}</div>
                    {modalConfig.inputs && <div>
                        {modalConfig.inputs.map((input: any, index: number) => (
                            <input className={all.longInput} type={input.type} placeholder={input.placeholder} key={index} id={`modal-input-${index}`} style={input.styles} defaultValue={input.default} onKeyDown={(event) => event.key === "Enter" ? modalConfig.buttons[0].onClick() : null} />
                        ))}
                    </div>}
                    <div className={all.modalButtons}>
                        {!loading && modalConfig.buttons.map((button: any, index: number) => (
                            <div className={all.modalButton} role="button" tabIndex={0} key={index} onClick={() => button.onClick()}>
                                {button.text}
                            </div>
                        ))}
                        {loading && <Loader />}
                    </div>
                </form>
            </div>}
        </>
    );
};