import pandas as pd
import joblib

# ===============================
# LOAD ENCODERS
# ===============================

state_encoder = joblib.load("../utils/state_encoder.pkl")
district_encoder = joblib.load("../utils/district_encoder.pkl")
season_encoder = joblib.load("../utils/season_encoder.pkl")
soil_encoder = joblib.load("../utils/soil_encoder.pkl")

# ===============================
# LOAD DATASET
# ===============================

df = pd.read_csv("../dataset/final_data_for_crop_yield_new.csv")

df["state"] = df["state"].str.strip().str.lower().str.replace(" ", "_")
df["district"] = df["district"].str.strip().str.lower().str.replace(" ", "_")
df["season"] = df["season"].str.strip().str.lower().str.replace(" ", "_")
df["soil_type"] = df["soil_type"].str.strip().str.lower().str.replace(" ", "_")

# ===============================
# CREATE INPUT
# ===============================

def create_input(data):

    state_name = data["state"].strip().lower().replace(" ", "_")
    district_name = data["district"].strip().lower().replace(" ", "_")
    season_name = data["season"].strip().lower().replace(" ", "_")

    # encode values
    season = season_encoder.transform([season_name])[0]

    # find district row
    rows = df[df["district"] == district_name]

    if rows.empty:
        raise ValueError(f"District not found: {district_name}")

    row = rows.iloc[0]

    soil = soil_encoder.transform([row["soil_type"]])[0]

    # IMPORTANT: only features used during training
    inp = pd.DataFrame([{
        "latitude": row["latitude"],
        "longitude": row["longitude"],
        "year": data["year"],
        "season": season,
        "temperature": row["temperature"],
        "soil_type": soil,
        "ph": row["pH"],
        "seasonal_rainfall": row["seasonal_rainfall"]
    }])

    return inp