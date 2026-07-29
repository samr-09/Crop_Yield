import { useState, useEffect } from "react"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    GeoJSON,
    useMap
} from "react-leaflet"
import * as turf from "@turf/turf"
import { Link } from "react-router-dom"

import { Home } from "lucide-react"

import "leaflet/dist/leaflet.css"
import districtData from "../../data/data.json"

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ScatterChart,
    Scatter,
    LineChart,
    Line,
    CartesianGrid
} from "recharts"
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const marker = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

/* ---------------- MAP CLICK ---------------- */

function MapClick({ setLat, setLon, setState, setDistrict }) {

    const map = useMap()

    useMapEvents({

        click(e) {

            const lat = e.latlng.lat
            const lon = e.latlng.lng

            setLat(lat)
            setLon(lon)

            let nearest = null
            let minDist = Infinity

            districtData.forEach((d) => {

                const dist = Math.sqrt(
                    Math.pow(lat - d.latitude, 2) +
                    Math.pow(lon - d.longitude, 2)
                )

                if (dist < minDist) {
                    minDist = dist
                    nearest = d
                }

            })

            if (nearest) {

                setState(nearest.state)
                setDistrict(nearest.district)

                map.flyTo([nearest.latitude, nearest.longitude], 7)

            }

        }

    })

    return null
}


/* ---------------- DISTRICT ZOOM ---------------- */

function ZoomToDistrict({ lat, lon }) {

    const map = useMap()

    useEffect(() => {

        if (lat && lon) {
            map.flyTo([lat, lon], 9)
        }

    }, [lat, lon])

    return null
}


/* ---------------- MAIN COMPONENT ---------------- */

