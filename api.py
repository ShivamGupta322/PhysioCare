from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import base64
import threading
import time
import os
from physiocare_module import PhysioCare
from collections import deque

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables to store the PhysioCare instance and processing state
physio_instance = None
processing_thread = None
is_processing = False
current_frame = None
current_similarity = 0
current_video_frame = None
similarity_history = deque(maxlen=10)  # Store recent similarity values for smoothing

@app.route('/api/start', methods=['POST'])
def start_exercise():
    global physio_instance, processing_thread, is_processing, similarity_history
    
    if is_processing:
        return jsonify({"error": "Exercise session already running"}), 400
    
    data = request.json
    video_path = data.get('videoPath')
    
    if not video_path or not os.path.exists(video_path):
        return jsonify({"error": "Invalid video path"}), 400
    
    # Initialize PhysioCare with the selected video
    physio_instance = PhysioCare()
    physio_instance.video_path = video_path
    physio_instance.cap = cv2.VideoCapture(video_path)
    
    # Reset similarity history
    similarity_history.clear()
    
    # Start processing in a separate thread
    is_processing = True
    processing_thread = threading.Thread(target=process_frames)
    processing_thread.daemon = True
    processing_thread.start()
    
    return jsonify({"message": "Exercise session started successfully"})

@app.route('/api/stop', methods=['POST'])
def stop_exercise():
    global is_processing, physio_instance
    
    if not is_processing:
        return jsonify({"error": "No exercise session running"}), 400
    
    is_processing = False
    if physio_instance:
        if physio_instance.cap:
            physio_instance.cap.release()
    
    return jsonify({"message": "Exercise session stopped successfully"})

@app.route('/api/control', methods=['POST'])
def control_playback():
    global physio_instance
    
    if not is_processing or not physio_instance:
        return jsonify({"error": "No exercise session running"}), 400
    
    data = request.json
    action = data.get('action')
    
    if action == 'pause':
        physio_instance.paused = True
    elif action == 'play':
        physio_instance.paused = False
    elif action == 'rewind':
        physio_instance.cap.set(cv2.CAP_PROP_POS_MSEC, max(0, physio_instance.cap.get(cv2.CAP_PROP_POS_MSEC) - 5000))
    elif action == 'forward':
        physio_instance.cap.set(cv2.CAP_PROP_POS_MSEC, physio_instance.cap.get(cv2.CAP_PROP_POS_MSEC) + 10000)
    elif action == 'speed_down':
        physio_instance.playback_speed = max(0.5, physio_instance.playback_speed - 0.5)
    elif action == 'speed_up':
        physio_instance.playback_speed += 0.5
    else:
        return jsonify({"error": "Invalid action"}), 400
    
    return jsonify({"message": f"Action {action} applied successfully"})

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'running' if is_processing else 'stopped',
        'physiocare_module': 'loaded' if PhysioCare is not None else 'not loaded',
        'webcam_available': check_webcam_availability(),
        'version': '1.0.0'
    })

def check_webcam_availability():
    """Check if webcam is available"""
    cap = cv2.VideoCapture(0)
    available = cap.isOpened()
    if available:
        cap.release()
    return available

@app.route('/api/frame')
def get_frame():
    global current_frame, current_similarity, current_video_frame
    
    if not is_processing:
        return jsonify({"error": "No exercise session running"}), 404
        
    if current_frame is None or current_video_frame is None:
        return jsonify({"error": "Frames not available"}), 404
    
    try:
        # Convert frames to base64
        _, patient_buffer = cv2.imencode('.jpg', current_frame)
        patient_base64 = base64.b64encode(patient_buffer).decode('utf-8')
        
        _, video_buffer = cv2.imencode('.jpg', current_video_frame)
        video_base64 = base64.b64encode(video_buffer).decode('utf-8')
        
        # Get smoothed similarity value
        smoothed_similarity = get_smoothed_similarity()
        
        return jsonify({
            "patientFrame": patient_base64,
            "videoFrame": video_base64,
            "similarity": float(smoothed_similarity),
            "rawSimilarity": float(current_similarity)
        })
    except Exception as e:
        print(f"Error in get_frame: {str(e)}")
        return jsonify({"error": f"Frame processing error: {str(e)}"}), 500

def get_smoothed_similarity():
    """Calculate smoothed similarity using recent history"""
    global similarity_history, current_similarity
    
    # Add current similarity to history
    if current_similarity is not None:
        similarity_history.append(current_similarity)
    
    # If we have enough data points, use a weighted average
    if len(similarity_history) >= 3:
        # More weight to recent values
        weights = np.linspace(0.5, 1.0, len(similarity_history))
        weights = weights / np.sum(weights)  # Normalize weights
        return np.average(list(similarity_history), weights=weights)
    
    # Otherwise return the current value
    return current_similarity

