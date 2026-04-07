# PlantGuard - Crop Disease Advisory System

PlantGuard is an intelligent web application designed to help farmers and gardening enthusiasts identify plants, detect diseases, and receive treatment recommendations. Leveraging the power of AI (Groq/Llama) and Google Search, it provides accurate, real-time insights from image inputs.

## 🚀 Features

- **Plant Identification**: Instantly identify plant species from photos.
- **Disease Detection**: Analyze plant health and detect potential diseases.
- **Smart Recommendations**: Get detailed care tips, cure suggestions, and common uses.
- **External Resources**: Integrated Google Search results for further reading.
- **History Tracking**: Save and manage your detection history (Firebase Auth required).
- **User Profiles**: Personalized user experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 
- **Styling**: TailwindCSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Server**: Python (Flask)
- **AI Model**: Groq  (Llama-3/4 models)
- **Database/Auth**: Firebase Admin SDK (Firestore & Auth)
- **Search**: Google Search (googlesearch-python)
- **Image Processing**: Pillow (PIL)

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)
- **Git**

## ⚙️ Installation & Setup

Clone the repository:
```bash
git clone <repository-url>
cd <project-folder>
```

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

**Environment Configuration:**
Create a `.env` file in the `backend/` directory and add your keys:
```env
# Server
LOG_LEVEL=INFO

# AI Provider
GROQ_API_KEY=your_groq_api_key

# Firebase (Option 1: JSON file path)
# FIREBASE_CREDENTIALS_PATH=firebase_credentials.json

# Firebase (Option 2: Env variables)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

Start the Backend Server:
```bash
python server.py
```
*The server will run on `http://127.0.0.1:5000`*

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

**Environment Configuration:**
Create a `.env` file in the `frontend/` directory (if needed for API base URL):
```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

Start the Frontend Development Server:
```bash
npm run dev
```
*The app will typically run on `http://localhost:5173`*

## 📖 Usage Guide

1.  **Sign Up/Login**: Create an account to save your history.
2.  **Upload Image**: Navigate to the "Identify" or "Home" tab and upload a plant image.
3.  **View Results**: Wait for the AI to analyze the image. Can see plant name, confidence score, description, and disease status.
4.  **Explore More**: Click on the suggested Google Search links for deeper research.
5.  **History**: Check "My Reports" to see past identifications.



## 📸 Screenshots

Here are screenshots demonstrating the key features of PlantGuard:

![Landing Page](screenshots/Landing_page.jpg)
*Landing page with disease detection entry point.*

![Authentication Page](screenshots/Authentication_Page.jpg)
*User authentication interface supporting login and account creation.*

![Dashboard Page](screenshots/Dashboard.jpg)
*User dashboard showing history of past detections and reports.*

![Disease Detection Page](screenshots/Disease_Detection_Page.jpg)
*Image upload interface and AI analysis results with disease detection, recommendations, and Google Search links.*

![Govt Schemes Page](screenshots/Govt_Schmes.jpg)
*Provides information on government agricultural schemes and farmer support initiatives.*

![Reports Page](screenshots/Reports_Page.jpg)
*Shows a detailed history of previous disease detections, including results and analysis insights.*

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
