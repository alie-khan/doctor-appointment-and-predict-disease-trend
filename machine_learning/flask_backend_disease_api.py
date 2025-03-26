from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained models
try:
    with open("seasonal_disease_models.pkl", "rb") as f:
        models = pickle.load(f)
    print(" Models loaded successfully!")
except Exception as e:
    print(f"⚠️ Error loading models: {e}")
    models = {}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("📩 Received Request:", data)

        disease = data.get('disease')
        if not disease:
            print("⚠️ Error: Disease name is missing in request")
            return jsonify({"error": "Disease name is missing"}), 400
        
        if disease not in models:
            print(f"⚠️ Error: Disease '{disease}' not found in trained models.")
            return jsonify({"error": f"Disease '{disease}' not found in trained models"}), 400

        model = models[disease]

        future_dates = pd.date_range(start=pd.Timestamp.today(), periods=12, freq='M')
        future = pd.DataFrame({'ds': future_dates})
        
        forecast = model.predict(future)
        predictions = forecast[['ds', 'yhat']].to_dict(orient='records')

        print("✅ Prediction successful:", predictions[:3])  # Print first 3 predictions

        return jsonify(predictions)

    except Exception as e:
        print(f"⚠️ Server Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
