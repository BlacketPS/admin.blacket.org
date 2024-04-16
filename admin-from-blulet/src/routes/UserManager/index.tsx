import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Loader from "@components/Loader";
import JSONFormatter from "json-formatter-js";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import all from "@styles/all.module.scss";
import styles from "@styles/userManager.module.scss";
import axios from "axios";

interface ModalConfig {
    title: string;
    inputs: Array<any>;
    buttons: Array<any>;
    showing: boolean;
};

interface User {
    _id: string;
    username: string;
    discord: string;
    tokens: number;
    blue: Array<string>;
    perms: Array<string>;
    badges: Array<string>;
    stats: {
        messages: number;
    };
    otp: {
        enabled: boolean;
    };
    ban: {
        banned: boolean;
        reason: string;
        until: number;
    };
    mute: {
        muted: boolean;
        reason: string;
        until: number;
    };
};

interface Blacklist {
    blacklisted: boolean;
    reason?: string;
}

export default function UserManager() {
    const [loading, setLoading] = useState<boolean>(false);
    const [searchType, setSearchType] = useState<string>("");
    const [searchValue, setSearchValue] = useState<HTMLInputElement | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [blacklist, setBlacklist] = useState<Blacklist | null>(null);
    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        title: "",
        inputs: [],
        buttons: [],
        showing: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        setSearchType("username");
        const formatter = new JSONFormatter("Waiting...", 1, {
            theme: "dark"
        });
        const json = document.getElementById("json");
        if (json) {
            json.innerHTML = "";
            json.appendChild(formatter.render());
        };

        if (new URLSearchParams(window.location.search).get("s") && new URLSearchParams(window.location.search).get("m")) {
            setSearchType(new URLSearchParams(window.location.search).get("m") as string);
            setSearchValue({
                value: new URLSearchParams(window.location.search).get("s") as string
            } as HTMLInputElement);
            const search = async () => {
                setLoading(true); 
                const token = localStorage.getItem("token");
                const constructedUrl = `/api/v1/users?${new URLSearchParams(window.location.search).get("m")?.toLocaleLowerCase()}=${new URLSearchParams(window.location.search).get("s")}`;
                const response = await axios.get(constructedUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch((error) => {
                    if (error.response.status === 404) {
                        const formatter = new JSONFormatter("No user found...", 1, {
                            theme: "dark"
                        });
                        const json = document.getElementById("json");
                        if (json) {
                            json.innerHTML = "";
                            json.appendChild(formatter.render());
                        };
                        setLoading(false);
                    };
                });

                if (response?.status === 200) {
                    const data = response.data;
                    data.user.createdAt = new Date(data.user.createdAt).toLocaleString();
                    data.user.updatedAt = new Date(data.user.updatedAt).toLocaleString();
                    setUser(data.user);
                    setBlacklist(data.blacklist);
                    const formatter = new JSONFormatter(data.user, 1, {
                        theme: "dark"
                    });
                    const json = document.getElementById("json");
                    if (json) {
                        json.innerHTML = "";
                        json.appendChild(formatter.render());
                    };
                    setLoading(false);
                };
            };

            search();
        };
    }, []);

    const search = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const constructedUrl = `/api/v1/users?${searchType.toLowerCase()}=${searchValue?.value}`;
        const response = await axios.get(constructedUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((error) => {
            if (error.response.status === 404) {
                setUser(null);
                const formatter = new JSONFormatter("No user found...", 1, {
                    theme: "dark"
                });
                const json = document.getElementById("json");
                if (json) {
                    json.innerHTML = "";
                    json.appendChild(formatter.render());
                };
                setLoading(false);
            };
        });

        if (response?.status === 200) {
            let data = response?.data;
            data.user.createdAt = new Date(data.user.createdAt).toLocaleString();
            data.user.updatedAt = new Date(data.user.updatedAt).toLocaleString();
            setUser(data.user);
            setBlacklist(data.blacklist);
            const formatter = new JSONFormatter(data.user, 1, {
                theme: "dark"
            });
            const json = document.getElementById("json");
            if (json) {
                json.innerHTML = "";
                json.appendChild(formatter.render());
            };
            setLoading(false);
        };
    };

    return (
        <>
            <Header />
            <div className={all.regularBody}>
                <Sidebar />
                <div className={all.insideContainer}>
                    <div className={all.header}>User Manager</div>
                    <form className={styles.searchRow}>
                        <input className={styles.searchInput} type="text"
                            placeholder={searchType === "username" ? "Username" : "ID"}
                            onChange={(event) => setSearchValue(event.target)} onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    if (searchValue) {
                                        navigate(`/user-manager?s=${searchValue.value}&m=${searchType}`);
                                        search();
                                    };
                                };
                            }} />
                        <div className={styles.searchButton} role="button" tabIndex={0} onClick={(event) => {
                            event.preventDefault();
                            if (searchValue) {
                                navigate(`/user-manager?s=${searchValue.value}&m=${searchType}`);
                                search();
                            };
                        }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <div className={styles.smallButtons}>
                            <div className={`${styles.smallButton} ${searchType === "username" ? styles.smallButtonSelected : ""}`} role="button" tabIndex={0} onClick={() => setSearchType("username")}>Username</div>
                            <div className={`${styles.smallButton} ${searchType === "id" ? styles.smallButtonSelected : ""}`} role="button" tabIndex={0} onClick={() => setSearchType("id")}>ID</div>
                        </div>
                        {loading && <Loader />}
                    </form>
                    <div className={styles.bigRow}>
                        <div className={styles.jsonContainer} id="json" />
                        {user && <div className={styles.rightSide}>
                            <div className={styles.smallRow}>
                                <div className={styles.userInfo}>Username: {user.username}</div>
                                <div className={styles.userInfo}>Discord: {user.discord !== "" ? "Linked" : "Unlinked"}</div>
                                <div className={styles.userInfo}>2FA: {user.otp.enabled ? "Enabled" : "Disabled"}</div>
                                <div className={styles.userInfo}>Messages: {user.stats.messages.toLocaleString()}</div>
                            </div>
                            {blacklist?.blacklisted && <div className={styles.smallRow}>
                                <div className={`${styles.punished} ${styles.blacklisted}`}>BLACKLISTED - {blacklist.reason}</div>
                            </div>}
                            {user.ban.banned && <div className={styles.smallRow}>
                                <div className={`${styles.punished} ${styles.banned}`}>BANNED - {new Date(user.ban.until).toLocaleString()}</div>
                            </div>}
                            {user.mute.muted && <div className={styles.smallRow}>
                                <div className={`${styles.punished} ${styles.muted}`}>MUTED - {new Date(user.mute.until).toLocaleString()}</div>
                            </div>}
                            <div className={all.subHeader}>Manage</div>
                            <div className={styles.smallRow}>
                                <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Reset this user's password?",
                                            inputs: [
                                                {
                                                    type: "password",
                                                    placeholder: "Password"
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/reset-password", {
                                                            id: user._id,
                                                            password: (document.getElementById("modal-input-0") as HTMLInputElement).value
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}>Reset Password</div>
                                <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Give this user pro?",
                                            inputs: [],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/give-pro", {
                                                            id: user._id
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}>Give Pro</div>
                                <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Remove this user's pro?",
                                            inputs: [],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/remove-pro", {
                                                            id: user._id
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}>Remove Pro</div>
                                <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Enter the role to set:",
                                            inputs: [
                                                {
                                                    type: "text",
                                                    placeholder: "Role"
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: "Set",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/set-role", {
                                                            id: user._id,
                                                            role: (document.getElementById("modal-input-0") as HTMLInputElement).value
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "Back",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}>Set Role</div>
                                <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Enter the color to set:",
                                            inputs: [
                                                {
                                                    type: "text",
                                                    placeholder: "Color"
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: "Set",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/set-color", {
                                                            id: user._id,
                                                            color: (document.getElementById("modal-input-0") as HTMLInputElement).value
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "Back",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}>Set Color</div>
                                <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Enter number of tokens to give:",
                                            inputs: [
                                                {
                                                    type: "number",
                                                    placeholder: "Tokens",
                                                    default: 100,
                                                    styles: {
                                                        width: "40%",
                                                        textAlign: "center"
                                                    }
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: "Give",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/give-tokens", {
                                                            id: user._id,
                                                            tokens: parseInt((document.getElementById("modal-input-0") as HTMLInputElement).value)
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            user.tokens += parseInt((document.getElementById("modal-input-0") as HTMLInputElement).value);
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "Back",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}>Give Tokens</div>
                                <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Enter the Blue to give (make sure the name is exact):",
                                            inputs: [
                                                {
                                                    type: "text",
                                                    placeholder: "Blue"
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: "Give",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/give-blue", {
                                                            id: user._id,
                                                            blue: (document.getElementById("modal-input-0") as HTMLInputElement).value
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "Back",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}
                                >Give Blue</div>
                                <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Enter the Blue to remove (make sure the name is exact):",
                                            inputs: [
                                                {
                                                    type: "text",
                                                    placeholder: "Blue"
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: "Remove",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/remove-blue", {
                                                            id: user._id,
                                                            blue: (document.getElementById("modal-input-0") as HTMLInputElement).value
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "Back",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}
                                >Remove Blue</div>
                                {user.mute.muted ? <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Unmute this user?",
                                            inputs: [],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/mute", {
                                                            id: user._id,
                                                            muted: false,
                                                            reason: null,
                                                            until: null
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            user.mute.muted = false;
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}
                                >Unmute</div> : <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Mute this user?",
                                            inputs: [
                                                {
                                                    type: "text",
                                                    placeholder: "Reason"
                                                },
                                                {
                                                    type: "datetime-local",
                                                    placeholder: "Until"
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/mute", {
                                                            id: user._id,
                                                            muted: true,
                                                            reason: (document.getElementById("modal-input-0") as HTMLInputElement).value,
                                                            until: new Date((document.getElementById("modal-input-1") as HTMLInputElement).value).getTime()
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            user.mute.muted = true;
                                                            user.mute.until = new Date((document.getElementById("modal-input-1") as HTMLInputElement).value).getTime();
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}
                                >Mute</div>}
                                {user.ban.banned ? <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Unban this user?",
                                            inputs: [],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/ban", {
                                                            id: user._id,
                                                            banned: false,
                                                            reason: null,
                                                            until: null
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            user.ban.banned = false;
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}
                                >Unban</div> : <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Ban this user?",
                                            inputs: [
                                                {
                                                    type: "text",
                                                    placeholder: "Reason"
                                                },
                                                {
                                                    type: "datetime-local",
                                                    placeholder: "Until"
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/ban", {
                                                            id: user._id,
                                                            banned: true,
                                                            reason: (document.getElementById("modal-input-0") as HTMLInputElement).value,
                                                            until: new Date((document.getElementById("modal-input-1") as HTMLInputElement).value).getTime()
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            user.ban.banned = true;
                                                            user.ban.until = new Date((document.getElementById("modal-input-1") as HTMLInputElement).value).getTime();
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}
                                >Ban</div>}
                                {blacklist?.blacklisted ? <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Unblacklist this user?",
                                            inputs: [],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/blacklist", {
                                                            id: user._id,
                                                            blacklisted: false,
                                                            reason: null
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setBlacklist({
                                                                blacklisted: false
                                                            });
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}
                                >Unblacklist</div> : <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Blacklist this user?",
                                            inputs: [
                                                {
                                                    type: "text",
                                                    placeholder: "Reason"
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.put("/api/v1/users/blacklist", {
                                                            id: user._id,
                                                            blacklisted: true,
                                                            reason: (document.getElementById("modal-input-0") as HTMLInputElement).value
                                                        }, {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            setLoading(false);
                                                            setBlacklist({
                                                                blacklisted: true,
                                                                reason: (document.getElementById("modal-input-0") as HTMLInputElement).value
                                                            });
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}
                                >Blacklist</div>}
                                <div className={styles.button} role="button" tabIndex={0}
                                    onClick={() => {
                                        setModalConfig({
                                            title: "Delete this user?",
                                            inputs: [],
                                            buttons: [
                                                {
                                                    text: "Yes",
                                                    onClick: async () => {
                                                        setLoading(true);
                                                        const token = localStorage.getItem("token");
                                                        const response = await axios.delete("/api/v1/users", {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            },
                                                            data: {
                                                                id: user._id
                                                            }
                                                        });

                                                        if (response.status === 200) {
                                                            navigate("/user-manager");
                                                            setLoading(false);
                                                            setUser(null);
                                                            setSearchValue(null);
                                                            setSearchType("username");
                                                            setModalConfig({
                                                                title: "",
                                                                inputs: [],
                                                                buttons: [],
                                                                showing: false
                                                            });
                                                        };
                                                    }
                                                },
                                                {
                                                    text: "No",
                                                    onClick: () => {
                                                        setModalConfig({
                                                            title: "",
                                                            inputs: [],
                                                            buttons: [],
                                                            showing: false
                                                        });
                                                    }
                                                }
                                            ],
                                            showing: true
                                        });
                                    }}>Delete User</div>
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