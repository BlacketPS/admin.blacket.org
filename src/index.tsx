import { StrictMode } from "react"; // whys just dont i used it and had nothing but issues
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("app") as HTMLElement).render(<StrictMode><App /></StrictMode>);
