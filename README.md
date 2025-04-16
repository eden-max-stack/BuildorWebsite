[# **Buildor - AI-Powered Coding Practice Platform**   

## **📌 Overview**  
**Buildor** is an **AI-driven coding practice platform** designed for **CS students** to enhance their coding skills. It features:  
✅ **AI-powered hints** using AST-based code analysis.  
✅ **Proctoring system** for plagiarism detection.  
✅ **GitHub profile analysis** for skill assessment.  
✅ **Tech stack recommendations** based on coding history.  
✅ **University tracking system** for assignments, student rankings, and recruiter tools.  

## **🎥 Demo Video**
[![Watch the Demo](https://img.shields.io/badge/Watch%20Demo-Click%20Here-blue?style=for-the-badge)](https://drive.google.com/file/d/1k7YmHfWDa9LAMI13XD6ENo-EpHyq1Q-D/view?usp=sharing)

> Click the badge above to watch the demo video.

## **🚀 Features**  
### **🔹 Coding Practice & AI Hints**  
- AST-based code comparison to generate **structured feedback**.  
- AI-powered **hints with a 1-minute cooldown** to guide students.  

### **🔹 GitHub-Based Skill Analysis**  
- Fetches user repositories via **GitHub API**.  
- Analyzes **tech stacks & coding patterns**.  
- Recommends **trending stacks** using Stack Overflow & Google Trends data.  

### **🔹 University Assignment & Ranking System**  
- Tracks **assignments, papers, and student rankings**.  
- Recruiter dashboard to **shortlist students by coding skills** (not just CGPA!).  

## **🛠️ Tech Stack**  
| **Category**  | **Technology**  |
|--------------|---------------|
| **Frontend** | React, TypeScript, MUI (Material UI) |
| **Backend** | Node.js, Express.js, FastAPI |
| **Database** | MongoDB |
| **AI/ML** | AST-based analysis, Python (for ML-based recommendations) |
| **Authentication** | Firebase (GitHub OAuth) |

---

## **📦 Installation & Setup**  

### **1️⃣ Clone the Repository**  
```sh
git clone git@github.com:eden-max-stack/BuildorWebsite.git
cd buildor
```

### **2️⃣ Install Dependencies**  
#### **Backend**  
```sh
cd server
npm install express path date-fns cors
```

#### **Frontend**  
```sh
cd client
npm install axios @mui/material @emotion/react @emotion/styled 
```

### **3️⃣ Set Up Environment Variables**  
Create a `.env` file in the backend directory with the following:  
```env
MONGO_URI=your_mongodb_uri
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Create a `.env` file in the frontend directory and import your firebase credentials from [here](console.firebase.google.com):  
```env
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

---

## **🚀 Running the Project**  

### **Start Backend Server**  
```sh
cd server
node server.js
```

### **Start Frontend**  
```sh
cd frontend
npm run dev
```

### **Start Recommendation Engine**  
```sh
cd python_files
py recommendation_engine.py
```

### **Start Code Parser Backend**  
```sh
cd python_files
py code_parser.py
```

The app will be available at: **`http://localhost:5173`** 🎯  

---

## **🛡️ Security & Restrictions**  
- **Copy-Pasting Disabled** in the Code Editor to prevent plagiarism.  
- **Proctoring system** monitors for unusual activity.  

---

## **🛠️ To-Do & Future Enhancements**  
✅ **Leaderboard for student rankings**  
✅ **Automated plagiarism detection**  
✅ **More ML-based personalized learning suggestions**  
✅ **Enhancement of UI/UX**  
✅ **Code Hint Generation System Optimization**  
✅ **More Dashboard Functionalities**  

---

## **📝 License**  
This project is **open-source** under the [MIT License](LICENSE).  

---

## **👨‍💻 Contributors**  
💡 **Akshada Kashyap** ([@eden-max-stack](https://github.com/eden-max-stack))  

Contributions are welcome! **Feel free to fork, open issues, or submit PRs.** 🚀  
](https://drive.google.com/file/d/1RAdt4GDc8-QWoIj4sw7olrMs35C_Xiai/view?usp=sharing)
