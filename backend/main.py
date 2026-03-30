from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# Notice: google.generativeai has been completely removed

app = FastAPI()

# Enable Cross-Origin requests for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# 1. Load the Vision Engine (DenseNet-121)
print("Loading Vision Model...")
vision_model = tf.keras.models.load_model('pneumonia_densenet_model.h5')


def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.post("/predict")
async def predict_xray(file: UploadFile = File(...)):
    # Memory-safe image processing (No disk writing)
    processed_image = preprocess_image(await file.read())
    
    # 100% Local Model Prediction
    prediction_score = vision_model.predict(processed_image)[0][0]
    
    diagnosis = "Pneumonia Detected" if prediction_score > 0.5 else "Normal"
    confidence = float(prediction_score * 100) if prediction_score > 0.5 else float((1 - prediction_score) * 100)

    # Static Pre-written Reports (Replacing the Gemini API)
    if diagnosis == "Pneumonia Detected":
        report_text = (
            "Clinical Summary: The radiographic findings are consistent with pulmonary consolidation, "
            "indicating a high probability of Pneumonia.\n\n"
            "Recommended Next Steps:\n"
            "1. Correlate with clinical symptoms (fever, cough) and consider broad-spectrum antibiotic therapy.\n"
            "2. Recommend a lateral view X-ray to monitor the progression of the infiltrates.\n\n"
            "Disclaimer: This is an AI-assisted preliminary diagnostic draft generated solely by a local DenseNet-121 "
            "computer vision model and must be validated by a licensed physician."
        )
    else:
        report_text = (
            "Clinical Summary: The radiographic findings show clear lung fields with no significant opacities "
            "or signs of pulmonary consolidation. The presentation is Normal.\n\n"
            "Recommended Next Steps:\n"
            "1. No acute pulmonary intervention is required based on this radiograph.\n"
            "2. Continue routine clinical observation if the patient remains symptomatic.\n\n"
            "Disclaimer: This is an AI-assisted preliminary diagnostic draft generated solely by a local DenseNet-121 "
            "computer vision model and must be validated by a licensed physician."
        )

    # Returns the exact same JSON format the React frontend expects
    return {"prediction": diagnosis, "confidence": round(confidence, 2), "report": report_text}