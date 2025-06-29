import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import { auth } from "../firebase"; // adjust path if needed
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import LoginScreen from "./MobileComponents/LoginScreen";
import LoginPage from "./MobileComponents/LoginPage";
import SignupPage from "./MobileComponents/SignupPage";
import ProtectedRoute from "./MobileComponents/ProtectedRoute"
import Homepage from "./MobileComponents/Homepage";
import SearchTrainPage from './MobileComponents/SearchTrainPage';
import TatkalPage from './MobileComponents/TatkalPage';
import ShowTrainPage from "./MobileComponents/ShowTrainPage";
import TatkalBookingPage from "./MobileComponents/TatkalBookingPage";

function MobileView(){
    const [loggedIn, setLoggedIn] = useState(() => {
        const storedUsername = localStorage.getItem("username");
        return !!storedUsername;
    });
    const location = useLocation();
    const [username, setUsername] = useState(() => {
        return localStorage.getItem("username") || "";
    });

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence).catch((err) =>
            console.error("Auth persistence error:", err)
        );
    }, []);

    

    return(
        <>
        <Routes>
            <Route path="/" element={loggedIn
                ? <Homepage username={username} />
                : <LoginScreen />} 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/searchtrains" element={<ProtectedRoute loggedIn={loggedIn}>
                <SearchTrainPage />
            </ProtectedRoute>} />

            <Route path="/showtrains" element={<ProtectedRoute loggedIn={loggedIn}>
                
                <ShowTrainPage />
                </ProtectedRoute>}/>
            <Route path="/tatkal" element={<ProtectedRoute loggedIn={loggedIn}>
                <TatkalPage />
                </ProtectedRoute>} />
            <Route path="/tatkalbooking" element={<ProtectedRoute loggedIn={loggedIn}>
                <TatkalBookingPage />
                </ProtectedRoute>} />
        </Routes>
        </>
    );
}

export default MobileView;