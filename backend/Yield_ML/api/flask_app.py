import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask, request, jsonify
from flask_cors import CORS

from prediction.predict import predict_crop
from explainability.SHAP_explainer import explain_prediction

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def home():
    return jsonify({
        "status": "running",
        "message": "Crop Yield Prediction API is live"
    })

@app.route("/health")
def health():
    return jsonify({
        "status": "ok"
    })


@app.route("/predict", methods=["POST"])
def predict():
    print("STEP 1", flush=True)
    data = request.json
    print("STEP 2", flush=True)
    prediction = predict_crop(data)
    print("STEP 3", flush=True)
    explanation = explain_prediction(data, prediction["recommended"], prediction)
    print("STEP 4", flush=True)
    response = {

    "rice": prediction["rice"],
    "wheat": prediction["wheat"],
    "maize": prediction["maize"],
    "recommended": prediction["recommended"],

    # -------------------------
    # NEW XAI FIELDS
    # -------------------------

    "input_summary": explanation["input_summary"],
    "prediction_summary": explanation["prediction_summary"],

    "force_plot": explanation["force_plot"],
    "force_interpretation": explanation["force_interpretation"],

    "waterfall_plot": explanation["waterfall_plot"],
    "waterfall_interpretation": explanation["waterfall_interpretation"],

    "bar_plot": explanation["bar_plot"],
    "bar_interpretation": explanation["bar_interpretation"],

    "scatter_plot": explanation["scatter_plot"],
    "scatter_interpretation": explanation["scatter_interpretation"],

    "comparison_plot": explanation["comparison_plot"],
    "comparison_interpretation": explanation["comparison_interpretation"],

    "heatmap_plot": explanation["heatmap_plot"],
    "heatmap_interpretation": explanation["heatmap_interpretation"],

    # "counterfactual_plot": explanation["counterfactual_plot"],
    # "counterfactual_interpretation": explanation["counterfactual_interpretation"],

    "final_recommendation": explanation["final_recommendation"],

    "ai_explanation": explanation["ai_explanation"]
}
    print("STEP 5", flush=True)
    return jsonify(response)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)