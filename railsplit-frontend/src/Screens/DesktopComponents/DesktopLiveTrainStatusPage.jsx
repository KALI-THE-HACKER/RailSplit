import React from "react";
import { useNavigate } from "react-router-dom";

function DesktopLiveTrainStatusPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-black text-white py-12 px-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#767676] hover:text-white transition cursor-pointer text-xl"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <h1 className="text-2xl font-semibold">Live Train Status</h1>
                </div>

                <div className="bg-[#1D1F24] rounded-2xl shadow-lg p-8 w-full flex flex-col items-center text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Coming Soon</h2>
                    <p className="text-lg text-gray-300 text-center mb-6 leading-relaxed">
                        This feature is under development.<br />
                        We are currently working on it and will be launching it soon!
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition cursor-pointer"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DesktopLiveTrainStatusPage;
