import "./styles/index.css";
import { createRoot } from "react-dom/client";
import App from "./app/LedgerApp.tsx";

createRoot(document.getElementById("root")!).render(<App />);

