import React from "react";
import { useNavigate } from "react-router-dom";

function DesktopAboutUsPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-black text-white py-12 px-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                {/* Header row */}
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#767676] hover:text-white transition cursor-pointer text-xl"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <h1 className="text-2xl font-semibold">About Us</h1>
                </div>

                {/* Main Card */}
                <div className="bg-[#1D1F24] rounded-3xl p-8 md:p-10 shadow-xl flex flex-col items-center">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-[#28292E] rounded-full p-4 flex items-center justify-center mb-4">
                            <i className="fa-solid fa-train-subway text-3xl text-blue-400"></i>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">
                            Welcome to Railsplit
                        </h2>
                        <div className="text-base text-gray-300 text-center max-w-xl leading-relaxed space-y-4 mt-2">
                            <p className="font-semibold text-white">
                                Your smart companion for seamless train travel.
                            </p>
                            <p>
                                Long routes often mean unconfirmed tickets — even if booked weeks in advance. <strong>Railsplit</strong> solves this by finding alternative split routes with higher chances of seat availability, helping you skip the hassle of waitlists and uncertainty.
                            </p>
                            <p>
                                Prefer a single route? We’ve got you covered. Our <strong>Tatkal booking service, powered by trusted agents</strong>, helps you secure last-minute confirmed seats quickly and reliably.
                            </p>
                            <p className="font-bold text-gray-200">
                                Railsplit — Making every journey smooth, simple, and stress-free.
                            </p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4 max-w-lg mt-4">
                        <div className="flex items-center gap-4 bg-[#23252b] px-5 py-3 rounded-xl">
                            <i className="fa-solid fa-train text-blue-400 text-xl"></i>
                            <span className="text-white font-semibold">Smart Split Journey Finder</span>
                        </div>
                        <div className="flex items-center gap-4 bg-[#23252b] px-5 py-3 rounded-xl">
                            <i className="fa-solid fa-bolt text-yellow-400 text-xl"></i>
                            <span className="text-white font-semibold">Fast & Reliable Tatkal Booking</span>
                        </div>
                        <div className="flex items-center gap-4 bg-[#23252b] px-5 py-3 rounded-xl">
                            <i className="fa-solid fa-receipt text-green-400 text-xl"></i>
                            <span className="text-white font-semibold">PNR Status & Live Train Updates</span>
                        </div>
                        <div className="flex items-center gap-4 bg-[#23252b] px-5 py-3 rounded-xl">
                            <i className="fa-solid fa-users text-purple-400 text-xl"></i>
                            <span className="text-white font-semibold">Friendly & Dedicated Support</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center max-w-lg">
                        <h3 className="text-xl font-bold text-blue-400 mb-2">Our Mission</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            To transform train travel by offering the smartest, fastest, and most dependable ticket booking experience in India.<br />
                            <span className="text-green-400 font-semibold">Because we believe that every journey should be simple, smooth, and worry-free.</span>
                        </p>
                    </div>

                    <div className="mt-8">
                        <a
                            onClick={() => navigate('/contactus')}
                            className="text-blue-400 underline hover:text-blue-300 transition text-sm cursor-pointer"
                        >
                            Contact us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesktopAboutUsPage;
