import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor

# ======================
# LOAD DATASET
# ======================

df = pd.read_csv("../dataset/final_data_for_crop_yield_new.csv")

df.columns = df.columns.str.lower().str.strip().str.replace(" ", "_")
df["season"] = df["season"].str.strip().str.lower()

df = df.drop(columns=["unnamed:_10"], errors="ignore")

for col in df.select_dtypes(include="object").columns:
    df[col] = df[col].str.lower().str.strip()
    df[col] = df[col].str.replace(" ", "_")

df = df.dropna(subset=["rice_area", "rice_production"], how="all")
df = df.fillna(df.median(numeric_only=True))

# ======================
# CALCULATE YIELDS
# ======================

df["rice_yield"] = df["rice_production"] / df["rice_area"]
df["wheat_yield"] = df["wheat_production"] / df["wheat_area"]
df["maize_yield"] = df["maize_production"] / df["maize_area"]

# ======================
# LABEL ENCODERS
# ======================

le_state = LabelEncoder()
le_district = LabelEncoder()
le_season = LabelEncoder()
le_soil = LabelEncoder()

df["state"] = le_state.fit_transform(df["state"])
df["district"] = le_district.fit_transform(df["district"])
df["season"] = le_season.fit_transform(df["season"])
df["soil_type"] = le_soil.fit_transform(df["soil_type"])

joblib.dump(le_state, "../utils/state_encoder.pkl")
joblib.dump(le_district, "../utils/district_encoder.pkl")
joblib.dump(le_season, "../utils/season_encoder.pkl")
joblib.dump(le_soil, "../utils/soil_encoder.pkl")

# ======================
# FEATURES
# ======================

features = [
    "latitude",
    "longitude",
    "year",
    "season",
    "temperature",
    "soil_type",
    "ph",
    "seasonal_rainfall"
]

X = df[features]

y_rice = df["rice_yield"]
y_wheat = df["wheat_yield"]
y_maize = df["maize_yield"]

X_train, X_test, y_rice_train, y_rice_test = train_test_split(
    X,
    y_rice,
    test_size=0.2,
    random_state=42
)

y_wheat_train = y_wheat.loc[X_train.index]
y_maize_train = y_maize.loc[X_train.index]

# ======================
# RANDOM FOREST
# (Optimized for deployment)
# ======================

rf_params = {
    "n_estimators": 100,
    "max_depth": 15,
    "min_samples_leaf": 2,
    "random_state": 42,
    "n_jobs": -1
}

rf_rice = RandomForestRegressor(**rf_params)
rf_wheat = RandomForestRegressor(**rf_params)
rf_maize = RandomForestRegressor(**rf_params)

# ======================
# XGBOOST
# ======================

xgb_params = {
    "n_estimators": 300,
    "learning_rate": 0.05,
    "max_depth": 6,
    "tree_method": "hist",
    "random_state": 42,
    "n_jobs": -1
}

xgb_rice = XGBRegressor(**xgb_params)
xgb_wheat = XGBRegressor(**xgb_params)
xgb_maize = XGBRegressor(**xgb_params)

# ======================
# TRAIN
# ======================

print("Training Random Forest models...")

rf_rice.fit(X_train, y_rice_train)
rf_wheat.fit(X_train, y_wheat_train)
rf_maize.fit(X_train, y_maize_train)

print("Training XGBoost models...")

xgb_rice.fit(X_train, y_rice_train)
xgb_wheat.fit(X_train, y_wheat_train)
xgb_maize.fit(X_train, y_maize_train)

# ======================
# SAVE MODELS
# ======================

print("Saving models...")

joblib.dump(rf_rice, "../models/rf_rice.pkl", compress=3)
joblib.dump(rf_wheat, "../models/rf_wheat.pkl", compress=3)
joblib.dump(rf_maize, "../models/rf_maize.pkl", compress=3)

joblib.dump(xgb_rice, "../models/xgb_rice.pkl", compress=3)
joblib.dump(xgb_wheat, "../models/xgb_wheat.pkl", compress=3)
joblib.dump(xgb_maize, "../models/xgb_maize.pkl", compress=3)

print("\nTraining completed successfully!\n")

print("Saved model sizes:")

for model in [
    "rf_rice.pkl",
    "rf_wheat.pkl",
    "rf_maize.pkl",
    "xgb_rice.pkl",
    "xgb_wheat.pkl",
    "xgb_maize.pkl"
]:
    size = os.path.getsize(f"../models/{model}") / (1024 * 1024)
    print(f"{model:<15} {size:.2f} MB")