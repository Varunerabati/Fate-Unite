import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FateLandingPage from "./components/FateLandingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FateLandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;