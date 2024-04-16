import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// jude where the FUCK did you go?

createRoot(document.getElementById("app") as HTMLElement).render(<StrictMode><App /></StrictMode>);
