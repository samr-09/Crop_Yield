import os
import joblib

from prediction.preprocess import create_input

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# Cache for models
MODELS = None


def load_models():
    global MODELS

    if MODELS is None:
        MODELS = {
            "rf_rice": joblib.load(os.path.join(MODEL_DIR, "rf_rice.pkl")),
            "rf_wheat": joblib.load(os.path.join(MODEL_DIR, "rf_wheat.pkl")),
            "rf_maize": joblib.load(os.path.join(MODEL_DIR, "rf_maize.pkl")),

            "xgb_rice": joblib.load(os.path.join(MODEL_DIR, "xgb_rice.pkl")),
            "xgb_wheat": joblib.load(os.path.join(MODEL_DIR, "xgb_wheat.pkl")),
            "xgb_maize": joblib.load(os.path.join(MODEL_DIR, "xgb_maize.pkl")),
        }

    return MODELS


def ensemble(rf, xgb, X):
    return (rf.predict(X) + xgb.predict(X)) / 2


def predict_crop(data):

    models = load_models()

    inp = create_input(data)

    rice = ensemble(models["rf_rice"], models["xgb_rice"], inp)[0]
    wheat = ensemble(models["rf_wheat"], models["xgb_wheat"], inp)[0]
    maize = ensemble(models["rf_maize"], models["xgb_maize"], inp)[0]

    yields = {
        "rice": float(rice),
        "wheat": float(wheat),
        "maize": float(maize)
    }

    recommended = max(yields, key=yields.get)
    yields["recommended"] = recommended

    return yields