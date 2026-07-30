print("########################")
print("NEW SHAP VERSION RUNNING")
print("########################")
import matplotlib


matplotlib.use("Agg")

import matplotlib.pyplot as plt

import numpy as np
import joblib
import gc

import pandas as pd
import base64
from io import BytesIO
import os



from prediction.preprocess import create_input

# ===============================
# BASE PATHS
# ===============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_DIR = os.path.join(BASE_DIR, "models")

DATA_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "final_data_for_crop_yield_new.csv"
)

# ===============================
# MODEL CACHE
# ===============================

MODELS = None
EXPLAINERS = {}

def load_models():

    global MODELS

    if MODELS is None:

        MODELS = {

            "rice": joblib.load(
                os.path.join(MODEL_DIR, "xgb_rice.pkl")
            ),

            "wheat": joblib.load(
                os.path.join(MODEL_DIR, "xgb_wheat.pkl")
            ),

            "maize": joblib.load(
                os.path.join(MODEL_DIR, "xgb_maize.pkl")
            )
        }

    return MODELS

# ===============================
# DATASET CACHE
# ===============================

DF = None


def get_dataset():

    global DF

    if DF is None:

        DF = pd.read_csv(DATA_PATH)

        DF["temperature"] = pd.to_numeric(
            DF["temperature"],
            errors="coerce"
        )

        if "pH" in DF.columns:

            DF["pH"] = pd.to_numeric(
                DF["pH"],
                errors="coerce"
            )

        if "ph" in DF.columns:

            DF["ph"] = pd.to_numeric(
                DF["ph"],
                errors="coerce"
            )

        DF["seasonal_rainfall"] = pd.to_numeric(
            DF["seasonal_rainfall"],
            errors="coerce"
        )

    return DF


# ===============================
# CONVERT PLOT TO BASE64
# ===============================

def plot_to_base64():
    import matplotlib.pyplot as plt

    buffer = BytesIO()

    plt.savefig(
        buffer,
        format="png",
        bbox_inches="tight"
    )

    buffer.seek(0)

    img_base64 = base64.b64encode(
        buffer.read()
    ).decode("utf-8")

    buffer.close()

    plt.close()

    return img_base64

# ===============================
# CLEAN INPUT
# ===============================

def clean_input(inp):

    for col in inp.columns:

        val = inp[col].iloc[0]

        if isinstance(val, str):

            val = (
                val.replace("[", "")
                .replace("]", "")
            )

        if isinstance(val, (list, np.ndarray)):

            val = val[0]

        try:

            inp[col] = float(val)

        except:

            inp[col] = 0.0

    return inp.astype(float)

# ===============================
# SELECT MODEL
# ===============================

def get_model(recommended):

    models = load_models()

    return models[recommended]
def get_explainer(recommended):

    global EXPLAINERS

    if recommended not in EXPLAINERS:

        booster = get_model(recommended).get_booster()

        import shap
        EXPLAINERS[recommended] = shap.TreeExplainer(booster)

    return EXPLAINERS[recommended]

def format_value(value, digits=2):

    try:
        return round(float(value), digits)
    except:
        return value

def get_soil_ph(inp):

    if "ph" in inp.columns:
        return float(inp.iloc[0]["ph"])

    if "pH" in inp.columns:
        return float(inp.iloc[0]["pH"])

    return None
def percentage_difference(a, b):

    if b == 0:
        return 0

    return ((a - b) / b) * 100
def rank_shap_features(sample_shap, feature_names):

    features = []

    for name, value in zip(feature_names, sample_shap):

        features.append({

            "feature": name,

            "value": float(value),

            "abs_value": abs(float(value))
        })

    features.sort(

        key=lambda x: x["abs_value"],

        reverse=True
    )

    return features
def get_positive_features(ranked):

    return [

        f for f in ranked

        if f["value"] > 0
    ]
def get_negative_features(ranked):

    return [

        f for f in ranked

        if f["value"] < 0
    ]
def generate_input_summary(inp, data):

    soil_ph = get_soil_ph(inp)

    return {

        "state": data["state"],

        "district": data["district"],

        "season": data["season"],

        "year": data["year"],

        "temperature": format_value(
            inp.iloc[0]["temperature"]
        ),

        "rainfall": format_value(
            inp.iloc[0]["seasonal_rainfall"]
        ),

        "soil_ph": format_value(
            soil_ph
        ),

        

        "latitude": format_value(
            inp.iloc[0]["latitude"],4
        ),

        "longitude": format_value(
            inp.iloc[0]["longitude"],4
        )
    }
