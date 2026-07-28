import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sprout, CloudRain, Thermometer, Leaf, Loader2 } from "lucide-react";
import bg from "../assets/background.jpg";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

// 🚀 SaaS-ready Recommendation Page (Manual + Live Simulator)

const Recommendation = () => {

  const [mode, setMode] = useState("manual"); // 🔥 dual mode

  const [inputs, setInputs] = useState({
    rainfall: "",
    temperature: "",
    fertilizer: "",
    co2: "",
    area: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const callBackend = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rainfall: Number(inputs.rainfall),
          temperature: Number(inputs.temperature),
          fertilizer: Number(inputs.fertilizer),
          co2: Number(inputs.co2),
          area: Number(inputs.area),
        }),
      });

      const data = await res.json();
      setResult(data);

       await fetch("http://localhost:5000/api/predictions/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs,
        result: data
      })
    });
    
    } catch (err) {
      setError("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRecommend = async () => {
    setError(null);

    const emptyField = Object.values(inputs).some((v) => !v);
    if (emptyField) {
      setError("Please fill all fields");
      return;
    }

    callBackend();
  };

  // 🔥 Live Simulator Auto Update
  useEffect(() => {
    if (mode === "simulator") {
      const allFilled = Object.values(inputs).every((v) => v !== "");
      if (!allFilled) return;

      const debounce = setTimeout(() => {
        callBackend();
      }, 500);

      return () => clearTimeout(debounce);
    }
  }, [inputs, mode]);

  return (
    <div
      className="relative min-h-screen text-gray-100 px-6 py-12"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        filter: "brightness(0.9)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-green-900/60 to-black/80" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-green-400/20 rounded-2xl p-10 shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-green-300 text-center mb-2">
          🌱 AI Crop Recommendation
        </h1>
        <p className="text-center text-green-200/80 mb-6">
          Smart yield prediction powered by machine learning
        </p>

        {/* 🔥 MODE TOGGLE */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("manual")}
            className={`px-5 py-2 rounded-full font-semibold ${
              mode === "manual"
                ? "bg-green-500"
                : "bg-white/10 border border-green-400/30"
            }`}
          >
            Manual Mode
          </button>

          <button
            onClick={() => setMode("simulator")}
            className={`px-5 py-2 rounded-full font-semibold ${
              mode === "simulator"
                ? "bg-green-500"
                : "bg-white/10 border border-green-400/30"
            }`}
          >
            Live Simulator
          </button>
        </div>

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { name: "rainfall", label: "Annual Rainfall (mm)", icon: CloudRain, max: 3000 },
            { name: "temperature", label: "Average Temperature (°C)", icon: Thermometer, max: 50 },
            { name: "fertilizer", label: "Fertilizer Usage", icon: Leaf, max: 500 },
            { name: "co2", label: "CO2 Emission", icon: Leaf, max: 600 },
            { name: "area", label: "Cultivated Area (hectares)", icon: Sprout, max: 500 },
          ].map((field, i) => (
            <div key={i}>
              <label className="text-green-200 mb-2 flex items-center gap-2">
                <field.icon size={18} /> {field.label}
              </label>

              {mode === "simulator" ? (
                <input
                  type="range"
                  min="0"
                  max={field.max}
                  name={field.name}
                  value={inputs[field.name]}
                  onChange={handleChange}
                  className="w-full"
                />
              ) : (
                <input
                  name={field.name}
                  value={inputs[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full p-3 rounded-lg bg-white/10 border border-green-400/30 focus:ring-2 focus:ring-green-400 outline-none text-white"
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-400 text-center mb-4 font-semibold">
            {error}
          </div>
        )}

        {mode === "manual" && (
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRecommend}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 px-10 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Predicting..." : "Recommend Crop"}
            </motion.button>
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-8"
          >
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl text-green-200 mb-2">Best Crop</h2>
              <p className="text-4xl font-bold text-green-300">
                🌾 {result.best_crop}
              </p>
            </div>

            {result.predictions && (
              <div className="bg-green-900/30 border border-green-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-green-300 mb-4">
                  Yield Predictions
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(result.predictions).map(([crop, val]) => (
                    <div key={crop} className="bg-white/10 rounded-xl p-4 text-center">
                      <p className="text-green-200">{crop}</p>
                      <p className="text-2xl font-bold text-green-300">
                        {val.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.explanations && (
              <div className="bg-green-900/30 border border-green-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-green-300 mb-6">
                  Explainable AI – Feature Impact
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[...result.explanations].sort(
                      (a, b) => Math.abs(b.impact) - Math.abs(a.impact)
                    )}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="feature"
                      type="category"
                      tick={{ fill: "#d1fae5" }}
                      tickFormatter={(val) => val.replace("_", " ")}
                    />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Bar dataKey="impact">
                      {[...result.explanations]
                        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                        .map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.impact > 0 ? "#22c55e" : "#ef4444"}
                          />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <p className="mt-4 text-sm text-gray-300">
                  Green bars indicate features increasing predicted yield.
                  Red bars indicate features decreasing predicted yield.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Recommendation;