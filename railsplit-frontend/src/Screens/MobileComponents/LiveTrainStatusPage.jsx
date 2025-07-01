import React from "react";
import { useNavigate } from "react-router-dom";

function LiveTrainStatusPage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen h-screen bg-black flex flex-col items-center justify-center px-5 py-10">
            {/* Header */}
            <div className="fixed flex flex-row items-center w-full top-5 left-0 z-20">
                <i onClick={() => navigate('/')} className="fa-solid fa-angle-left text-[#767676] text-2xl ml-1 mt-2" />
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#1D1F24] h-12 w-[90vw] flex justify-center items-center rounded-4xl mt-2">
                    <h2 className="text-white text-2xl font-semibold">Live Train Status</h2>
                </div>    
            </div>
            {/* Centered Card */}
            <div className="bg-[#1D1F24] rounded-2xl shadow-lg p-8 w-[90vw] max-w-md flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <h1 className="text-3xl font-bold text-white mb-6">Coming Soon</h1>
                <p className="text-lg text-gray-300 text-center mb-2">
                    This feature is under development.<br />
                    We are currently working on it and will be launching it soon!
                </p>
            </div>
        </div>
    );
}

export default LiveTrainStatusPage;
