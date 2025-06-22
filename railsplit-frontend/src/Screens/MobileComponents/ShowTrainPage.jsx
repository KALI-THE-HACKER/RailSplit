import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Colors:
// Primary: #1D1E24
// Secodary: #292B31
// Tertiary: #6B6C79

function ShowTrainPage(){
    const location = useLocation();
    const navigate = useNavigate();
    const receivedData = location.state;

    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    
    //If data not found, navigate user back to searchtrains page
    useEffect(() => {
        if(!receivedData){
            navigate('/searchtrains');
        }
    }, [receivedData, navigate]);
    
    if(!receivedData) return null;
    
    useEffect(() => {
    if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
        if (/android/i.test(navigator.userAgent)) {
            document.documentElement.classList.add("is-android");
        }
    }
    }, []);

    const { origin, destination, trainClass, date } = receivedData.Data;

    //Fake data for UI testing
    const direct_trains = {
        "12951": {
            train_name: "Mumbai Rajdhani",
            from_st: "BCT",
            to_st: "NDLS",
            depart: { time: "16:00", day: "Mon", date: "10", month: "Jun" },
            arrive: { time: "08:00", day: "Tue", date: "11", month: "Jun" },
            duration: "16h",
            inbetween_jn: "Mumbai JN",
            layover: "30min"
        },
        "12251": {
            train_name: "Mumbai Rajdhani",
            from_st: "BCT",
            to_st: "NDLS",
            depart: { time: "16:00", day: "Mon", date: "10", month: "Jun" },
            arrive: { time: "08:00", day: "Tue", date: "11", month: "Jun" },
            duration: "16h 30min",
            inbetween_jn: "Mumbai JN",
            layover: "30min"
        },
        "12950": {
            train_name: "Mumbai Rajdhani",
            from_st: "BCT",
            to_st: "NDLS",
            depart: { time: "16:00", day: "Mon", date: "10", month: "Jun" },
            arrive: { time: "08:00", day: "Tue", date: "11", month: "Jun" },
            duration: "16h",
            inbetween_jn: "Mumbai JN",
            layover: "30min"
        },
        "13951": {
            train_name: "Mumbai Rajdhani",
            from_st: "BCT",
            to_st: "NDLS",
            depart: { time: "16:00", day: "Mon", date: "10", month: "Jun" },
            arrive: { time: "08:00", day: "Tue", date: "11", month: "Jun" },
            duration: "16h",
            inbetween_jn: "Mumbai JN",
            layover: "30min"
        },
        "12921": {
            train_name: "Mumbai Rajdhani",
            from_st: "BCT",
            to_st: "NDLS",
            depart: { time: "16:00", day: "Mon", date: "10", month: "Jun" },
            arrive: { time: "08:00", day: "Tue", date: "11", month: "Jun" },
            duration: "16h",
            inbetween_jn: "Mumbai JN",
            layover: "30min"
        },
        "12931": {
            train_name: "Mumbai Rajdhani",
            from_st: "BCT",
            to_st: "NDLS",
            depart: { time: "16:00", day: "Mon", date: "10", month: "Jun" },
            arrive: { time: "08:00", day: "Tue", date: "11", month: "Jun" },
            duration: "16h",
            inbetween_jn: "Mumbai JN",
            layover: "30min"
        },
        "129001": {
            train_name: "Mumbai Rajdhani",
            from_st: "BCT",
            to_st: "NDLS",
            depart: { time: "16:00", day: "Mon", date: "10", month: "Jun" },
            arrive: { time: "08:00", day: "Tue", date: "11", month: "Jun" },
            duration: "16h",
            inbetween_jn: "Mumbai JN",
            layover: "30min"
        },

    };


    return(
        <>
            <div className="relative h-screen w-full bg-black flex flex-col">
                <div ref={headerRef} className="fixed top-0 h-fit w-full bg-[#16161a] px-2 py-2 flex flex-col gap-7 rounded-b-2xl z-50">
                    <div className="flex flex-row items-center w-full">
                    <i onClick={() => navigate('/searchtrains')} className="absolute fa-solid fa-angle-left text-[#767676] text-2xl"></i>
                    <h2 className="relative text-white text-lg top-[4px] left-1/2 -translate-x-1/2">Trains with confirm seat</h2>
                    </div>
                    <div className="relative flex flex-row items-center mx-8 gap-5">
                    <div className="flex flex-col items-start text-left">
                        <h1 className="text-white text-xl font-semibold">{origin.code}</h1>
                        <p className="text-gray-500 android-text-12">{origin.name}</p>
                    </div>
                    <i className="absolute fa-solid fa-right-left text-gray-500 left-1/2 -translate-x-1/2"></i>
                    <div className="absolute right-0 flex flex-col items-end text-right">
                        <h1 className="text-white text-xl font-semibold">{destination.code}</h1>
                        <p className="text-gray-500 android-text-12">{destination.name}</p>
                    </div>
                    </div>
                </div>
                

                <div className="relative flex-1 bg-black h-full w-full overflow-y-auto flex flex-col items-center gap-3 px-4 bottom-5" style={{ marginTop: `${headerHeight+30}px` }}>

                    <p className="text-gray-300 bg-black text-center">-:  Direct trains :-</p>

                    {Object.entries(direct_trains).map(([trainNumber, train]) => (
                        <div className="bg-[#1c1c1e] h-fit rounded-xl w-full mx-auto px-5 py-3 rounded-box">
                            <div className="flex flex-row w-full justify-between">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-white text-2xl android-text-20">{train.depart.time}</h2>
                                    <p className="text-gray-500 android-text-12">{origin.code}</p>
                                    <p className="text-gray-500 android-text-12">{train.depart.day}, {train.depart.date} {train.depart.month}</p>
                                </div>
                                
                                <div className="flex flex-1 flex-col items-center gap-1 h-16 justify-between">
                                    <h2 className="text-green-500 android-text-12">via {train.inbetween_jn}</h2>
                                    <div className="w-5/6 flex items-center gap-[4px]">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="w-[8px] h-[1.8px] bg-[#3B3F48] rounded"></div>
                                        ))}
                                        </div>
                                        <div className="text-center android-text-12 mt-1"><p className="text-green-700">Duration: {train.duration}</p>
                                    <p className="text-blue-600">Layover: {train.layover}</p></div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <h2 className="text-white text-2xl text-right android-text-20">{train.arrive.time}</h2>
                                    <p className="text-gray-500 android-text-12">{destination.code}</p>
                                    <p className="text-gray-500 android-text-12">{train.arrive.day}, {train.arrive.date} {train.arrive.month}</p>
                                </div>
                            </div>

                            <div className="flex flex-row">
                                    <div className="bg-[#292B31] mt-2 h-10 w-20 rounded-2xl"></div>
                            </div>
                        </div>
                    ))}

                    <p className="text-white bg-black text-center">-:  In-direct trains  :-</p>
                </div>

            </div> 
            
        </>
    );
};

export default ShowTrainPage;