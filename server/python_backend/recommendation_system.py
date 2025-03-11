from fastapi import FastAPI
import pymongo
import uvicorn

app = FastAPI()

# MongoDB Connection
client = pymongo.MongoClient("mongodb://localhost:27017/ML_DB")
db = client["test"]
trends_collection = db["trend_analysis"]
users_collection = db["github_profile"]  # User tech stack data

# Keywords associated with each career goal
career_keywords = {
    "fullstackdevelopment": ["JavaScript", "TypeScript", "React", "Vue", "Angular", "Node", "Express", "MongoDB", "PostgreSQL"],
    "aimlengineer": ["Python", "TensorFlow", "PyTorch", "Scikit", "AI", "Machine Learning", "Deep Learning", "Data Science"],
    "appdeveloper": ["Swift", "Kotlin", "Flutter", "React Native", "iOS", "Android", "Xamarin"],
}

def get_trending_tech():
    """Fetch trending technologies from MongoDB."""
    return list(trends_collection.find())

def get_user_tech_stack(username: str):
    """Fetch user's tech stack from MongoDB and return a set of known technologies."""
    user = users_collection.find_one({"username": username})
    if not user:
        return set()

    user_tech_stack = set()
    for repo in user.get("repo_details", []):
        if "languages" in repo:
            user_tech_stack.update(repo["languages"].keys())

    return user_tech_stack

def classify_tech_by_career(trending_tech, user_tech_stack):
    """Assign trending technologies to career goals and filter out known tech."""
    career_trends = {goal: [] for goal in career_keywords}

    for tech in trending_tech:
        tech_name = tech["query"]  # Extract tech name
        popularity = tech["popularity_score"]  # Use popularity to rank

        for career_goal, keywords in career_keywords.items():
            if any(keyword.lower() in tech_name.lower() for keyword in keywords) and tech_name not in user_tech_stack:
                career_trends[career_goal].append((tech_name, popularity))

    # Sort by popularity and return top 5 results per career goal
    return {goal: [tech[0] for tech in sorted(trends, key=lambda x: x[1], reverse=True)[:5]]
            for goal, trends in career_trends.items()}

@app.get("/recommend/{career_goal}/{username}")
def recommend_tech_stack(career_goal: str, username: str):
    try:
        if not career_goal or not username:
            return {"error": "Career goal or username is missing"}

        trending_tech = get_trending_tech()
        user_tech_stack = get_user_tech_stack(username)
        career_trends = classify_tech_by_career(trending_tech, user_tech_stack)

        return {"recommended_technologies": career_trends.get(career_goal, [])}
    
    except Exception as e:
        print(f"Error in /recommend API: {str(e)}")
        return {"error": "Internal server error"}
# Example Test
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