def generate_prediction_summary(prediction, recommended):

    rice = prediction["rice"]

    wheat = prediction["wheat"]

    maize = prediction["maize"]

    highest = prediction[recommended]

    return {

        "recommended_crop": recommended.upper(),

        "predicted_yield": format_value(highest),

        "rice_yield": format_value(rice),

        "wheat_yield": format_value(wheat),

        "maize_yield": format_value(maize),

        "rice_difference": format_value(
            percentage_difference(
                highest,
                rice
            )
        ),

        "wheat_difference": format_value(
            percentage_difference(
                highest,
                wheat
            )
        ),

        "maize_difference": format_value(
            percentage_difference(
                highest,
                maize
            )
        )
    }
def generate_force_interpretation(
    positive_features,
    negative_features,
    prediction_summary
):

    text = (
        f"The model recommends "
        f"{prediction_summary['recommended_crop']} "
        f"with an estimated yield of "
        f"{prediction_summary['predicted_yield']} t/ha.\n\n"
    )
    if positive_features:
        text += "Positive contributors:\n"

        for f in positive_features[:3]:

            text += (
                f"• {f['feature']} "
                f"(SHAP = +{abs(f['value']):.3f})\n"
            )
    if negative_features:
        text += "\nNegative contributors:\n"
        for f in negative_features[:2]:
            text += (
                f"• {f['feature']} "
                f"(SHAP = -{abs(f['value']):.3f})\n"
            )
    return text
def generate_waterfall_interpretation(
    positive_features,
    negative_features
):

    text = (
        "The waterfall plot starts from the model's baseline prediction. "
    )

    if positive_features:

        text += (
            f"The largest increase comes from "
            f"{positive_features[0]['feature']}. "
        )

    if negative_features:

        text += (
            f"The strongest reducing factor is "
            f"{negative_features[0]['feature']}. "
        )

    text += (
        "The final prediction is obtained after combining all positive "
        "and negative SHAP contributions."
    )

    return text
def generate_bar_interpretation(ranked):

    text = "Most influential features:\n\n"

    for i, f in enumerate(ranked[:5], start=1):

        text += (
            f"{i}. {f['feature']} "
            f"(Importance = {abs(f['value']):.3f})\n"
        )

    return text
def generate_scatter_interpretation(inp):

    rainfall = float(
        inp.iloc[0]["seasonal_rainfall"]
    )

    return (
        f"The entered seasonal rainfall is "
        f"{rainfall:.2f} mm. "
        "The scatter plot helps compare this rainfall "
        "with historical yield observations."
    )
def generate_heatmap_interpretation():

    return (
        "The correlation heatmap illustrates the relationships "
        "among agronomic variables. Strong positive or negative "
        "correlations indicate that changes in one feature are "
        "associated with changes in another."
    )
def generate_comparison_interpretation(
    prediction_summary
):

    crop = prediction_summary["recommended_crop"]

    yield_value = prediction_summary["predicted_yield"]

    return (
        f"{crop} has the highest predicted yield "
        f"({yield_value} t/ha) among all candidate crops, "
        "therefore it is selected as the recommended crop."
    )
def generate_final_recommendation(
    prediction_summary,
    positive_features
):

    crop = prediction_summary["recommended_crop"]

    text = (
        f"Recommended Crop: {crop}\n\n"
    )

    text += (
        f"Predicted Yield: "
        f"{prediction_summary['predicted_yield']} t/ha\n\n"
    )

    text += "Key supporting factors:\n"

    for f in positive_features[:3]:

        text += (
            f"✓ {f['feature']} "
            f"(SHAP = +{abs(f['value']):.3f})\n"
        )

    return text
