import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Colors:
// Primary: #1D1E24
// Secodary: #292B31
// Tertiary: #6B6C79

function ShowTrainPage(){
    const location = useLocation();
    const navigate = useNavigate();
    const receivedData = location.state;

    
    //If data not found, navigate user back to searchtrains page
    useEffect(() => {
        if(!receivedData){
            navigate('/searchtrains');
        }
    }, [receivedData, navigate]);
    
    if(!receivedData) return null;

    const { origin, destination, trainClass, date } = receivedData.Data;

    //Fake data for UI testing
    const trains = {
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
    };


    return(
        <>
           <div className="relative h-screen w-full bg-black flex flex-col">
                <div className="fixed top-0 h-30 w-full bg-[#1D1E24] px-2 py-3 flex flex-col gap-5 rounded-b-2xl z-100">
                    <div className="flex flex-row items-center w-full">
                        <i onClick={() => navigate('/searchtrains')} className="absolute fa-solid fa-angle-left text-[#767676] text-2xl"></i>
                        <h2 className="absolute text-white text-xl left-1/2 -translate-x-1/2">Trains with confirm seat</h2>
                    </div>

                    <div className="relative flex flex-row items-center mx-8 gap-5">
                        <div className="flex flex-col items-start text-left">
                            <h1 className="text-white text-xl font-semibold">{origin.code}</h1>
                            <p className="text-gray-500">{origin.name}</p>
                        </div>

                        <div  className="flex-1 border-t-2 border-dashed border-[#3B3F48]"></div>

                        <div className="flex flex-col items-end text-right">
                            <h1 className="text-white text-xl font-semibold">{destination.code}</h1>
                            <p className="text-gray-500">{destination.name}</p>
                        </div>
                    </div>

                </div>

                <div className="relative top-30 bg-black h-full w-full flex flex-col items-center gap-3 px-4">
                    
                    //trainClasses

                    {Object.entries(trains).map(([trainNumber, train]) => (
                        <div className="bg-[#16161a] h-50 rounded-xl w-full mx-auto px-5 py-3">
                            <div className="flex flex-row w-full justify-between">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-white text-2xl">{train.depart.time}</h2>
                                    <p className="text-gray-500">{origin.name}</p>
                                    <p className="text-gray-500">{train.depart.day}, {train.depart.date} {train.depart.month}</p>
                                </div>
                                
                                <div className="flex flex-1 flex-col items-center gap-2 h-16 justify-between">
                                    <h2 className="text-gray-500">via {train.inbetween_jn}</h2>
                                    <div className="border-dashed border-t-2 border-[#3B3F48] w-3/4 h-0.5"></div>
                                    <div className="text-center"><p className="text-gray-500">Duration: {train.duration}</p>
                                    <p className="text-gray-500">Layover: {train.layover}</p></div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <h2 className="text-white text-2xl text-right">{train.arrive.time}</h2>
                                    <p className="text-gray-500">{destination.name}</p>
                                    <p className="text-gray-500">{train.arrive.day}, {train.arrive.date} {train.arrive.month}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> 
            
        </>
    );
};

export default ShowTrainPage;