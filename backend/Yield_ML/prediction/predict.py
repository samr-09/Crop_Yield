import os
import joblib

from prediction.preprocess import create_input

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# ==========================
# MODEL CACHE
# ==========================

MODELS = {}


def get_model(model_name):
    """
    Lazy-load model only when required.
    """

    global MODELS

    if model_name not in MODELS:

        print(f"Loading {model_name}...", flush=True)

        MODELS[model_name] = joblib.load(
            os.path.join(MODEL_DIR, f"{model_name}.pkl")
        )

    return MODELS[model_name]


# ==========================
# ENSEMBLE
# ==========================

def ensemble(rf_model, xgb_model, X):

    rf_pred = rf_model.predict(X)

    xgb_pred = xgb_model.predict(X)

    return (rf_pred + xgb_pred) / 2


# ==========================
# PREDICT
# ==========================

def predict_crop(data):

    print("PREDICT START", flush=True)

    inp = create_input(data)

    print("INPUT READY", flush=True)

    # ---------------- Rice ----------------

    rf_rice = get_model("rf_rice")
    print("RF RICE READY", flush=True)

    xgb_rice = get_model("xgb_rice")
    print("XGB RICE READY", flush=True)

    rice = ensemble(
        rf_rice,
        xgb_rice,
        inp
    )[0]

    # ---------------- Wheat ----------------

    rf_wheat = get_model("rf_wheat")
    print("RF WHEAT READY", flush=True)

    xgb_wheat = get_model("xgb_wheat")
    print("XGB WHEAT READY", flush=True)

    wheat = ensemble(
        rf_wheat,
        xgb_wheat,
        inp
    )[0]

    # ---------------- Maize ----------------

    rf_maize = get_model("rf_maize")
    print("RF MAIZE READY", flush=True)

    xgb_maize = get_model("xgb_maize")
    print("XGB MAIZE READY", flush=True)

    maize = ensemble(
        rf_maize,
        xgb_maize,
        inp
    )[0]

    print("ALL PREDICTIONS DONE", flush=True)

    yields = {
        "rice": float(rice),
        "wheat": float(wheat),
        "maize": float(maize)
    }

    recommended = max(yields, key=yields.get)

    yields["recommended"] = recommended

    print("PREDICT END", flush=True)

    return yields