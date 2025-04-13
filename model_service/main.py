import os
import logging
import uvicorn
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from typing import Optional, Dict, Any
import random
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Crime Detection Model Service",
    description="API for analyzing video evidence to detect potential crimes",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request and response models
class VideoAnalysisRequest(BaseModel):
    video_url: str
    location: Optional[str] = None

class VideoAnalysisResponse(BaseModel):
    crime_type: str
    confidence: float
    description: str

# Global variable to track if model is loaded
model_loaded = False

@app.on_event("startup")
async def startup_event():
    """Load the model on startup"""
    global model_loaded
    try:
        # Load your model here
        logger.info("Initializing crime detection model...")
        # Placeholder for model loading
        model_loaded = load_model()
        logger.info("Crime detection model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        model_loaded = False

def load_model():
    """Load the crime detection model"""
    # Placeholder for actual model loading code
    # In a real implementation, this would load your ML model
    logger.info("Loading model weights and configuration...")
    time.sleep(2)  # Simulate model loading time
    return True

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "model_loaded": model_loaded
    }

@app.post("/analyze-video", response_model=VideoAnalysisResponse)
async def analyze_video(request: VideoAnalysisRequest = Body(...)):
    """Analyze video for crime detection"""
    if not model_loaded:
        logger.warning("Model not loaded. Attempting to load model...")
        load_model()
        if not model_loaded:
            raise HTTPException(status_code=503, detail="Model not loaded")
    
    video_url = request.video_url
    location = request.location
    
    logger.info(f"Analyzing video: {video_url}")
    
    try:
        # Download a small part of the video to verify it exists
        response = requests.head(video_url, timeout=10)
        if response.status_code != 200:
            raise HTTPException(
                status_code=400, 
                detail=f"Video URL is not accessible: {response.status_code}"
            )
        
        # Process the video with the model
        result = analyze_video_with_model(video_url, location)
        
        logger.info(f"Analysis complete: {result['crime_type']} ({result['confidence']:.2f})")
        return result
        
    except requests.RequestException as e:
        logger.error(f"Error accessing video URL: {e}")
        raise HTTPException(
            status_code=400, 
            detail=f"Error accessing video URL: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error during video analysis: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Analysis failed: {str(e)}"
        )

def analyze_video_with_model(video_url: str, location: Optional[str] = None) -> Dict[str, Any]:
    """
    Process the video with the crime detection model
    
    This is a placeholder implementation. In a real system, this would:
    1. Download the video or process it in chunks
    2. Extract frames
    3. Run frames through a model
    4. Aggregate results and detect crime patterns
    """
    # Simulate processing time
    time.sleep(3)
    
    # For demo purposes, return a varied result based on the URL
    
    # Potential crime types
    crime_types = ["assault", "theft", "vandalism", "harassment", "trespassing"]
    
    # Seed random number generator based on video URL for consistent results
    seed = sum(ord(c) for c in video_url)
    random.seed(seed)
    
    # Determine crime type - in a real system this would be from model prediction
    if "assault" in video_url.lower():
        crime_type = "assault"
        confidence = 0.85 + (random.random() * 0.1)
    elif "theft" in video_url.lower() or "steal" in video_url.lower():
        crime_type = "theft"
        confidence = 0.82 + (random.random() * 0.1)
    elif "vandal" in video_url.lower():
        crime_type = "vandalism"
        confidence = 0.79 + (random.random() * 0.1)
    elif "harass" in video_url.lower():
        crime_type = "harassment"
        confidence = 0.77 + (random.random() * 0.1)
    elif "trespass" in video_url.lower():
        crime_type = "trespassing"
        confidence = 0.81 + (random.random() * 0.1)
    else:
        # If no keywords match, choose random crime type
        crime_type = random.choice(crime_types)
        # Lower confidence for non-keyword matches
        confidence = 0.65 + (random.random() * 0.2)
    
    # Generate description
    descriptions = {
        "assault": [
            "Video shows physical altercation between individuals with signs of aggression.",
            "Subject appears to be physically attacking another person with violent motions.",
            "Multiple individuals engaged in physical confrontation with aggressive behavior."
        ],
        "theft": [
            "Video shows unauthorized taking of property from another person or establishment.",
            "Subject is observed removing items without permission or payment.",
            "Evidence of property being taken by force or stealth from rightful owner."
        ],
        "vandalism": [
            "Video shows deliberate damage to public or private property.",
            "Subject is observed defacing or destroying property not belonging to them.",
            "Evidence of graffiti, breaking windows, or other property damage."
        ],
        "harassment": [
            "Video shows repeated unwanted attention or intimidation directed at an individual.",
            "Subject is observed following, intimidating, or verbally abusing another person.",
            "Evidence of threatening behavior causing distress to the victim."
        ],
        "trespassing": [
            "Video shows unauthorized entry into private property or restricted area.",
            "Subject is observed entering premises despite visible no-entry signs.",
            "Evidence of bypassing security measures to gain unauthorized access."
        ]
    }
    
    # Select a random description for the crime type
    description = random.choice(descriptions.get(crime_type, ["Suspicious activity detected in video."]))
    
    # Add location context if provided
    if location:
        description += f" The incident occurred at {location}."
    
    # Add time and environmental details
    times = ["during daylight hours", "at night", "in the evening", "in the early morning"]
    environments = ["in an urban setting", "in a residential area", "in a commercial district", "in a public space"]
    
    time_detail = random.choice(times)
    environment_detail = random.choice(environments)
    
    description += f" The event took place {time_detail} {environment_detail}."
    
    # Return the analysis result
    return {
        "crime_type": crime_type,
        "confidence": confidence,
        "description": description
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