def validate_landmarks(landmarks):
    """Check if landmarks are valid and complete enough for comparison"""
    if landmarks is None:
        return False
    
    # Check if we have enough key points (shoulders, hips, knees)
    key_points = [11, 12, 23, 24, 25, 26]  # Indices for key body parts
    
    # Count visible key points
    visible_count = sum(1 for idx in key_points if idx < len(landmarks) and landmarks[idx] is not None)
    
    # Need at least 4 of 6 key points to be visible
    return visible_count >= 4

def process_frames():
    global is_processing, current_frame, current_similarity, current_video_frame, physio_instance, similarity_history
    
    print("Starting frame processing...")
    
    # Initialize webcam with improved settings
    patient_cap = cv2.VideoCapture(0)
    if not patient_cap.isOpened():
        print("Error: Could not open webcam.")
        is_processing = False
        return
    
    # Set webcam properties for better quality
    patient_cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    patient_cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    patient_cap.set(cv2.CAP_PROP_FPS, 30)
    
    print(f"Video path: {physio_instance.video_path}")
    if not physio_instance.cap.isOpened():
        print("Error: Could not open exercise video.")
        is_processing = False
        return

    # Previous landmarks for smoothing
    prev_video_landmarks = None
    prev_patient_landmarks = None
    
    # Frame counters for processing optimization
    frame_count = 0
    process_every_n_frames = 2  # Process every 2nd frame to reduce CPU load
    
    while is_processing and physio_instance.cap.isOpened() and patient_cap.isOpened():
        try:
            # Always read patient frame to keep webcam responsive
            ret2, frame_patient = patient_cap.read()
            if not ret2:
                print("Error: Could not read patient frame")
                break
                
            # Process video frame only if not paused
            if not physio_instance.paused:
                ret1, frame_video = physio_instance.cap.read()
                if not ret1:
                    # Try to loop the video
                    physio_instance.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    ret1, frame_video = physio_instance.cap.read()
                    if not ret1:
                        print("Error: Could not read video frame")
                        break
                
                # Update current video frame
                current_video_frame = frame_video
                
                # Process frames at reduced frequency to improve performance
                frame_count += 1
                if frame_count % process_every_n_frames == 0:
                    # Mirror the patient frame for more intuitive feedback
                    frame_patient = cv2.flip(frame_patient, 1)
                    
                    # Apply slight Gaussian blur to reduce noise
                    frame_patient = cv2.GaussianBlur(frame_patient, (5, 5), 0)
                    
                    # Extract landmarks
                    video_landmarks = physio_instance.extract_pose_landmarks(frame_video)
                    patient_landmarks = physio_instance.extract_pose_landmarks(frame_patient)
                    
                    # Apply temporal smoothing to landmarks
                    if prev_video_landmarks is not None and video_landmarks is not None:
                        video_landmarks = smooth_landmarks(video_landmarks, prev_video_landmarks, alpha=0.7)
                    
                    if prev_patient_landmarks is not None and patient_landmarks is not None:
                        patient_landmarks = smooth_landmarks(patient_landmarks, prev_patient_landmarks, alpha=0.7)
                    
                    # Store current landmarks for next frame
                    prev_video_landmarks = video_landmarks
                    prev_patient_landmarks = patient_landmarks
                    
                    # Calculate similarity only if both sets of landmarks are valid
                    if validate_landmarks(video_landmarks) and validate_landmarks(patient_landmarks):
                        similarity = physio_instance.calculate_similarity(video_landmarks, patient_landmarks)
                        
                        # Apply threshold to filter out very low similarity values (likely errors)
                        if similarity < 5:
                            similarity = 0
                            
                        current_similarity = similarity
                    
                    # Update current patient frame
                    current_frame = frame_patient
            
            # Control frame rate based on playback speed
            sleep_time = max(0.01, 0.033 / physio_instance.playback_speed)
            time.sleep(sleep_time)
            
        except Exception as e:
            print(f"Error in process_frames: {str(e)}")
            time.sleep(0.1)  # Prevent tight loop on error
    
    print("Frame processing stopped")
    patient_cap.release()
    is_processing = False

def smooth_landmarks(current, previous, alpha=0.7):
    """Apply temporal smoothing to landmarks to reduce jitter"""
    if current is None or previous is None:
        return current
        
    smoothed = []
    for i in range(min(len(current), len(previous))):
        if current[i] is not None and previous[i] is not None:
            # Apply exponential smoothing
            smoothed_point = (
                alpha * current[i][0] + (1 - alpha) * previous[i][0],
                alpha * current[i][1] + (1 - alpha) * previous[i][1],
                alpha * current[i][2] + (1 - alpha) * previous[i][2]
            )
            smoothed.append(smoothed_point)
        else:
            smoothed.append(current[i] if current[i] is not None else None)
            
    return smoothed

if __name__ == '__main__':
    app.run(debug=True, port=5000)