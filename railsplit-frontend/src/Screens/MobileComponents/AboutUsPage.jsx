import React from "react";
import { useNavigate } from "react-router-dom";

function AboutUsPage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-[#1D1F24] to-[#23252b] flex flex-col items-center justify-center px-5 py-10 overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <div className="fixed flex flex-row items-center w-full top-5 left-0 z-20">
                <i onClick={() => navigate('/')} className="fa-solid fa-angle-left text-[#767676] text-2xl ml-1 mt-2" />
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#1D1F24] h-12 w-[90vw] flex justify-center items-center rounded-4xl mt-2 shadow-lg">
                    <h2 className="text-white text-2xl font-semibold">About Us</h2>
                </div>    
            </div>

            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute bg-blue-500 opacity-30 rounded-full w-72 h-72 top-[-80px] left-[-80px] animate-blob1"></div>
                <div className="absolute bg-green-400 opacity-20 rounded-full w-80 h-80 bottom-[-100px] right-[-100px] animate-blob2"></div>
                <div className="absolute bg-purple-600 opacity-20 rounded-full w-60 h-60 top-1/2 left-1/2 animate-blob3"></div>
            </div>

            {/* Main Card */}
            <div
                className="relative z-10 bg-[#23252b]/80 rounded-3xl shadow-2xl p-8 w-[90vw] max-w-xl flex flex-col items-center backdrop-blur-xl border border-[#333] animate-fadein top-10 h-fit"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-gradient-to-tr from-blue-500 via-green-400 to-purple-600 p-1 rounded-full mb-4 animate-spin-slow">
                        <div className="bg-[#1D1F24] rounded-full p-4 flex items-center justify-center shadow-lg">
                            <i className="fa-solid fa-train-subway text-4xl text-blue-400 animate-bounce"></i>
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight text-center animate-slidein">
                        Welcome to <span className="bg-gradient-to-r from-blue-400 via-green-400 to-purple-500 bg-clip-text text-transparent">Railsplit</span>
                    </h1>
                    <p className="text-lg text-gray-300 text-center max-w-md animate-fadein-slow">
                        <strong>Your smart companion for seamless train travel.</strong><br/>

                        Long routes often mean unconfirmed tickets — even if booked weeks in advance. <strong>Railsplit</strong> solves this by finding alternative split routes with higher chances of seat availability, helping you skip the hassle of waitlists and uncertainty.

                        Prefer a single route? We’ve got you covered. Our <strong>Tatkal booking service, powered by trusted agents</strong>, helps you secure last-minute confirmed seats quickly and reliably.<br/>

                        <span className="font-extrabold">Railsplit — Making every journey smooth, simple, and stress-free.</span>
                    </p>
                </div>
                <div className="w-full flex flex-col gap-6 mt-4">
                    
                    <div className="flex items-center gap-4 animate-fadein-delay2">
                        <i className="fa-solid fa-train text-blue-400 text-2xl"></i>
                        <span className="text-white text-lg font-semibold">Smart Split Journey Finder</span>
                    </div>
                    <div className="flex items-center gap-4 animate-fadein-delay">
                        <i className="fa-solid fa-bolt text-yellow-400 text-2xl"></i>
                        <span className="text-white text-lg font-semibold">Fast & Reliable Tatkal Booking</span>
                    </div>
                    <div className="flex items-center gap-4 animate-fadein-delay3">
                        <i className="fa-solid fa-receipt text-green-400 text-2xl"></i>
                        <span className="text-white text-lg font-semibold">PNR Status & Live Train Updates</span>
                    </div>
                    <div className="flex items-center gap-4 animate-fadein-delay4">
                        <i className="fa-solid fa-users text-purple-400 text-2xl"></i>
                        <span className="text-white text-lg font-semibold">Friendly & Dedicated Support</span>
                    </div>
                </div>
                <div className="mt-8 text-center animate-fadein-slow">
                    <h2 className="text-2xl font-bold text-blue-400 mb-2">Our Mission</h2>
                    <p className="text-gray-300 text-base">
                        To transform train travel by offering the smartest, fastest, and most dependable ticket booking experience in India.<br />
                        <span className="text-green-400 font-semibold">Because we believe that every journey should be simple, smooth, and worry-free.</span>
                    </p>
                </div>
                <div className="mt-8 flex flex-col items-center animate-fadein-delay4">
                    <span className="text-gray-400 text-sm mb-2">Made with <span className="text-red-400">♥</span> by Lucky Linux</span>
                    <a href="mailto:support@luckylinux.xyz" className="text-blue-400 underline hover:text-blue-300 transition">Contact us</a>
                </div>
            </div>


            {/* Animations */}
            <style>{`
                @keyframes blob1 {
                    0%,100% { transform: scale(1) translateY(0px);}
                    50% { transform: scale(1.1) translateY(30px);}
                }
                @keyframes blob2 {
                    0%,100% { transform: scale(1) translateY(0px);}
                    50% { transform: scale(1.15) translateY(-20px);}
                }
                @keyframes blob3 {
                    0%,100% { transform: scale(1) translate(-50%, -50%);}
                    50% { transform: scale(1.08) translate(-55%, -45%);}
                }
                .animate-blob1 { animation: blob1 8s ease-in-out infinite; }
                .animate-blob2 { animation: blob2 10s ease-in-out infinite; }
                .animate-blob3 { animation: blob3 12s ease-in-out infinite; }
                .animate-spin-slow { animation: spin 6s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .animate-fadein { animation: fadein 1s ease; }
                .animate-fadein-slow { animation: fadein 2s ease; }
                .animate-slidein { animation: slidein 1.2s cubic-bezier(.68,-0.55,.27,1.55); }
                .animate-fadein-delay { animation: fadein 1.5s 0.3s backwards; }
                .animate-fadein-delay2 { animation: fadein 1.5s 0.6s backwards; }
                .animate-fadein-delay3 { animation: fadein 1.5s 0.9s backwards; }
                .animate-fadein-delay4 { animation: fadein 1.5s 1.2s backwards; }
                @keyframes fadein { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none;} }
                @keyframes slidein { from { opacity: 0; transform: translateY(-40px) scale(0.9);} to { opacity: 1; transform: none;} }
            `}</style>
        </div>
    );
}

export default AboutUsPage;
