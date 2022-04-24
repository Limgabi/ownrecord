import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "fbase";
import { signOut } from "firebase/auth";

const Profile = () => {
    const navigate = useNavigate();

    const onLogOut = () => {
        authService.signOut();
        navigate("/");
    }
    return(
        <>
            <button onClick={onLogOut}>Log Out</button>
        </>
    )
}

export default Profile