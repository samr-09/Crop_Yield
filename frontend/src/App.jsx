import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Predict from "./pages/predict";
import Recommendation from "./pages/Recommendation";
import GeoPrediction from "./pages/GeoPrediction";

import "./index.css"; // ✅ Tailwind CSS styles

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌿 Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* 🔐 Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🏡 Main Dashboard */}
        <Route path="/home" element={<Home />} />

        {/* 🌾 Prediction Page */}
        <Route path="/predict" element={<Predict />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/geo" element={<GeoPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;
