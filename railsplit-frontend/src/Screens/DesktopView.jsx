import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

import DesktopNavbar from "./DesktopComponents/DesktopNavbar";
import DesktopFooter from "./DesktopComponents/DesktopFooter";
import DesktopProtectedRoute from "./DesktopComponents/DesktopProtectedRoute";
import DesktopLoginScreen from "./DesktopComponents/DesktopLoginScreen";
import DesktopLoginPage from "./DesktopComponents/DesktopLoginPage";
import DesktopSignupPage from "./DesktopComponents/DesktopSignupPage";
import DesktopHomepage from "./DesktopComponents/DesktopHomepage";
import DesktopSearchTrainPage from "./DesktopComponents/DesktopSearchTrainPage";
import DesktopShowTrainPage from "./DesktopComponents/DesktopShowTrainPage";
import DesktopTatkalPage from "./DesktopComponents/DesktopTatkalPage";
import DesktopTatkalBookingPage from "./DesktopComponents/DesktopTatkalBookingPage";
import DesktopPnrStatusPage from "./DesktopComponents/DesktopPnrStatusPage";
import DesktopLiveTrainStatusPage from "./DesktopComponents/DesktopLiveTrainStatusPage";
import DesktopContactUsPage from "./DesktopComponents/DesktopContactUsPage";
import DesktopAboutUsPage from "./DesktopComponents/DesktopAboutUsPage";

export default function DesktopView() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Auto scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [location.pathname]);

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence).catch((err) =>
            console.error("Auth persistence error:", err)
        );

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
        return (
            <div className="bg-[#0a0b0e] h-screen w-screen flex flex-col gap-6 items-center justify-center text-white">
                <span className="loader"></span>
                <span className="text-sm font-semibold tracking-wide text-gray-400">Loading RailSplit...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0b0e] text-white flex flex-col antialiased selection:bg-blue-600 selection:text-white">
            <DesktopNavbar loggedIn={loggedIn} username={username} />
            <main className="flex-1 flex flex-col">
                <Routes>
                    <Route
                        path="/"
                        element={
                            loggedIn ? (
                                <DesktopHomepage username={username} />
                            ) : (
                                <DesktopLoginScreen />
                            )
                        }
                    />
                    <Route path="/login" element={<DesktopLoginPage />} />
                    <Route path="/signup" element={<DesktopSignupPage />} />
                    <Route
                        path="/searchtrains"
                        element={
                            <DesktopProtectedRoute loggedIn={loggedIn}>
                                <DesktopSearchTrainPage />
                            </DesktopProtectedRoute>
                        }
                    />
                    <Route
                        path="/showtrains"
                        element={
                            <DesktopProtectedRoute loggedIn={loggedIn}>
                                <DesktopShowTrainPage />
                            </DesktopProtectedRoute>
                        }
                    />
                    <Route
                        path="/tatkal"
                        element={
                            <DesktopProtectedRoute loggedIn={loggedIn}>
                                <DesktopTatkalPage />
                            </DesktopProtectedRoute>
                        }
                    />
                    <Route
                        path="/tatkalbooking"
                        element={
                            <DesktopProtectedRoute loggedIn={loggedIn}>
                                <DesktopTatkalBookingPage />
                            </DesktopProtectedRoute>
                        }
                    />
                    <Route
                        path="/pnrstatus"
                        element={
                            <DesktopProtectedRoute loggedIn={loggedIn}>
                                <DesktopPnrStatusPage />
                            </DesktopProtectedRoute>
                        }
                    />
                    <Route
                        path="/livetrainstatus"
                        element={
                            <DesktopProtectedRoute loggedIn={loggedIn}>
                                <DesktopLiveTrainStatusPage />
                            </DesktopProtectedRoute>
                        }
                    />
                    <Route
                        path="/contactus"
                        element={
                            <DesktopProtectedRoute loggedIn={loggedIn}>
                                <DesktopContactUsPage />
                            </DesktopProtectedRoute>
                        }
                    />
                    <Route
                        path="/aboutus"
                        element={
                            <DesktopProtectedRoute loggedIn={loggedIn}>
                                <DesktopAboutUsPage />
                            </DesktopProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            <DesktopFooter />
        </div>
    );
}