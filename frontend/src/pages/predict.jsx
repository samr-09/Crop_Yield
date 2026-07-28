import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import bg from "../assets/background.jpg";

// 🎨 Color palette
const COLORS = [
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#34d399",
  "#16a34a",
  "#15803d",
];

const Predict = () => {
  // 🌱 Dataset-aligned inputs
  const [inputs, setInputs] = useState({
    crop: "",
    state: "",
    area: "",
    rainfall: "",
    temperature: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // 🔮 Dummy ML output (for demo)
  const handlePredict = () => {
    const outputs = [
      {
        title: "🌾 High Yield Potential",
        points: [
          "Estimated Yield: 26–28 quintals per acre",
          "Rainfall & temperature are within optimal range",
          "Soil and climate conditions are favorable",
          "Balanced fertilizer usage recommended",
        ],
      },
      {
        title: "🌤️ Moderate Yield Outlook",
        points: [
          "Estimated Yield: 18–21 quintals per acre",
          "Temperature slightly above normal",
          "Yield can improve with irrigation planning",
          "Climate variability observed",
        ],
      },
      {
        title: "🌧️ Low Yield Risk",
        points: [
          "Estimated Yield: 13–15 quintals per acre",
          "High rainfall may affect crop health",
          "Soil nutrient correction advised",
          "Crop diversification recommended",
        ],
      },
    ];

    setResult(outputs[Math.floor(Math.random() * outputs.length)]);
  };

  // 📊 Trend Data (Month-wise)
  const trendData = [
    { month: "Jan", yield: 10, rainfall: 40, temperature: 22 },
    { month: "Feb", yield: 14, rainfall: 55, temperature: 25 },
    { month: "Mar", yield: 18, rainfall: 70, temperature: 28 },
    { month: "Apr", yield: 22, rainfall: 65, temperature: 31 },
    { month: "May", yield: 26, rainfall: 50, temperature: 33 },
  ];

  // 🧪 Soil / Nutrient data
  const soilData = [
    { name: "Nitrogen", value: 35 },
    { name: "Phosphorus", value: 25 },
    { name: "Potassium", value: 20 },
    { name: "Organic Matter", value: 20 },
  ];

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
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-green-900/60 to-black/80"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-green-400/20 rounded-2xl p-10 shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-green-300 text-center mb-10">
          🌿 Crop Yield Prediction Module
        </h1>

        {/* 📝 INPUT FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {[
            { name: "crop", label: "Crop Type", options: ["Rice", "Wheat", "Maize"] },
            { name: "state", label: "Location", options: ["West Bengal", "Punjab", "Uttar Pradesh", "Maharashtra", "Bihar"] },
            { name: "area", label: "Cultivated Area (hectares)", options: ["1", "2", "5", "10", "20"] },
            { name: "rainfall", label: "Annual Rainfall (mm)", options: ["600", "800", "1000", "1200"] },
            { name: "temperature", label: "Average Temperature (°C)", options: ["22", "25", "28", "32"] },
          ].map((field, i) => (
            <div key={i}>
              <label className="block mb-2 font-semibold text-green-200">
                {field.label}
              </label>
              <input
                list={field.name}
                name={field.name}
                value={inputs[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="w-full p-3 rounded-lg bg-white/10 border border-green-400/30 focus:ring-2 focus:ring-green-400 outline-none text-white"
              />
              <datalist id={field.name}>
                {field.options.map((opt, j) => (
                  <option key={j} value={opt} />
                ))}
              </datalist>
            </div>
          ))}
        </div>

        {/* 🔮 PREDICT BUTTON */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handlePredict}
            className="bg-green-500 hover:bg-green-600 px-10 py-3 rounded-full font-bold shadow-lg"
          >
            Predict Yield
          </motion.button>
        </div>

        {/* 📊 RESULT + VISUALS */}
        {result && (
          <div className="mt-12">
            <div className="bg-green-900/30 rounded-2xl p-6 border border-green-400/20 mb-10">
              <h2 className="text-2xl font-bold text-green-300 mb-4">
                {result.title}
              </h2>
              <ul className="list-disc list-inside text-gray-200 space-y-2">
                {result.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* 📈 VISUAL ANALYTICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              
              {/* Yield vs Month */}
              <BarChart width={260} height={220} data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", fill: "#86efac" }} />
                <YAxis label={{ value: "Yield (q/acre)", angle: -90, position: "insideLeft", fill: "#86efac" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="yield" fill="#22c55e" name="Crop Yield" />
              </BarChart>

              {/* Nutrient Distribution */}
              <PieChart width={260} height={220}>
                <Pie data={soilData} dataKey="value" outerRadius={80} label>
                  {soilData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>

              {/* Rainfall & Temperature vs Month */}
              <LineChart width={260} height={220} data={trendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="rainfall" stroke="#4ade80" name="Rainfall (mm)" />
                <Line dataKey="temperature" stroke="#86efac" name="Temperature (°C)" />
              </LineChart>

              {/* Rainfall vs Yield */}
              <ScatterChart width={260} height={220}>
                <CartesianGrid />
                <XAxis dataKey="rainfall" name="Rainfall (mm)" />
                <YAxis dataKey="yield" name="Yield (q/acre)" />
                <Tooltip />
                <Legend />
                <Scatter data={trendData} fill="#34d399" name="Rainfall vs Yield" />
              </ScatterChart>

              {/* Soil Health Radar */}
              <RadarChart outerRadius={90} width={260} height={220} data={soilData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar
                  dataKey="value"
                  stroke="#22c55e"
                  fill="#16a34a"
                  fillOpacity={0.6}
                  name="Soil Nutrient Levels"
                />
                <Legend />
              </RadarChart>

            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Predict;
