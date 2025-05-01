import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import EditorPage from "./components/EditorPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/resume-editor" element={<EditorPage />} />
    </Routes>
  );
}

export default App;
