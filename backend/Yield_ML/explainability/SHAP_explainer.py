import matplotlib
matplotlib.use("Agg")

import shap
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
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
# LOAD MODELS
# ===============================

xgb_rice = joblib.load(
    os.path.join(MODEL_DIR, "xgb_rice.pkl")
)

xgb_wheat = joblib.load(
    os.path.join(MODEL_DIR, "xgb_wheat.pkl")
)

xgb_maize = joblib.load(
    os.path.join(MODEL_DIR, "xgb_maize.pkl")
)

# ===============================
# LOAD DATASET
# ===============================

df = pd.read_csv(DATA_PATH)

# numeric conversions
df["temperature"] = pd.to_numeric(
    df["temperature"],
    errors="coerce"
)

if "pH" in df.columns:

    df["pH"] = pd.to_numeric(
        df["pH"],
        errors="coerce"
    )

if "ph" in df.columns:

    df["ph"] = pd.to_numeric(
        df["ph"],
        errors="coerce"
    )

df["seasonal_rainfall"] = pd.to_numeric(
    df["seasonal_rainfall"],
    errors="coerce"
)

# ===============================
# CONVERT PLOT TO BASE64
# ===============================

def plot_to_base64():

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

    if recommended == "rice":

        return xgb_rice

    elif recommended == "wheat":

        return xgb_wheat

    else:

        return xgb_maize

# ===============================
# EXPLAIN PREDICTION
# ===============================

def explain_prediction(data, recommended, prediction):

    try:

        # ===============================
        # CREATE INPUT
        # ===============================

        inp = create_input(data)

        print("\n========== INPUT DEBUG ==========")
        print(inp)

        inp = clean_input(inp)

        model = get_model(recommended)

        print("\n===== FINAL INPUT CHECK =====")
        print(inp)
        print(inp.dtypes)

        # ===============================
        # SHAP EXPLAINER
        # ===============================

        booster = model.get_booster()

        explainer = shap.TreeExplainer(booster)

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

        # ===============================
        # FEATURE IMPORTANCE
        # ===============================

        shap.summary_plot(
            shap_values,
            inp,
            plot_type="bar",
            show=False
        )

        bar_plot = plot_to_base64()

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
            annot=True,
            cmap="coolwarm"
        )

        plt.title(
            "Agronomic Feature Correlation"
        )

        heatmap_plot = plot_to_base64()

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

        return {

            "force_plot": force_plot,
            "waterfall_plot": waterfall_plot,
            "bar_plot": bar_plot,

            "scatter_plot": scatter_plot,
            "comparison_plot": comparison_plot,
            "heatmap_plot": heatmap_plot,

            "ai_explanation": explanation_text
        }

    except Exception as e:

        print("SHAP Error:", e)

        return {

            "force_plot": None,
            "waterfall_plot": None,
            "bar_plot": None,

            "scatter_plot": None,
            "comparison_plot": None,
            "heatmap_plot": None,

            "ai_explanation": None
        }