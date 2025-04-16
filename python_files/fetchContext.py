import requests
from bs4 import BeautifulSoup
import praw
import feedparser
from transformers import pipeline
import json

def get_github_trending():
    url = "https://github.com/trending"
    headers = {"User-Agent": "Mozilla/5.0"}  # helps avoid getting blocked
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    repos = soup.find_all("article", class_="Box-row")
    data = []

    for repo in repos:
        # repo name is now in <h2>
        h2 = repo.find("h2")
        name = h2.get_text(strip=True).replace(" ", "").replace("\n", "") if h2 else "Unknown"
        
        lang_spans = repo.find_all("span", class_="d-inline-block ml-0 mr-3")
        languages = []
        for span in lang_spans:
            lang_name = span.get_text(strip=True)
            if lang_name:
                languages.append(lang_name)
        
        data.append({"repo": name, "tech_stack": languages})
    
    return data


reddit = praw.Reddit(
    client_id="joXh-QlriQwLgJFk-dM5Iw",
    client_secret="kTGxMEUH8LsJSBVkHLWHruQkm5zqwA",
    user_agent="buildor"
)

subreddits = [
    "coding",
    "learnprogramming",
    "webdev",
    "cscareerquestions",
    "csMajors"
]

def get_stack_overflow_trending():
    articles = []
    for tag in stack_overflow_tags:
        url = "https://api.stackexchange.com/2.3/questions"
        params = {
            "order": "desc",
            "sort": "votes",      # or 'activity', 'creation'
            "tagged": tag,   # change to any tech
            "site": "stackoverflow",
            "pagesize": 5
        }
        
        res = requests.get(url, params=params)
        data = res.json()
        
        for item in data["items"]:
            articles.append({
                "title": item["title"],
                "score": item["score"]})
    return articles

dev_to_tags = [
    "webdev", "frontend", "javascript", "html", "css", "react", "vue", "nextjs", "tailwindcss", "svelte", "bootstrap",
    "backend", "node", "express", "django", "fastapi", "postgresql", "api", "devops", "docker", "datascience", "deeplearning", "pytorch", "machinelearning", "langchain", "chatgpt",
    "llm"]

summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

def summarize_text(text):
    if len(text) > 300:
        summary = summarizer(text[:1024], max_length=100, min_length=30, do_sample=False)
        return summary[0]['summary_text']
    return text

def get_subreddit_trending():
    articles = []
    for subreddit in subreddits:
        subreddit = reddit.subreddit(subreddit)
        top_posts = subreddit.top(time_filter="week", limit=5)

        for post in top_posts:
            articles.append({
                "title": post.title,
                "body": summarize_text(post.selftext)})
    return articles
            

def get_medium_trending():
    articles = []
    for tag in dev_to_tags:
        
        url = "https://medium.com/feed/better-programming"
        feed = feedparser.parse(url)
    
        for entry in feed.entries[:5]:
            articles.append({
                "title" : entry.title,
                "summary": summarize_text(entry.summary)})

    return articles

def run_all_scrapers():
    all_data = []

    # Medium
    medium_articles = get_medium_trending()
    for article in medium_articles:
        all_data.append({
            "source": "medium",
            "title": article.get("title", ""),
            "summary": article.get("summary", ""),
            "link": article.get("link", "")
        })

    # GitHub
    github_repos = get_github_trending()
    for repo in github_repos:
        all_data.append({
            "source": "github",
            "repo": repo.get("repo", ""),
            "description": repo.get("desc", ""),
            "tech_stack": repo.get("tech_stack", "")
        })

    # Stack Overflow
    stackoverflow_qs = get_stack_overflow_trending()
    for question in stackoverflow_qs:
        all_data.append({
            "source": "stackoverflow",
            "title": question.get("title", ""),
            "score": question.get("score", 0),
            "link": question.get("link", "")
        })

    # Reddit
    reddit_posts = get_subreddit_trending()
    for post in reddit_posts:
        all_data.append({
            "source": "reddit",
            "title": post.get("title", ""),
            "body": post.get("body", ""),
            "url": post.get("url", ""),
            "upvotes": post.get("upvotes", 0)
        })

    return all_data

def save_context_to_file(data, filename="context_data.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

all_context = run_all_scrapers()
save_context_to_file(all_context)