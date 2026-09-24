import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

function DesktopHomepage({ username }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            navigate('/');
        } catch (err) {
            alert("Logout failed: " + err.message);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-black text-white py-12 px-8">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">
                {/* Header Welcome Banner */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1f2129]">
                    <h1 className="text-3xl font-semibold">
                        Hello {username || "Traveller"} 👋
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-[#23252b] hover:bg-[#2d3038] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition border border-[#333] flex items-center gap-2 cursor-pointer"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Logout</span>
                    </button>
                </div>

                {/* Services */}
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-4">Railsplit Services</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Service 1 */}
                        <div
                            onClick={() => navigate('/searchtrains')}
                            className="bg-[#3D73E6] hover:bg-[#3467d1] rounded-2xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between h-48"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#5081E8] flex items-center justify-center text-2xl text-white">
                                <i className="fa-solid fa-train-subway"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">In-direct Train</h2>
                                <p className="text-xs text-blue-100 mt-1">No confirmed seat? Try indirect train booking!</p>
                            </div>
                        </div>

                        {/* Service 2 */}
                        <div
                            onClick={() => navigate('/tatkal')}
                            className="bg-[#1D1F24] hover:bg-[#252830] border border-[#2a2d36] rounded-2xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between h-48"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#28292E] flex items-center justify-center text-2xl text-white">
                                <i className="fa-solid fa-bolt"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Tatkal</h2>
                                <p className="text-xs text-gray-400 mt-1">Struggling with Tatkal tickets? Book easily through our agents!</p>
                            </div>
                        </div>

                        {/* Service 3 */}
                        <div
                            onClick={() => navigate('/pnrstatus')}
                            className="bg-[#1D1F24] hover:bg-[#252830] border border-[#2a2d36] rounded-2xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between h-48"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#28292E] flex items-center justify-center text-2xl text-white">
                                <i className="fa-solid fa-receipt"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">PNR Status</h2>
                                <p className="text-xs text-gray-400 mt-1">Check your ticket & seat status instantly</p>
                            </div>
                        </div>

                        {/* Service 4 */}
                        <div
                            onClick={() => navigate('/livetrainstatus')}
                            className="bg-[#1D1F24] hover:bg-[#252830] border border-[#2a2d36] rounded-2xl p-6 transition duration-150 cursor-pointer flex flex-col justify-between h-48"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#28292E] flex items-center justify-center text-2xl text-white">
                                <i className="fa-solid fa-map-marker-alt"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Live Train Status</h2>
                                <p className="text-xs text-gray-400 mt-1">Track your train in real-time</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other pages */}
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-4">Other pages</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div
                            onClick={() => navigate('/contactus')}
                            className="bg-[#1D1F24] hover:bg-[#252830] border border-[#2a2d36] rounded-2xl p-5 cursor-pointer transition"
                        >
                            <h2 className="text-xl font-semibold">Contact us</h2>
                            <p className="text-xs text-gray-400 mt-1">Have questions or need help?</p>
                        </div>

                        <div
                            onClick={() => navigate('/aboutus')}
                            className="bg-[#1D1F24] hover:bg-[#252830] border border-[#2a2d36] rounded-2xl p-5 cursor-pointer transition"
                        >
                            <h2 className="text-xl font-semibold">About us</h2>
                            <p className="text-xs text-gray-400 mt-1">Know how Railsplit helps simplify train travel</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesktopHomepage;
