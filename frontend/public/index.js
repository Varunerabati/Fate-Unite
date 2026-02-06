import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css"; // Ensure this path resolves correctly to your CSS file
import App from "@/App"; // Ensure this path resolves correctly to your main App component

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing in HTML");
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);