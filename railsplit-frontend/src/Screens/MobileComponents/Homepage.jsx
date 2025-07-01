import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

function Homepage(props){
    const { username } = props;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (err) {
            alert("Logout failed: " + err.message);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return(
        <>
            <div className="h-screen min-h-screen w-screen bg-black py-7 mb-10 px-5 text-white">
                <h1 className="text-3xl title font-semibold mx-2 mb-7">Hello {username} 👋</h1>
                <p className="text-gray-400 my-3 mx-4">Railsplit Services</p>

                <div className="relative flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                        <div onClick={() => {navigate('/searchtrains')}} className="bg-[#3D73E6] h-[25vh] w-[45vw] rounded-[1.7rem] px-3 py-3">
                            <div className="bg-[#5081E8] h-[7vh] w-[14vw] rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-train-subway text-white text-4xl"></i>
                            </div>
                            <h2 className="mt-2 text-xl font-semibold">In-direct Train</h2>
                            <p className="text-xs my-1">No confirmed seat? Try indirect train booking!</p>
                        </div>
                        <div onClick={() => {navigate('/tatkal')}} className="bg-[#1D1F24] h-[25vh] w-[45vw] rounded-[1.7rem] px-3 py-3">
                            <div className="bg-[#28292E] h-[7vh] w-[14vw] rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-bolt text-white text-4xl"></i>
                            </div>
                            <h2 className="mt-2 text-xl font-semibold">Tatkal</h2>
                            <p className="text-xs my-1">Struggling with Tatkal tickets? Book easily through our agents!</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div onClick={() => {navigate('/pnrstatus')}} className="bg-[#1D1F24] h-[25vh] w-[45vw] rounded-[1.7rem] px-3 py-3">
                            <div className="bg-[#28292E] h-[7vh] w-[14vw] rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-receipt text-white text-4xl"></i>
                            </div>
                            <h2 className="mt-2 text-xl font-semibold">PNR Status</h2>
                            <p className="text-xs my-1">Check your ticket & seat status instantly</p>
                        </div>
                        <div onClick={() => {navigate('/livetrainstatus')}} className="bg-[#1D1F24] h-[25vh] w-[45vw] rounded-[1.7rem] px-3 py-3">
                            <div className="bg-[#28292E] h-[7vh] w-[14vw] rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-map-marker-alt text-white text-4xl"></i>
                            </div>
                            <h2 className="mt-2 text-xl font-semibold">Live Train Status</h2>
                            <p className="text-xs my-1">Track your train in real-time</p>
                        </div>
                    </div>
                </div>
                <div className="h-10"></div>
                <p className="text-gray-400 my-3 mx-4">Other pages</p>

                <div className="relative flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                        <div onClick={() => {navigate('/contactus')}} className="bg-[#1D1F24] h-auto w-[45vw] rounded-[1.3rem] px-3 py-2">
                            <h2 className="text-xl">Contact us</h2>
                            <p className="text-xs mt-1">Have questions or need help?</p>
                        </div>
                        <div onClick={() => {navigate('/aboutus')}} className="bg-[#1D1F24] h-auto w-[45vw] rounded-[1.3rem] px-3 py-2">
                            <h2 className="text-xl">About us</h2>
                            <p className="text-xs mt-1">Know how Railsplit helps simplify train travel</p>
                        </div>
                    </div>
                </div>

                {/* Logout Button at the bottom */}
                <div className="w-full flex justify-center mt-10">
                    <button
                        onClick={handleLogout}
                        className="bg-[#23252b] hover:bg-[#2d3038] text-white px-7 py-3 rounded-2xl shadow-lg text-lg font-semibold transition-all duration-200 border border-[#333] flex items-center gap-2"
                        style={{letterSpacing: '0.03em'}}
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}

export default Homepage;