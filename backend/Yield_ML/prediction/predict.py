import os
import joblib
import numpy as np

from prediction.preprocess import create_input

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

rf_rice = joblib.load(os.path.join(MODEL_DIR, "rf_rice.pkl"))
rf_wheat = joblib.load(os.path.join(MODEL_DIR, "rf_wheat.pkl"))
rf_maize = joblib.load(os.path.join(MODEL_DIR, "rf_maize.pkl"))

xgb_rice = joblib.load(os.path.join(MODEL_DIR, "xgb_rice.pkl"))
xgb_wheat = joblib.load(os.path.join(MODEL_DIR, "xgb_wheat.pkl"))
xgb_maize = joblib.load(os.path.join(MODEL_DIR, "xgb_maize.pkl"))

def ensemble(rf,xgb,X):
    return (rf.predict(X) + xgb.predict(X)) / 2

def predict_crop(data):

    inp = create_input(data)

    rice = ensemble(rf_rice, xgb_rice, inp)[0]
    wheat = ensemble(rf_wheat, xgb_wheat, inp)[0]
    maize = ensemble(rf_maize, xgb_maize, inp)[0]

    yields = {
        "rice": float(rice),
        "wheat": float(wheat),
        "maize": float(maize)
    }

    recommended = max(yields, key=yields.get)

    yields["recommended"] = recommended

    return yields