import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebase/config";  // Import initialized Firebase

const Login: React.FC = () => {
    const navigate = useNavigate();
    const provider = new GithubAuthProvider();

    provider.addScope("read:user");
    provider.addScope("user:email");
    provider.addScope("public_repo");
    provider.addScope("read:org");

    // Force GitHub to show account selection
    provider.setCustomParameters({
        prompt: "select_account" 
      });


    useEffect(() => {
        if (localStorage.getItem('github_token')) navigate('/dashboard');
    });

    const handleGitHubLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;

            console.log("User signed in:", user);
            console.log("GitHub Access Token:", token);

            const isNewUser = (result as any)?._tokenResponse?.isNewUser;

            if (isNewUser) {
                console.log("New user detected! Redirecting to profile setup...");
                navigate('/profile-setup');
            } else {
                console.log("User already exists. Redirecting to dashboard...");
                navigate('/dashboard');
            }

            if (token) {
                localStorage.setItem("github_token", token);
            }

            navigate("/dashboard");
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleGitHubLogin}>Sign in with GitHub</button>
        </div>
    );
};

export default Login;
