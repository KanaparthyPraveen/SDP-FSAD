# 🤖 AI Placement Predictor — Technical Explanation

This document explains the architecture and implementation of the AI-Driven Placement Predictor integrated into the College Placement Management System. You can use this to explain the concepts to your faculty.

---

## 1. High-Level Architecture

The system uses a **hybrid approach** to predict a student's likelihood of getting placed at a specific company. 

It attempts to use **Google's Gemini 1.5 Flash AI** via API for intelligent reasoning. If the AI service is unavailable (e.g., API key issues, rate limits, or no internet), the system automatically falls back to a **Rule-Based Algorithm** running purely in Java.

### Architecture Flow:
1. **Frontend (React)** requests prediction: `POST /api/predict { studentId, companyId }`
2. **Backend (Spring Boot)** fetches the student's profile and company requirements from MongoDB.
3. Backend constructs a prompt and sends it to the Gemini API.
4. Gemini returns a JSON response containing the probability score and reasoning.
5. Frontend receives the prediction and displays a color-coded "Match Score" with reasoning.

---

## 2. Core Components & File Redirections

Here is exactly where the logic lives in the codebase.

### 📍 The API Controller (Backend)
**File:** `backend/src/main/java/com/placeiq/api/PredictionController.java`
- Exposes the `POST /api/predict` endpoint.
- Receives the `PredictionRequest` payload.

### 📍 The Core Logic (Backend)
**File:** `backend/src/main/java/com/placeiq/service/PredictionService.java`
This is the brain of the feature. It contains two main methods:

1. **`predictWithGemini()`**: 
   - Uses `RestTemplate` to call the `generativelanguage.googleapis.com` endpoint.
   - Feeds student data (CGPA, skills, backlogs) and company data to the LLM.
   - Instructs the LLM to return a strict JSON response.
   - Parses the JSON to extract probability, recommendation, and reasoning.

2. **`predictRuleBased()` (The Fallback)**:
   - A deterministic algorithm used if Gemini fails.
   - Calculates a weighted score:
     - 40% weight on CGPA match
     - 35% weight on Skills match
     - 15% weight on Backlogs limit
     - 10% weight on Department match
   - Generates string-based reasoning like *"CGPA 8.5 meets requirement of 8.0"*.

### 📍 The Frontend UI (React)
**File:** `src/pages/student/AIAnalytics.jsx`
- Fetches all active companies.
- Iterates through the companies and calls `/api/predict` for each one.
- **Fail-safe mechanism:** If the backend cannot be reached at all, the frontend generates a random mock probability and reasoning just so the UI doesn't break during a live demo.
- Renders the `ProbabilityBar` (green for >70%, yellow for 40-70%, red for <40%).

### 📍 Real-Time Notifications (Backend Integration)
**File:** `backend/src/main/java/com/placeiq/service/CompanyService.java`
- When an admin creates a new company, the system automatically runs the rule-based prediction for **every single student**.
- If a student is a **>60% match**, it triggers an SSE (Server-Sent Event) notification to alert them instantly.

---

## 3. Why This Approach is "Advanced" (SDE Level)

When explaining this to your faculty, highlight these engineering decisions:

1. **Fault Tolerance (Graceful Degradation):** The system doesn't crash if the AI API goes down. It seamlessly falls back to a custom Java algorithm, and if the backend drops, the frontend provides mock data. 
2. **Prompt Engineering:** The backend forces the LLM to return strictly formatted JSON, preventing parsing errors common when integrating LLMs into code.
3. **Asynchronous Processing:** The automated prediction on company creation runs in a non-blocking `@Async` thread so the admin doesn't experience lag while saving the company.
4. **Data Aggregation:** The frontend `AIAnalytics` page aggregates the predictions to show the student their overall "Avg Match Score" and "Best Match".

---

## 4. How to Demo This Feature

1. Log in to the Frontend as a Student (`praveen@student.com` / `Admin@1234`).
2. Open the **AI Analytics** page from the sidebar.
3. Watch the progress bars animate.
4. Point out the specific **Reasoning** text (e.g., *"Student has strong React skills but falls short on the required CGPA"*).
5. Explain that this text is generated dynamically by an AI understanding the context, not by hardcoded strings.
