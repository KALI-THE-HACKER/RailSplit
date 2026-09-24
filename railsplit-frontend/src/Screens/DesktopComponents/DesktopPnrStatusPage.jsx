import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DesktopPnrStatusPage() {
    const [pnr, setPnr] = useState("");
    const [loading, setLoading] = useState(false);
    const [pnrData, setPnrData] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const apikey = import.meta.env.VITE_RAILSPLIT_API_KEY;

    const handleInputChange = (e) => {
        setPnr(e.target.value.replace(/\D/g, "").slice(0, 10));
    };

    const handleCheckStatus = async (e) => {
        if (e) e.preventDefault();
        setError("");
        if (pnr.length !== 10) {
            setError("Please enter a valid 10-digit Indian Railways PNR number.");
            return;
        }

        setLoading(true);
        try {
            const backendEndpoint = import.meta.env.VITE_RAILSPLIT_BACKEND_ENDPOINT || "http://127.0.0.1:8000";
            const response = await fetch(`${backendEndpoint}/pnr-status/${pnr}/apikey/${apikey}`);

            if (response.status === 422) {
                setError("Invalid or expired PNR number. Please verify your 10-digit ticket number.");
                setPnrData(null);
                return;
            } else if (!response.ok) {
                throw new Error(`Server returned status: ${response.status}`);
            }

            const json = await response.json();
            setPnrData(json);
        } catch (err) {
            setError("Could not retrieve PNR status. Please check your connection or try again later.");
            console.error("PNR fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-black text-white py-10 px-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                {/* Header Row */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#767676] hover:text-white transition cursor-pointer text-xl"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <h1 className="text-2xl font-semibold">PNR Status</h1>
                </div>

                {/* Search Bar Card */}
                <div className="bg-[#14151b] border border-[#242630] rounded-3xl p-6 shadow-2xl">
                    <form onSubmit={handleCheckStatus} className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full">
                            <input
                                type="text"
                                value={pnr}
                                onChange={handleInputChange}
                                placeholder="Enter 10-digit PNR number..."
                                maxLength={10}
                                inputMode="numeric"
                                pattern="\d*"
                                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[#1b1d25] border border-[#2c2f3c] text-white font-mono text-lg font-bold outline-none focus:border-emerald-500 transition placeholder:text-gray-500 placeholder:font-sans placeholder:text-base placeholder:font-normal"
                                autoFocus
                            />
                            <i className="fa-solid fa-ticket absolute left-4.5 top-5 text-gray-500 text-base"></i>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || pnr.length !== 10}
                            className="w-full md:w-auto px-8 h-14 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-base rounded-2xl transition shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-magnifying-glass text-sm"></i>
                                    <span>Get PNR Status</span>
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                            {error}
                        </div>
                    )}
                </div>

                {/* PNR Results Card */}
                {pnrData && (
                    <div className="bg-[#14151b] border border-[#242630] rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
                        {/* Top Summary */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#22242e] gap-4">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                    PNR: {pnrData.pnr}
                                </div>
                                <h2 className="text-2xl font-extrabold text-white mt-0.5 font-['Montserrat']">
                                    {pnrData.train_name}
                                </h2>
                            </div>

                            <div className="flex items-center gap-3">
                                {pnrData.class && (
                                    <span className="px-3 py-1 rounded-xl bg-[#1b1d25] border border-[#2c2f3c] text-xs font-semibold text-gray-300">
                                        Class: <strong className="text-white">{pnrData.class}</strong>
                                    </span>
                                )}
                                {pnrData.platform && (
                                    <span className="px-3 py-1 rounded-xl bg-[#1b1d25] border border-[#2c2f3c] text-xs font-semibold text-gray-300">
                                        Platform: <strong className="text-white">{pnrData.platform}</strong>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Journey Origin / Destination Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#1b1d25] border border-[#272935]">
                            <div>
                                <div className="text-xs font-semibold text-gray-400 uppercase">Boarding From</div>
                                <div className="text-xl font-bold text-white mt-1">
                                    {pnrData.from_st_code}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {pnrData.from_st_name}
                                </div>
                                <div className="text-xs font-medium text-emerald-400 mt-2">
                                    Departs: {pnrData.departure_time} ({pnrData.boarding_day})
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-[#2b2e3c] py-4 md:py-0">
                                <span className="text-xs text-gray-500 font-semibold mb-1">Duration</span>
                                <div className="text-base font-bold text-white bg-[#14151b] px-3 py-1 rounded-full border border-[#282a36]">
                                    {pnrData.journey_time || "N/A"}
                                </div>
                                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent my-2"></div>
                                <span className="text-[11px] text-gray-400">Confirmed Booking</span>
                            </div>

                            <div className="text-left md:text-right">
                                <div className="text-xs font-semibold text-gray-400 uppercase">Destination</div>
                                <div className="text-xl font-bold text-white mt-1">
                                    {pnrData.to_st_code}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {pnrData.to_st_name}
                                </div>
                                <div className="text-xs font-medium text-blue-400 mt-2">
                                    Arrives: {pnrData.arrival_time}
                                </div>
                            </div>
                        </div>

                        {/* Passenger Details Table */}
                        <div>
                            <h3 className="text-base font-bold text-white mb-4">
                                Passenger Status Breakdown
                            </h3>

                            <div className="border border-[#242630] rounded-2xl overflow-hidden bg-[#121319]">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#171922] text-xs uppercase font-bold text-gray-400 border-b border-[#242630]">
                                        <tr>
                                            <th className="py-3.5 px-5">Passenger</th>
                                            <th className="py-3.5 px-5">Booking Status</th>
                                            <th className="py-3.5 px-5">Current Status</th>
                                            <th className="py-3.5 px-5 text-right">Coach / Berth</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#22242e]">
                                        {pnrData.status && pnrData.status.length > 0 ? (
                                            pnrData.status.map((p, idx) => {
                                                const isCurrentConfirmed = p.current_status === "Confirmed";
                                                const isBookingConfirmed = p.booking_status === "Confirmed";
                                                return (
                                                    <tr key={idx} className="hover:bg-[#1a1c26] transition">
                                                        <td className="py-4 px-5 font-semibold text-white">
                                                            {p.passenger || `Passenger ${idx + 1}`}
                                                        </td>
                                                        <td className="py-4 px-5">
                                                            <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                                                                isBookingConfirmed ? "text-emerald-400 bg-emerald-500/10" : "text-gray-300 bg-gray-800"
                                                            }`}>
                                                                {p.booking_status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-5">
                                                            <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                                                                isCurrentConfirmed ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30" : "text-amber-400 bg-amber-500/15 border border-amber-500/30"
                                                            }`}>
                                                                {p.current_status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-5 text-right font-mono font-bold text-gray-200">
                                                            {p.coach || "--"}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-6 px-5 text-center text-xs text-gray-500">
                                                    No passenger records returned for this PNR.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DesktopPnrStatusPage;
