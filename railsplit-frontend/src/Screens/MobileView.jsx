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
import PnrStatusPage from "./MobileComponents/PnrStatusPage";
import LiveTrainStatusPage from "./MobileComponents/LiveTrainStatusPage";
import ContactUsPage from "./MobileComponents/ContactUsPage";
import AboutUsPage from "./MobileComponents/AboutUsPage";

function MobileView(){
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Auto scroll to top (Fix: React auto-focus issue)
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [location.pathname]); 

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence).catch((err) =>
            console.error("Auth persistence error:", err)
        );

        // Listen to Firebase Auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setLoggedIn(true);
                setUsername(user.displayName || localStorage.getItem("username") || "");
            } else {
                setLoggedIn(false);
                setUsername("");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="bg-black h-screen w-screen flex flex-col gap-7 items-center justify-center text-white"><span className="loader"></span> <span>Loading...</span></div>;
    }

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
            <Route path="/pnrstatus" element={<ProtectedRoute loggedIn={loggedIn}>
                <PnrStatusPage />
                </ProtectedRoute>} />
            <Route path="/livetrainstatus" element={<ProtectedRoute loggedIn={loggedIn}>
                <LiveTrainStatusPage />
                </ProtectedRoute>} />
            <Route path="/livetrainstatus" element={<ProtectedRoute loggedIn={loggedIn}>
                <LiveTrainStatusPage />
                </ProtectedRoute>} />
            <Route path="/livetrainstatus" element={<ProtectedRoute loggedIn={loggedIn}>
                <LiveTrainStatusPage />
                </ProtectedRoute>} />
            <Route path="/contactus" element={<ProtectedRoute loggedIn={loggedIn}>
                <ContactUsPage />
                </ProtectedRoute>} />
            <Route path="/aboutus" element={<ProtectedRoute loggedIn={loggedIn}>
                <AboutUsPage />
                </ProtectedRoute>} />
        </Routes>
        </>
    );
}

export default MobileView;