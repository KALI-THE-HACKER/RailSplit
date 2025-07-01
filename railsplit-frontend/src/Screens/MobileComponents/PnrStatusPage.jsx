import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PnrStatusPage() {
    const [pnr, setPnr] = useState("");
    const [loading, setLoading] = useState(false);
    const [pnrData, setPnrData] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setPnr(e.target.value.replace(/\D/g, "").slice(0, 10));
    };

    const handleCheckStatus = async () => {
        setError("");
        setPnrData(null);
        if (pnr.length !== 10) {
            setError("Please enter a valid 10-digit PNR number.");
            return;
        }
        setLoading(true);
        // Call your function to fetch PNR status here
        // Example:
        // const data = await fetchPnrStatus(pnr);
        // setPnrData(data);
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen h-screen bg-black items-center px-5 py-10">
            {/* Header */}
            <div className="fixed flex flex-row items-center w-full top-5 left-0 z-20">
                <i onClick={() => navigate('/')} className="fa-solid fa-angle-left text-[#767676] text-2xl ml-1 mt-2" />
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#1D1F24] h-12 w-[90vw] flex justify-center items-center rounded-4xl mt-2">
                    <h2 className="text-white text-2xl font-semibold">PNR Status</h2>
                </div>    
            </div>
            <div className="relative bg-[#1D1F24] rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center top-1/2 -translate-y-5/8">
                <h1 className="text-3xl font-bold text-white mb-6">Check PNR Status</h1>
                <input
                    type="text"
                    value={pnr}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit PNR"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-[#28292E] text-white text-xl mb-4 outline-none border border-gray-600 focus:border-blue-500 transition"
                    inputMode="numeric"
                    pattern="\d*"
                />
                <button
                    onClick={handleCheckStatus}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-lg transition mb-2"
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Get Status"}
                </button>
                {error && <div className="text-red-400 mt-2">{error}</div>}
                {/* Render PNR data here if needed */}
                {pnrData && (
                    <div className="mt-6 w-full text-white">
                        {/* Render your PNR status details here */}
                        {/* Example: <pre>{JSON.stringify(pnrData, null, 2)}</pre> */}
                    </div>
                )}
            </div>
            {loading  && 
                <div className="fixed top-0 left-0 h-screen w-screen z-50 bg-black/40 flex flex-col gap-7 items-center justify-center backdrop-blur-xs">
                    <span className="loader"></span>
                    <span>Loading...</span>
                </div>
            }
        </div>
    );
}

export default PnrStatusPage;
