import React from "react";
import { Link } from "react-router-dom";

export default function DesktopView() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#1D1F24] to-[#23252b] relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute bg-blue-500 opacity-30 rounded-full w-[32rem] h-[32rem] top-[-8rem] left-[-8rem] animate-blob1"></div>
            <div className="absolute bg-green-400 opacity-20 rounded-full w-[36rem] h-[36rem] bottom-[-10rem] right-[-10rem] animate-blob2"></div>
            <div className="absolute bg-purple-600 opacity-20 rounded-full w-[28rem] h-[28rem] top-1/2 left-1/2 animate-blob3"></div>
            
            <div className="relative z-10 bg-[#1D1F24]/80 rounded-3xl shadow-2xl max-w-2xl w-full mx-4 px-10 py-16 flex flex-col items-center backdrop-blur-md border border-blue-400/10">
                <h1 className="text-5xl font-extrabold text-white mb-6 text-center tracking-tight drop-shadow-lg">
                    Desktop View Coming Soon!
                </h1>
                <p className="text-xl text-gray-300 mb-8 text-center max-w-xl">
                    Our website currently supports only mobile and tablet screens.<br />
                    The desktop version is under development and will be available soon.<br />
                    Please visit us on your mobile device for the best experience!
                </p>
                <div className="flex flex-col items-center gap-4 mb-6">
                    <i className="fa-solid fa-laptop-code text-blue-400 text-6xl mb-2"></i>
                    <span className="text-lg text-gray-400">Thank you for your patience!</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-lg text-gray-300">Contact us if you have any queries:</span>
                    <Link
                        to="https://portfolio.luckylinux.xyz#contact"
                        className="text-blue-400 underline text-lg hover:text-blue-300 transition"
                    >
                        Go to Contact Page
                    </Link>
                </div>
            </div>
            {/* Blobs animation */}
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
                .animate-blob1 { animation: blob1 8s ease-in-out infinite; will-change: transform; }
                .animate-blob2 { animation: blob2 10s ease-in-out infinite; will-change: transform; }
                .animate-blob3 { animation: blob3 12s ease-in-out infinite; will-change: transform; }
            `}</style>
        </div>
    );
}