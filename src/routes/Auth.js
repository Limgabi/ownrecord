import React, { useState } from "react";
import { authService } from "fbase";
import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
} from "firebase/auth";
import AuthForm from "components/AuthForm";
import { FcGoogle } from "react-icons/fc"
import { BsGithub } from "react-icons/bs";
import "../css/login.css";


const Auth = () => {

    const onSocialClick = async (e) => {
        const {
            target: { name }
        } = e;
        let provider;
        if (name === "google") {
            provider = new GoogleAuthProvider();
        } else if (name === "github") {
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
    }

    return (
        <div style={{
            margin: "10rem auto",
            textAlign: "center",
        }}>
            <AuthForm />
            <div className="socialBox">
                <button name="google" className="googleBtn" onClick={onSocialClick}>
                    <FcGoogle/>
                    Continue with Google
                </button>
                <button name="github" className="githubBtn" onClick={onSocialClick}>
                    <BsGithub/>
                    Continue with Github
                </button>
            </div>
        </div>
    )
}

export default Auth