def generate_counterfactual(inp, recommended):

    model = get_model(recommended)

    current = inp.copy()

    current_prediction = float(model.predict(current)[0])

    best_prediction = current_prediction
    best_input = current.copy()

    temp0 = float(current.iloc[0]["temperature"])
    rain0 = float(current.iloc[0]["seasonal_rainfall"])
    ph0 = float(current.iloc[0]["ph"])

    temperatures = np.arange(temp0 - 2, temp0 + 2.1, 0.5)
    rainfalls = np.arange(max(0, rain0 - 50), rain0 + 51, 10)
    ph_values = np.arange(
        max(4.5, ph0 - 0.5),
        min(8.5, ph0 + 0.51),
        0.1
    )

    for t in temperatures:

        for r in rainfalls:

            for p in ph_values:

                candidate = current.copy()

                candidate.loc[:, "temperature"] = t
                candidate.loc[:, "seasonal_rainfall"] = r
                candidate.loc[:, "ph"] = p

                pred = float(model.predict(candidate)[0])

                if pred > best_prediction:

                    best_prediction = pred
                    best_input = candidate.copy()

    plt.figure(figsize=(6,4))

    labels = ["Temperature", "Soil pH", "Rainfall"]

    before = [
        temp0,
        ph0,
        rain0
    ]

    after = [
        float(best_input.iloc[0]["temperature"]),
        float(best_input.iloc[0]["ph"]),
        float(best_input.iloc[0]["seasonal_rainfall"])
    ]

    x = np.arange(len(labels))
    width = 0.35

    plt.bar(x - width/2, before, width, label="Current")
    plt.bar(x + width/2, after, width, label="Suggested")

    plt.xticks(x, labels)
    plt.ylabel("Value")
    plt.title("Counterfactual Feature Comparison")
    plt.legend()

    plot = plot_to_base64()

    interpretation = f"""
Counterfactual analysis indicates that the predicted yield could be improved by adjusting a few controllable environmental factors.

Temperature:
{temp0:.2f} °C → {after[0]:.2f} °C

Soil pH:
{ph0:.2f} → {after[1]:.2f}

Seasonal Rainfall:
{rain0:.2f} mm → {after[2]:.2f} mm

Predicted Yield:
{current_prediction:.4f} → {best_prediction:.4f} ton/hectare
"""

    return {
        "plot": plot,
        "interpretation": interpretation
    }
# ===============================
# EXPLAIN PREDICTION
# ===============================