function GeoPrediction() {

    const [state, setState] = useState("")
    const [district, setDistrict] = useState("")
    const [season, setSeason] = useState("")
    const [year, setYear] = useState("")

    const [lat, setLat] = useState(null)
    const [lon, setLon] = useState(null)

    const [districts, setDistricts] = useState([])

    const [districtGeo, setDistrictGeo] = useState(null)
    const [selectedGeo, setSelectedGeo] = useState(null)

    const [prediction, setPrediction] = useState(null)


    /* YEAR RANGE */

    const years = Array.from({ length: 81 }, (_, i) => 1990 + i)


    /* LOAD GEOJSON */

    useEffect(() => {

        fetch("/india_district.geojson")
            .then(res => res.json())
            .then(data => setDistrictGeo(data))

    }, [])


    /* STATE LIST */

    const states = [...new Set(districtData.map(d => d.state))]


    /* LOAD DISTRICTS */

    useEffect(() => {

        if (state) {

            const filtered = districtData
                .filter(d => d.state === state)
                .map(d => d.district)

            setDistricts(filtered)

        }

    }, [state])


    /* DISTRICT SELECT */

    useEffect(() => {

        if (state && district) {

            const data = districtData.find(
                d => d.state === state && d.district === district
            )

            if (data) {

                setLat(data.latitude)
                setLon(data.longitude)

            }

        }

    }, [district, state])


    /* DISTRICT GEOJSON UPDATE */

    useEffect(() => {

        if (!districtGeo || !district) return

        setSelectedGeo(null)

        const feature = districtGeo.features.find(
            f => f.properties.NAME_2?.toUpperCase() === district.toUpperCase()
        )

        setTimeout(() => {
            setSelectedGeo(feature || null)
        }, 0)

    }, [district, districtGeo])


    async function generatePrediction() {

        try {

            const res = await fetch("https://crop-yield-ml-4vg9.onrender.com/predict", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    state,
                    district,
                    season,
                    year: parseInt(year),
                    latitude: lat,
                    longitude: lon
                })
            })

            const data = await res.json()
            console.log(JSON.stringify(data, null, 2))

            setPrediction(data)

        } catch (err) {
            console.error("Prediction error:", err)
        }

    }
    const downloadReport = async () => {

        const upper = document.querySelector(".grid.grid-cols-12");
        const lower = document.getElementById("prediction-report");

        const button = document.getElementById("ignore-pdf");

        if (button) button.style.display = "none";

        if (!upper || !lower) return;

        const canvas1 = await html2canvas(upper, {
            scale: 2,
            useCORS: true,
            scrollY: -window.scrollY
        });

        const canvas2 = await html2canvas(lower, {
            scale: 2,
            useCORS: true,
            scrollY: -window.scrollY
        });

        const imgData1 = canvas1.toDataURL("image/png");
        const imgData2 = canvas2.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;

        const imgHeight1 =
            (canvas1.height * imgWidth) / canvas1.width;

        pdf.addImage(
            imgData1,
            "PNG",
            0,
            0,
            imgWidth,
            imgHeight1
        );
        pdf.addPage();

        const imgHeight2 =
            (canvas2.height * imgWidth) / canvas2.width;

        pdf.addImage(
            imgData2,
            "PNG",
            0,
            0,
            imgWidth,
            imgHeight2
        );



        pdf.save(`Prediction_Report_${district}_${year}.pdf`);
        if (button) {
            button.style.display = "flex";
        }
    };
    /* ---------------- NEW PARTITION FUNCTION ---------------- */
    function generateVoronoiZones() {

        if (!selectedGeo || !prediction) return []

        const rice = parseFloat(prediction.rice)
        const maize = parseFloat(prediction.maize)
        const wheat = parseFloat(prediction.wheat)

        const total = rice + maize + wheat

        /* number of zones per crop */

        const riceCount = Math.round((rice / total) * 20)
        const maizeCount = Math.round((maize / total) * 20)
        const wheatCount = Math.round((wheat / total) * 20)

        const bbox = turf.bbox(selectedGeo)

        /* random points inside district */

        const generatePoints = (count, label) => {

            let pts = []

            while (pts.length < count) {

                const pt = turf.randomPoint(1, { bbox }).features[0]

                if (turf.booleanPointInPolygon(pt, selectedGeo)) {

                    pt.properties.crop = label
                    pts.push(pt)

                }

            }

            return pts

        }

        const ricePts = generatePoints(riceCount, "rice")
        const maizePts = generatePoints(maizeCount, "maize")
        const wheatPts = generatePoints(wheatCount, "wheat")

        const allPoints = turf.featureCollection([
            ...ricePts,
            ...maizePts,
            ...wheatPts
        ])

        /* generate voronoi */

        const voronoi = turf.voronoi(allPoints, { bbox })

        if (!voronoi) return []

        let zones = []

        voronoi.features.forEach((cell, i) => {

            try {

                const clipped = turf.intersect(
                    turf.featureCollection([cell, selectedGeo])
                )

                if (clipped) {

                    clipped.properties.crop =
                        allPoints.features[i].properties.crop

                    zones.push(clipped)

                }

            } catch (e) { }

        })

        return zones

    }

    function getPartitionedPolygons() {

        if (!selectedGeo || !prediction) return []

        const rice = parseFloat(prediction.rice)
        const maize = parseFloat(prediction.maize)
        const wheat = parseFloat(prediction.wheat)

        const total = rice + maize + wheat

        const riceRatio = rice / total
        const maizeRatio = maize / total
        const wheatRatio = wheat / total

        const bbox = turf.bbox(selectedGeo)

        const minX = bbox[0]
        const minY = bbox[1]
        const maxX = bbox[2]
        const maxY = bbox[3]

        const width = maxX - minX

        const riceEnd = minX + width * riceRatio
        const maizeEnd = riceEnd + width * maizeRatio

        const riceBox = turf.bboxPolygon([minX, minY, riceEnd, maxY])
        const maizeBox = turf.bboxPolygon([riceEnd, minY, maizeEnd, maxY])
        const wheatBox = turf.bboxPolygon([maizeEnd, minY, maxX, maxY])

        /* SAFE INTERSECTION */

        let ricePart = null
        let maizePart = null
        let wheatPart = null

        try {
            ricePart = turf.intersect(riceBox, selectedGeo)
        } catch (e) { }

        try {
            maizePart = turf.intersect(maizeBox, selectedGeo)
        } catch (e) { }

        try {
            wheatPart = turf.intersect(wheatBox, selectedGeo)
        } catch (e) { }

        return [
            { geo: ricePart, color: "#16a34a" },
            { geo: maizePart, color: "#eab308" },
            { geo: wheatPart, color: "#2563eb" }
        ]

    }



    return (

        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 space-y-6">

            {/* HOME BUTTON */}

            <Link
                to="/home"
                className="fixed top-6 left-6 z-[2000] bg-white shadow-lg rounded-full p-3 hover:bg-green-50 transition"
            >
                <Home size={22} className="text-green-700" />
            </Link>

            {/* ================= UPPER SECTION ================= */}

            <div className="grid grid-cols-12 gap-6 items-start">

                {/* ================= LEFT PANEL ================= */}

                <div className="col-span-4">

                    <div className="bg-white shadow-2xl rounded-3xl p-6 h-full overflow-y-auto border">

                        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
                            Crop Yield Intelligence
                        </h2>

                        {/* FORM */}

                        <div className="space-y-4">

                            <select
                                value={state}
                                onChange={(e) => {
                                    setState(e.target.value)
                                    setDistrict("")
                                }}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
                            >

                                <option>Select State</option>

                                {states.map((s, i) => (
                                    <option key={i}>{s}</option>
                                ))}

                            </select>

                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
                            >

                                <option>Select District</option>

                                {districts.map((d, i) => (
                                    <option key={i}>{d}</option>
                                ))}

                            </select>

                            <select
                                value={season}
                                onChange={(e) => setSeason(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
                            >

                                <option value="">Select Season</option>

                                <option value="kharif">Kharif</option>
                                <option value="rabi">Rabi</option>
                                <option value="summer">Summer</option>
                                <option value="winter">Winter</option>
                                <option value="autumn">Autumn</option>

                            </select>

                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
                            >

                                <option>Select Year</option>

                                {years.map((y) => (
                                    <option key={y}>{y}</option>
                                ))}

                            </select>
<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
    Geographic Coordinates
</h3>
<label className="block text-sm font-medium text-gray-700 mb-2">
    Latitude
</label>
                            <input
                                value={lat || ""}
                                placeholder="Latitude"
                                disabled
                                className="w-full p-3 border rounded-xl bg-gray-100"
                            />
<label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
    Longitude
</label>
                            <input
                                value={lon || ""}
                                placeholder="Longitude"
                                disabled
                                className="w-full p-3 border rounded-xl bg-gray-100"
                            />

                            <button
                                onClick={generatePrediction}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                            >
                                Predict Crop Yield
                            </button>

                        </div>

                        {/* ================= PREDICTION RESULT ================= */}

                        {prediction && (

                            <div className="mt-6 relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 shadow-xl">

                                <div className="bg-white rounded-3xl p-5 space-y-4">

                                    {/* TITLE */}

                                    <div className="flex items-center justify-between">

                                        <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
                                            🌾 Prediction Result
                                        </h3>

                                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                            AI Model
                                        </span>

                                    </div>

                                    {/* RECOMMENDED */}

                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-5 shadow-md">

                                        <p className="text-sm opacity-80">
                                            Recommended Crop
                                        </p>

                                        <p className="text-3xl font-bold uppercase tracking-wide mt-1">
                                            {prediction.recommended}
                                        </p>

                                    </div>

                                    {/* GRID */}

                                    <div className="grid grid-cols-3 gap-3">

                                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                                            <p className="text-xs text-gray-500">
                                                Rice
                                            </p>

                                            <p className="text-lg font-bold text-green-700">
                                                {prediction.rice.toFixed(4)} t
                                            </p>
                                        </div>

                                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                                            <p className="text-xs text-gray-500">
                                                Maize
                                            </p>

                                            <p className="text-lg font-bold text-yellow-600">
                                                {prediction.maize.toFixed(4)} t
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                                            <p className="text-xs text-gray-500">
                                                Wheat
                                            </p>

                                            <p className="text-lg font-bold text-blue-600">
                                                {prediction.wheat.toFixed(4)} t
                                            </p>
                                        </div>

                                    </div>

                                    {/* INSIGHT */}

                                    <div className="bg-gray-50 border rounded-xl p-3 text-xs text-gray-600">

                                        AI analysis suggests the highest yield
                                        potential crop based on climate, soil and
                                        seasonal data.

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

                {/* ================= RIGHT MAP ================= */}

                <div className="col-span-8">

                    <div className="w-full h-[750px] relative rounded-3xl overflow-hidden shadow-2xl border">

                        <MapContainer
                            center={[22.9734, 78.6569]}
                            zoom={5}
                            scrollWheelZoom
                            className="h-full w-full"
                        >

                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <MapClick
                                setLat={setLat}
                                setLon={setLon}
                                setState={setState}
                                setDistrict={setDistrict}
                            />

                            <ZoomToDistrict lat={lat} lon={lon} />

                            {lat && lon && (
                                <Marker position={[lat, lon]}
                                    icon={marker} />
                            )}

                            {/* BEFORE PREDICTION */}

                            {selectedGeo && !prediction && (

                                <GeoJSON
                                    key={district}
                                    data={selectedGeo}
                                    style={{
                                        color: "red",
                                        weight: 3,
                                        fillOpacity: 0.15
                                    }}
                                />

                            )}

                            {/* AFTER PREDICTION */}

                            {selectedGeo && prediction && generateVoronoiZones().map((zone, i) => {

                                let color = "#16a34a"

                                if (zone.properties.crop === "maize") color = "#eab308"
                                if (zone.properties.crop === "wheat") color = "#2563eb"

                                return (

                                    <GeoJSON
                                        key={i}
                                        data={zone}
                                        style={{
                                            color: color,
                                            fillColor: color,
                                            fillOpacity: 0.45,
                                            weight: 1
                                        }}
                                    />

                                )

                            })}

                            {/* DISTRICT BORDER */}

                            {selectedGeo && prediction && (

                                <GeoJSON
                                    data={selectedGeo}
                                    style={{
                                        color: "red",
                                        weight: 3,
                                        fillOpacity: 0.05
                                    }}
                                />

                            )}

                        </MapContainer>

                        {/* MAP LEGEND */}

                        {prediction && (

                            <div className="absolute top-6 right-6 bg-white shadow-xl rounded-2xl p-4 w-56 border z-[1000]">

                                <h4 className="font-semibold text-gray-700 mb-3">
                                    Yield Prediction
                                </h4>

                                <div className="flex justify-between items-center text-sm mb-2">

                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-600 rounded"></div>
                                        <span>Rice</span>
                                    </div>

                                    <span>
                                        {prediction.rice.toFixed(4)} ton
                                    </span>

                                </div>

                                <div className="flex justify-between items-center text-sm mb-2">

                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                        <span>Maize</span>
                                    </div>

                                    <span>
                                        {prediction.maize.toFixed(4)} ton
                                    </span>

                                </div>

                                <div className="flex justify-between items-center text-sm">

                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                        <span>Wheat</span>
                                    </div>

                                    <span>
                                        {prediction.wheat.toFixed(4)} ton
                                    </span>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

            {/* ================= LOWER XAI SECTION ================= */}

            {prediction && (
                <div id="prediction-report">

                    <div className="bg-white rounded-3xl shadow-2xl p-8 border">

                        <div className="flex items-center justify-between mb-8">

                            <h2 className="text-4xl font-bold text-gray-800">
                                Explainable AI Analysis
                            </h2>

                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                                SHAP + ML Explainability
                            </div>

                        </div>
                        {/* INPUT SUMMARY */}

                        {prediction?.input_summary && (

                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">

                                <h3 className="text-2xl font-bold text-blue-700 mb-4">
                                    Input Summary
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                                    <div>
                                        <p className="text-gray-500 text-sm">State</p>
                                        <p className="font-semibold">
                                            {prediction.input_summary.state}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">District</p>
                                        <p className="font-semibold">
                                            {prediction.input_summary.district}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Season</p>
                                        <p className="font-semibold">
                                            {prediction.input_summary.season}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Year</p>
                                        <p className="font-semibold">
                                            {prediction.input_summary.year}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Temperature</p>
                                        <p className="font-semibold">
                                            {prediction.input_summary.temperature} °C
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Rainfall</p>
                                        <p className="font-semibold">
                                            {prediction.input_summary.rainfall} mm
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Soil pH</p>
                                        <p className="font-semibold">
                                            {prediction.input_summary.soil_ph}
                                        </p>
                                    </div>

                                    

                                    <div>
                                        <p className="text-gray-500 text-sm">Latitude</p>
                                        <p className="font-semibold">
                                            {prediction.input_summary.latitude}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm">Longitude</p>
                                        <p className="font-semibold">
                                            {prediction.input_summary.longitude}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        )}


                        {/* IMAGE GRID */}

                        <div className="grid grid-cols-2 gap-8">

                            {/* SCATTER */}

                            {prediction?.scatter_plot && (

                                <div className="bg-gray-50 rounded-2xl p-4 shadow border">

                                    <h3 className="font-bold text-gray-700 mb-4 text-lg">
                                        Rainfall vs Yield
                                    </h3>

                                    <img
                                        src={`data:image/png;base64,${prediction.scatter_plot}`}
                                        className="w-full rounded-xl"
                                    />
                                    {prediction?.scatter_interpretation && (

                                        <div className="mt-4 bg-white border-l-4 border-cyan-500 rounded-xl p-4">

                                            <h4 className="font-semibold text-cyan-700 mb-2">
                                                Interpretation
                                            </h4>

                                            <p className="text-gray-700 whitespace-pre-line leading-7">
                                                {prediction.scatter_interpretation}
                                            </p>

                                        </div>

                                    )}
                                </div>

                            )}

                            {/* COMPARISON */}

                            {prediction?.comparison_plot && (

                                <div className="bg-gray-50 rounded-2xl p-4 shadow border">

                                    <h3 className="font-bold text-gray-700 mb-4 text-lg">
                                        Yield Comparison
                                    </h3>

                                    <img
                                        src={`data:image/png;base64,${prediction.comparison_plot}`}
                                        className="w-full rounded-xl"
                                    />
                                    {prediction?.comparison_interpretation && (

                                        <div className="mt-4 bg-white border-l-4 border-green-500 rounded-xl p-4">

                                            <h4 className="font-semibold text-green-700 mb-2">
                                                Interpretation
                                            </h4>

                                            <p className="text-gray-700 whitespace-pre-line leading-7">
                                                {prediction.comparison_interpretation}
                                            </p>

                                        </div>

                                    )}
                                </div>

                            )}

                            {/* HEATMAP */}

                            {prediction?.heatmap_plot && (

                                <div className="bg-gray-50 rounded-2xl p-4 shadow border">

                                    <h3 className="font-bold text-gray-700 mb-4 text-lg">
                                        Feature Correlation
                                    </h3>

                                    <img
                                        src={`data:image/png;base64,${prediction.heatmap_plot}`}
                                        className="w-full rounded-xl"
                                    />
                                    {prediction?.heatmap_interpretation && (

                                        <div className="mt-4 bg-white border-l-4 border-red-500 rounded-xl p-4">

                                            <h4 className="font-semibold text-red-700 mb-2">
                                                Interpretation
                                            </h4>

                                            <p className="text-gray-700 whitespace-pre-line leading-7">
                                                {prediction.heatmap_interpretation}
                                            </p>

                                        </div>

                                    )}
                                </div>

                            )}

                            {/* FORCE */}

                            {prediction?.force_plot && (

                                <div className="bg-gray-50 rounded-2xl p-4 shadow border">

                                    <h3 className="font-bold text-gray-700 mb-4 text-lg">
                                        SHAP Force Plot
                                    </h3>

                                    <img
                                        src={`data:image/png;base64,${prediction.force_plot}`}
                                        className="w-full rounded-xl"
                                    />
                                    {prediction?.force_interpretation && (

                                        <div className="mt-4 bg-white border-l-4 border-blue-500 rounded-xl p-4">

                                            <h4 className="font-semibold text-blue-700 mb-2">
                                                Interpretation
                                            </h4>

                                            <p className="text-gray-700 whitespace-pre-line leading-7">
                                                {prediction.force_interpretation}
                                            </p>

                                        </div>

                                    )}
                                </div>

                            )}

                            {/* WATERFALL */}

                            {prediction?.waterfall_plot && (

                                <div className="bg-gray-50 rounded-2xl p-4 shadow border">

                                    <h3 className="font-bold text-gray-700 mb-4 text-lg">
                                        SHAP Waterfall Plot
                                    </h3>

                                    <img
                                        src={`data:image/png;base64,${prediction.waterfall_plot}`}
                                        className="w-full rounded-xl"
                                    />
                                    {prediction?.waterfall_interpretation && (

                                        <div className="mt-4 bg-white border-l-4 border-purple-500 rounded-xl p-4">

                                            <h4 className="font-semibold text-purple-700 mb-2">
                                                Interpretation
                                            </h4>

                                            <p className="text-gray-700 whitespace-pre-line leading-7">
                                                {prediction.waterfall_interpretation}
                                            </p>

                                        </div>

                                    )}
                                </div>

                            )}

                            {/* BAR */}

                            {prediction?.bar_plot && (

                                <div className="bg-gray-50 rounded-2xl p-4 shadow border">

                                    <h3 className="font-bold text-gray-700 mb-4 text-lg">
                                        Feature Importance
                                    </h3>

                                    <img
                                        src={`data:image/png;base64,${prediction.bar_plot}`}
                                        className="w-full rounded-xl"
                                    />
                                    {prediction?.bar_interpretation && (

                                        <div className="mt-4 bg-white border-l-4 border-orange-500 rounded-xl p-4">

                                            <h4 className="font-semibold text-orange-700 mb-2">
                                                Interpretation
                                            </h4>

                                            <p className="text-gray-700 whitespace-pre-line leading-7">
                                                {prediction.bar_interpretation}
                                            </p>

                                        </div>

                                    )}
                                </div>

                            )}

                        </div>
                        {/* FINAL RECOMMENDATION */}

                        {prediction?.final_recommendation && (

                            <div className="mt-10 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-2xl p-6 shadow">

                                <h3 className="text-2xl font-bold text-green-700 mb-4">
                                    🌾 Final Recommendation
                                </h3>

                                <p className="text-gray-700 whitespace-pre-line leading-8">
                                    {prediction.final_recommendation}
                                </p>

                            </div>

                        )}
                        {/* AI TEXT */}

                        {prediction?.ai_explanation && (

                            <div className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-6">

                                <h3 className="text-2xl font-bold text-green-700 mb-3">
                                    AI Agronomic Insight
                                </h3>

                                <p className="text-gray-700 whitespace-pre-line leading-8">
                                    {prediction.ai_explanation}
                                </p>

                            </div>

                        )}
                        <div
                            id="ignore-pdf" className="flex justify-center mt-10">

                            <button
                                onClick={downloadReport}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300"
                            >
                                📄 Download Prediction Report
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>

    )
}
export default GeoPrediction

