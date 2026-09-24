import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "/image-2.png";

function DesktopLoginScreen() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('username');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="w-full bg-[#0a0b0e] text-white">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column */}
                <div className="lg:col-span-7 flex flex-col items-start gap-6">
                    <h1 className="text-5xl font-extrabold tracking-tight leading-tight font-['Montserrat']">
                        Your Emergency <br />
                        <span className="text-green-300">Ticket Booking System</span>
                    </h1>

                    <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
                        No confirmed seat? Discover indirect train routes with confirmed availability when direct trains are full.
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base px-8 py-3.5 rounded-xl transition duration-150 cursor-pointer shadow-md"
                        >
                            Log in to your account
                        </button>

                        <Link
                            to="/signup"
                            className="bg-[#1c1e25] hover:bg-[#252832] border border-[#2e313c] text-gray-200 font-semibold text-base px-7 py-3.5 rounded-xl transition cursor-pointer"
                        >
                            Sign up
                        </Link>
                    </div>

                    <p className="text-sm text-gray-400">
                        Don't have an account yet?{" "}
                        <Link to="/signup" className="text-white underline font-semibold">
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Right Image Card */}
                <div className="lg:col-span-5">
                    <div className="rounded-3xl overflow-hidden border border-[#242630] bg-[#14151b] shadow-2xl">
                        <img
                            src={image}
                            alt="RailSplit"
                            className="w-full h-[400px] object-cover object-center"
                        />
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="border-t border-[#1a1b22] py-14">
                <div className="max-w-6xl mx-auto px-8">
                    <p className="text-gray-400 text-sm font-semibold mb-6">Railsplit Services</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div
                            onClick={() => navigate('/login')}
                            className="bg-[#3D73E6] hover:bg-[#3467d1] rounded-2xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between h-48"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center text-2xl">
                                <i className="fa-solid fa-train-subway"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">In-direct Train</h3>
                                <p className="text-xs text-blue-100 mt-1">No confirmed seat? Try indirect train booking!</p>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/login')}
                            className="bg-[#1D1F24] hover:bg-[#252830] border border-[#2a2d36] rounded-2xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between h-48"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#28292E] text-white flex items-center justify-center text-2xl">
                                <i className="fa-solid fa-bolt"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Tatkal</h3>
                                <p className="text-xs text-gray-400 mt-1">Struggling with Tatkal tickets? Book easily through our agents!</p>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/login')}
                            className="bg-[#1D1F24] hover:bg-[#252830] border border-[#2a2d36] rounded-2xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between h-48"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#28292E] text-white flex items-center justify-center text-2xl">
                                <i className="fa-solid fa-receipt"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">PNR Status</h3>
                                <p className="text-xs text-gray-400 mt-1">Check your ticket & seat status instantly</p>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/login')}
                            className="bg-[#1D1F24] hover:bg-[#252830] border border-[#2a2d36] rounded-2xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between h-48"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#28292E] text-white flex items-center justify-center text-2xl">
                                <i className="fa-solid fa-map-marker-alt"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Live Train Status</h3>
                                <p className="text-xs text-gray-400 mt-1">Track your train in real-time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesktopLoginScreen;
