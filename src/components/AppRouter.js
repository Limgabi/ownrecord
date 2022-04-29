import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "routes/Home";
import Auth from "routes/Auth";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";
import Search from "routes/Search";
import UserProfile from "routes/UserProfile";
import Recording from "routes/Recording";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        <BrowserRouter>
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route path="/" element={<Home userObj={userObj}/>} />
                        <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser}/>} />
                        <Route path="/user/:userid" element={<UserProfile userObj={userObj}/>} />
                        <Route path="/search/:searchWord" element={<Search userObj={userObj}/>} />
                        <Route path="/recording" element={<Recording userObj={userObj}/>} />
                    </>
                ) : (
                    <Route path="/" element={<Auth />} />
                )}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter