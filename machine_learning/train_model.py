import pandas as pd
import pickle
from prophet import Prophet

# Load dataset
file_path = "D:/FYP/dr_app/machine_learning/Data.xlsx"
df = pd.read_excel(file_path, sheet_name="Data")

# Convert Date column to datetime
df['Date'] = pd.to_datetime(df['Date'])
df['Month-Year'] = df['Date'].dt.to_period('M')

# Aggregate data by Month-Year and Disease
agg_data = df.groupby(['Month-Year', 'Disease'])['Disease_Count'].sum().reset_index()
agg_data['Month-Year'] = pd.to_datetime(agg_data['Month-Year'].astype(str))

# Prepare data for Prophet
models = {}
metrics = []

for disease in agg_data['Disease'].unique():
    disease_df = agg_data[agg_data['Disease'] == disease][['Month-Year', 'Disease_Count']]
    disease_df.columns = ['ds', 'y']
    


    # Ensure enough data points
    if len(disease_df) < 2:
        continue
    
    # train_size = int(0.8 * len(disease_df))
    # train_df = disease_df.iloc[:train_size]
    # test_df = disease_df.iloc[train_size:]
    
    # if test_df.empty:
    #     continue

    # Train Prophet model
    model = Prophet()
    model.fit(disease_df)
    
    # Predict future 12 months
    future = model.make_future_dataframe(periods=12, freq='M')
    forecast = model.predict(future)
    
    # Store trained model
    models[disease] = model

# Save trained models
with open("seasonal_disease_models.pkl", "wb") as f:
    pickle.dump(models, f)

print("Model training complete. Models saved as 'seasonal_disease_models.pkl'.")
