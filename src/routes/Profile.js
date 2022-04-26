import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const Profile = ({ userObj, refreshUser }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const getMyRecords = async () => {
        const q = query(
            collection(dbService, "records"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>" , doc.data());
        });
    };

    useEffect(() => {
        getMyRecords();
    }, [])

    const onLogOut = () => {
        authService.signOut();
        navigate("/");
    }
    const onChange = (e) => {
        const {
            target: { value }
        } = e;
        setNewDisplayName(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            refreshUser();
        }
    }
    return(
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Display name" value={newDisplayName} onChange={onChange} />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOut}>Log Out</button>
        </>
    )
}

export default Profile