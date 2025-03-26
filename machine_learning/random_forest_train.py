import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Load dataset
file_path = "D:/FYP/dr_app/machine_learning/Data.xlsx"
df = pd.read_excel(file_path, sheet_name="Data")

print("📊 Available Columns:", df.columns.tolist())

# Ensure correct names
df.rename(columns={'temp': 'Temperature', 'hum': 'Humidity'}, inplace=True)

# Validate columns exist
required_features = ['Temperature', 'Humidity']
missing_features = [col for col in required_features if col not in df.columns]

if missing_features:
    print(f"⚠️ Missing columns: {missing_features}")
else:
    X = df[required_features]
    print("✅ Dataframe is ready for model training!")

# Convert Date column to datetime and extract features
df['Date'] = pd.to_datetime(df['Date'])
df['Month'] = df['Date'].dt.month
df['Year'] = df['Date'].dt.year

# Encode Disease labels
le = LabelEncoder()
df['Disease_Label'] = le.fit_transform(df['Disease'])

# Select features and target
features = ['Month', 'Year', 'Temperature', 'Humidity']  # Add more relevant features
X = df[features]
y = df['Disease_Label']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save trained model
with open("random_forest_disease_model.pkl", "wb") as f:
    pickle.dump((model, le), f)

print("Model training complete. Model saved as 'random_forest_disease_model.pkl'.")