def explain_prediction(data, recommended, prediction):

    try:

        # ===============================
        # CREATE INPUT
        # ===============================

        import shap
        import seaborn as sns

        df = get_dataset()

        inp = create_input(data)

        print("\n========== INPUT DEBUG ==========")
        print(inp)

        inp = clean_input(inp)

        print("\n===== FINAL INPUT CHECK =====")
        print(inp)
        print(inp.dtypes)

        # ===============================
        # SHAP EXPLAINER
        # ===============================

        explainer = get_explainer(recommended)

        X = inp.values

        shap_values = explainer.shap_values(X)

        base_value = explainer.expected_value

        # regression safe fix
        if isinstance(shap_values, list):
            shap_values = shap_values[0]

        if isinstance(base_value, (list, np.ndarray)):
            base_value = base_value[0]

        sample_shap = shap_values[0]

        # ===============================
        # PREPARE INTERPRETATION DATA
        # ===============================

        ranked = rank_shap_features(
            sample_shap,
            inp.columns
        )

        positive_features = get_positive_features(
            ranked
        )

        negative_features = get_negative_features(
            ranked
        )

        input_summary = generate_input_summary(
            inp,
            data
        )

        prediction_summary = generate_prediction_summary(
            prediction,
            recommended
        )

        force_interpretation = generate_force_interpretation(
            positive_features,
            negative_features,
            prediction_summary
        )

        waterfall_interpretation = generate_waterfall_interpretation(
            positive_features,
            negative_features
        )

        bar_interpretation = generate_bar_interpretation(
            ranked
        )

        scatter_interpretation = generate_scatter_interpretation(
            inp
        )

        heatmap_interpretation = generate_heatmap_interpretation()

        comparison_interpretation = generate_comparison_interpretation(
            prediction_summary
        )

        final_recommendation = generate_final_recommendation(
            prediction_summary,
            positive_features
        )
        # ===============================
        # COUNTERFACTUAL
        # ===============================

        counterfactual = generate_counterfactual(
            inp.copy(),
            recommended
        )
        
        # ===============================
        # FORCE PLOT
        # ===============================

        shap.force_plot(
            base_value,
            sample_shap,
            X[0],
            feature_names=inp.columns,
            matplotlib=True,
            show=False
        )

        force_plot = plot_to_base64()
        print("FORCE DONE", flush=True)

        # ===============================
        # WATERFALL PLOT
        # ===============================
        shap.plots.waterfall(
            shap.Explanation(
                values=sample_shap,
                base_values=base_value,
                data=inp.iloc[0],
                feature_names=inp.columns
            ),
            show=False
        )

        waterfall_plot = plot_to_base64()
        print("WATERFALL DONE", flush=True)

        # ===============================
        # FEATURE IMPORTANCE
        # ===============================

        shap.plots.bar(
            shap.Explanation(
                values=sample_shap,
                feature_names=inp.columns
            ),
            show=False
        )

        bar_plot = plot_to_base64()
        print("BAR DONE", flush=True)

        # ===============================
        # SCATTER PLOT
        # ===============================

        plt.figure()

        if recommended == "rice":

            y = df["rice_yield"]

        elif recommended == "wheat":

            y = df["wheat_yield"]

        else:

            y = df["maize_yield"]

        sns.scatterplot(
            x=df["seasonal_rainfall"],
            y=y
        )

        plt.title(
            "Rainfall vs Yield Relationship"
        )

        plt.xlabel("Seasonal Rainfall")

        plt.ylabel("Yield")

        scatter_plot = plot_to_base64()
        print("SCATTER DONE", flush=True)

        # ===============================
        # YIELD COMPARISON
        # ===============================

        rice_pred = prediction["rice"]
        wheat_pred = prediction["wheat"]
        maize_pred = prediction["maize"]

        plt.figure()

        plt.bar(
            ["Rice", "Wheat", "Maize"],
            [rice_pred, wheat_pred, maize_pred]
        )

        plt.title(
            "Predicted Yield Comparison"
        )

        plt.ylabel("Yield")

        comparison_plot = plot_to_base64()
        print("COMPARISON DONE", flush=True)

        # ===============================
        # CORRELATION HEATMAP
        # ===============================

        plt.figure(figsize=(6, 4))

        available_features = []

        possible_features = [
            "season",
            "temperature",
            "soil_type",
            "ph",
            "pH",
            "seasonal_rainfall"
        ]

        for col in possible_features:

            if col in df.columns:

                available_features.append(col)

        corr_df = df[available_features].copy()

        # encode non numeric columns
        for col in corr_df.columns:

            if corr_df[col].dtype == "object":

                corr_df[col] = pd.factorize(
                    corr_df[col]
                )[0]

        sns.heatmap(
            corr_df.corr(),
            annot=False,
            cmap="coolwarm"
        )

        plt.title(
            "Agronomic Feature Correlation"
        )

        heatmap_plot = plot_to_base64()
        print("HEATMAP DONE", flush=True)

        # ===============================
        # AI EXPLANATION TEXT
        # ===============================

        soil_ph = None

        if "ph" in inp.columns:

            soil_ph = inp.iloc[0]["ph"]

        elif "pH" in inp.columns:

            soil_ph = inp.iloc[0]["pH"]

        explanation_text = f"""
The AI recommends {recommended.upper()} because the environmental
conditions closely match the crop requirements.

Seasonal Rainfall: {inp.iloc[0]['seasonal_rainfall']} mm
Temperature: {inp.iloc[0]['temperature']} °C
Soil pH: {soil_ph}
"""

        # ===============================
        # RETURN RESPONSE
        # ===============================
        del shap_values
        del sample_shap
        del X

        gc.collect()

        plt.close("all")
        return {

    "input_summary": input_summary,
    "prediction_summary": prediction_summary,

    "force_plot": force_plot,
    "force_interpretation": force_interpretation,

    "waterfall_plot": waterfall_plot,
    "waterfall_interpretation": waterfall_interpretation,

    "bar_plot": bar_plot,
    "bar_interpretation": bar_interpretation,

    "scatter_plot": scatter_plot,
    "scatter_interpretation": scatter_interpretation,

    "comparison_plot": comparison_plot,
    "comparison_interpretation": comparison_interpretation,

    "heatmap_plot": heatmap_plot,
    "heatmap_interpretation": heatmap_interpretation,
    "counterfactual_plot": counterfactual["plot"],
    "counterfactual_interpretation": counterfactual["interpretation"],

    "final_recommendation": final_recommendation,

    "ai_explanation": explanation_text
}
    

    except Exception as e:

        print("SHAP Error:", e)

        return {

    "input_summary": None,
    "prediction_summary": None,

    "force_plot": None,
    "force_interpretation": None,

    "waterfall_plot": None,
    "waterfall_interpretation": None,

    "bar_plot": None,
    "bar_interpretation": None,

    "scatter_plot": None,
    "scatter_interpretation": None,

    "comparison_plot": None,
    "comparison_interpretation": None,

    "heatmap_plot": None,
    "heatmap_interpretation": None,
    "counterfactual_plot": None,
    "counterfactual_interpretation": None,

    "final_recommendation": None,

    "ai_explanation": None
}
    finally:

    
        plt.close("all")

        gc.collect()