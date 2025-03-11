# **Buildor - AI-Powered Coding Practice Platform**   

## **📌 Overview**  
**Buildor** is an **AI-driven coding practice platform** designed for **CS students** to enhance their coding skills. It features:  
✅ **AI-powered hints** using AST-based code analysis.  
✅ **Proctoring system** for plagiarism detection.  
✅ **GitHub profile analysis** for skill assessment.  
✅ **Tech stack recommendations** based on coding history.  
✅ **University tracking system** for assignments, student rankings, and recruiter tools.  

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
git clone https://github.com/your-username/buildor.git
cd buildor
```

### **2️⃣ Install Dependencies**  
#### **Backend**  
```sh
cd backend
npm install
```

#### **Frontend**  
```sh
cd frontend
npm install
```

### **3️⃣ Set Up Environment Variables**  
Create a `.env` file in the backend directory with the following:  
```env
MONGO_URI=your_mongodb_uri
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret
```

---

## **🚀 Running the Project**  

### **Start Backend Server**  
```sh
cd backend
npm run dev
```

### **Start Frontend**  
```sh
cd frontend
npm run dev
```

The app will be available at: **`http://localhost:3000`** 🎯  

---

## **🛡️ Security & Restrictions**  
- **Copy-Pasting Disabled** in the Code Editor to prevent plagiarism.  
- **Proctoring system** monitors for unusual activity.  

---

## **🛠️ To-Do & Future Enhancements**  
✅ **Leaderboard for student rankings**  
✅ **Automated plagiarism detection**  
✅ **More ML-based personalized learning suggestions**  

---

## **📝 License**  
This project is **open-source** under the [MIT License](LICENSE).  

---

## **👨‍💻 Contributors**  
💡 **Akshada Kashyap** ([@eden-max-stack](https://github.com/eden-max-stack))  

Contributions are welcome! **Feel free to fork, open issues, or submit PRs.** 🚀  
