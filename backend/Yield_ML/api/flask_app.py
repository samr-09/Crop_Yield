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

    data = request.json

    prediction = predict_crop(data)

    explanation = explain_prediction(data, prediction["recommended"], prediction)

    response = {

        "rice": prediction["rice"],
        "wheat": prediction["wheat"],
        "maize": prediction["maize"],
        "recommended": prediction["recommended"],

        "force_plot": explanation["force_plot"],
        "waterfall_plot": explanation["waterfall_plot"],
        "bar_plot": explanation["bar_plot"],

        "scatter_plot": explanation["scatter_plot"],
        "comparison_plot": explanation["comparison_plot"],
        "heatmap_plot": explanation["heatmap_plot"],

        "ai_explanation": explanation["ai_explanation"]
    }

    return jsonify(response)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)