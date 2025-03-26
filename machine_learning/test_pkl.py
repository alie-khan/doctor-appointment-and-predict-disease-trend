import pickle

# Load trained models
with open("seasonal_disease_models.pkl", "rb") as f:
    models = pickle.load(f)

# Print available diseases in the model
print("✅ Available diseases in trained models:", list(models.keys()))
