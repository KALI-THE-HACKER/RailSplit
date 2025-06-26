import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Colors:
// Primary: #1D1E24
// Secodary: #292B31
// Tertiary: #6B6C79

function ShowTrainPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const receivedData = location.state;

    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    const [backendStatus, setBackendStatus] = useState("");
    const [backendStatusType, setBackendStatusType] = useState('')
    const [directTrains, setDirectTrains] = useState([]);
    const [indirectTrains, setIndirectTrains] = useState([]);
    const [allStations, setAllStations] = useState([]);

    // Extract data from react navigate state
    const { origin, destination, trainClass, date } = receivedData?.Data || {};

    // If data not found, navigate user back to searchtrains page
    useEffect(() => {
        if (!receivedData) {
            navigate('/searchtrains');
        }
    }, [receivedData, navigate]);

    if (!receivedData) return null;

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
            if (/android/i.test(navigator.userAgent)) {
                document.documentElement.classList.add("is-android");
            }
        }

        //Fetching station.json to get the full name of intermediate
        try{
            fetch('/stations.json')
                .then((res) => res.json())
                .then((data) => setAllStations(data));
        }catch(err){
            alert(err);
        }
    }, []);

    // Fetching data from server
    useEffect(() => {
        // Don't start if required data is missing
        if (!origin || !destination || !trainClass || !date) return;

        let eventSource = null;

        const startStream = async () => {
            try {
                // Post req to get a user_id
                const res = await fetch('http://192.168.29.62:8000/start-stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': import.meta.env.VITE_RAILSPLIT_API_KEY
                    },
                    body: JSON.stringify({
                        origin,
                        destination,
                        date
                    })
                });

                if (!res.ok) throw new Error("Failed to start stream");

                // Get a user_id from the backend
                const { user_id } = await res.json();

                // Open EventSource for actually fetching trains data using SSE
                eventSource = new EventSource(`http://192.168.29.62:8000/railsplit-server?user_id=${user_id}`);

                function processApiResponse(data) {
                    if (Array.isArray(data)) {
                        setDirectTrains(data[0]?.["Direct-trains"] || []);

                        // Filter out the direct trains object and get only indirect trains
                        const indirectTrains = data.filter(item => 
                        item.hasOwnProperty('intermediate'));

                        //Sorting mechanism for indirectTrains Array
                        indirectTrains.sort((a, b) => ((a.duration || 0) + (a.layover || 15)) - ((b.duration || 0) + b.layover || 15));

                        setIndirectTrains(indirectTrains || []);
                    } else if (data["Direct-trains"]) {
                        setDirectTrains(data["Direct-trains"]);
                        setIndirectTrains([]);
                    } else {
                        // Handle other possible structures or ignore
                        //Do nothing
                    }
                }

                eventSource.onmessage = (event) => {
                    try {
                        // Try to parse only if it looks like JSON (starts with { or [)
                        const trimmed = event.data.trim();
                        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                            const data = JSON.parse(trimmed);
                            //If it's a status message
                            if(data.status){
                                setBackendStatus(data.status);
                                if(data.type){
                                    setBackendStatusType(data.type);
                                }
                            } else { 
                                processApiResponse(data);
                            }
                        } else {
                            // Optionally handle non-JSON messages (e.g., status)
                            setBackendStatus(trimmed);
                        }
                    } catch (e) {
                        // Optionally log the error
                        alert("Error parsing server message: " + e.message);
                        setBackendStatus("Error parsing server message");
                        setBackendStatusType("#B91C1C");
                    }
                };

                eventSource.onerror = (err) => {
                    setBackendStatus(`Connection lost due to some error!`);
                    setBackendStatusType("#B91C1C");
                    eventSource.close();
                };

            } catch (error) {
                alert(`Error: ${error}.\nRefresh the page!`);
            }
        };

        startStream();

        // Cleanup on unmount
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
        // eslint-disable-next-line
    }, [origin, destination, trainClass, date]);
    
    const timeFormatter = (timeInMinutes) => {
        if(Math.floor(timeInMinutes/60)>=1){
            return `${Math.floor(timeInMinutes/60)}hr ${timeInMinutes%60}min`
        }
    };

    return (
        <>
            <div className="relative h-screen w-full bg-black flex flex-col">
                <div ref={headerRef} className="fixed top-0 h-fit w-full bg-[#16161a] px-2 py-2 flex flex-col gap-7 rounded-b-2xl z-50">
                    <div className="flex flex-row items-center w-full">
                        <i onClick={() => navigate('/searchtrains')} className="absolute fa-solid fa-angle-left text-[#767676] text-2xl"></i>
                        <h2 className="relative text-white text-lg top-[4px] left-1/2 -translate-x-1/2">Trains with confirm seat</h2>
                    </div>
                    <div className="relative flex flex-row items-center mx-8 gap-5">
                        <div className="flex flex-col items-start text-left">
                            <h1 className="text-white text-xl font-semibold">{origin?.code}</h1>
                            <p className="text-gray-500 android-text-12">{origin?.name}</p>
                        </div>
                        <i className="absolute fa-solid fa-right-left text-gray-500 left-1/2 -translate-x-1/2"></i>
                        <div className="absolute right-0 flex flex-col items-end text-right">
                            <h1 className="text-white text-xl font-semibold">{destination?.code}</h1>
                            <p className="text-gray-500 android-text-12">{destination?.name}</p>
                        </div>
                    </div>
                </div>

                {/* Snackbar for backendStatus */}
                <div className="fixed w-[90vw] blue mx-[5vw] px-3 h-fit text-white text-center rounded-lg z-1" style={{ marginTop: `${headerHeight + 10}px`, backgroundColor: `${backendStatusType}` }}>
                    <p>{backendStatus}</p>

                </div>

                <div className="relative flex-1 bg-black h-full w-full overflow-y-auto flex flex-col items-center gap-3 px-4 bottom-5" style={{ marginTop: `${headerHeight +60}px` }}>
                    <p className="text-gray-300 bg-black text-center">-:  Direct trains :-</p>

                    {directTrains.length !== 0 ?
                    (directTrains.map((train, index) => (
                        <div key={index} className="bg-[#1c1c1e] h-fit rounded-xl w-full mx-auto px-5 py-3 rounded-box">
                            <div className="flex flex-row w-full justify-between">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-white text-2xl android-text-20">{train.departure?.[0]}</h2>
                                    <p className="text-gray-500 android-text-12">{origin?.code}</p>
                                    <p className="text-gray-500 android-text-12 font-bold text-[14px] mb-1">
                                        {train.departure?.[1]} {train.departure?.[2]} {train.departure?.[3]}
                                    </p>
                                </div>

                                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                                    <div />
                                    <div className="w-full flex items-center justify-center gap-[2px]">
                                        {Array.from({ length: 15 }).map((_, i) => (
                                            <div key={i} className="w-[8px] h-[2px] bg-[#3B3F48] rounded"></div>
                                        ))}
                                    </div>
                                    <div className="text-center android-text-12">
                                        <span className="inline-block px-2 py-1 rounded bg-[#23242a] text-green-400 text-xs font-medium">
                                            Duration: {train.duration}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <h2 className="text-white text-2xl text-right android-text-20">{train.arrival?.[0]}</h2>
                                    <p className="text-gray-500 android-text-12">{destination?.code}</p>
                                    <p className="text-gray-500 android-text-12 text-[14px] font-bold text-right">{train.arrival?.[1]} {train.arrival?.[2]} {train.arrival?.[3]}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-row flex-nowrap gap-3 overflow-x-auto hide-scrollbar">
                                {train.seat_availabilty &&
                                Object.entries(train.seat_availabilty).map(([seatClass, seats]) => (
                                    <div key={seatClass} className="bg-[#292B31] mt-2 h-fit min-w-[80px]  rounded-xl flex flex-col flex-shrink-0 px-3 py-0.5">
                                        <p className="text-[12px] font-bold">{seatClass}</p>
                                        {seats.split(' ')[0] == "AVL" ?
                                            <p className="text-green-500 text-[11px]">{seats}</p>
                                            : seats.split(' ')[0] == "RAC" ?
                                            <p className="text-blue-500 text-[11px]">{seats}</p>
                                            : <p className="text-#B91C1C-500 text-[11px]">{seats}</p>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    )))

                    : <span className="loader" />}

                    <p className="text-white bg-black text-center">-:  In-direct trains  :-</p>
                    {indirectTrains.length !== 0 ? 

                    (indirectTrains.map((train, index) => (
                        <div key={index} className="bg-[#1c1c1e] h-fit rounded-xl w-full mx-auto px-5 py-3 rounded-box">
                            <div className="flex flex-row w-full justify-between">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-white text-2xl android-text-20">{train.train1_departure_time}</h2>
                                    <p className="text-gray-500 android-text-12">{origin?.code}</p>
                                    <p className="text-gray-500 android-text-12 mb-1 text-[14px] font-bold text-left">
                                        {train.train1_departure_date}
                                    </p>
                                </div>

                                <div className="flex flex-1 flex-col items-center justify-start gap-2">
                                    <div className="text-blue-300/60 text-[16px]">via {(allStations.find(st => st.Code === train.intermediate)).Name.charAt(0).toUpperCase() + (allStations.find(st => st.Code === train.intermediate)).Name.slice(1).toLowerCase()}</div>
                                    <div>
                                        
                                    </div>
                                    <div className="w-full flex items-center justify-center gap-[2px]">
                                        {Array.from({ length: 15 }).map((_, i) => (
                                            <div key={i} className="w-[8px] h-[2px] bg-[#3B3F48] rounded"></div>
                                        ))}
                                    </div>
                                    
                                </div>

                                <div className="flex flex-col items-end">
                                    <h2 className="text-white text-2xl text-right android-text-20">{train.train2_arrival_time}</h2>
                                    <p className="text-gray-500 android-text-1 items-end2">{destination?.code}</p>
                                    <p className="text-gray-500 android-text-12 mb-1 text-[14px] font-bold text-right">
                                        {train.train2_arrival_date}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center android-text-12 flex flex-row  w-full justify-around pt-3 pb-1">
                                <span className="inline-block px-2 py-1 rounded bg-[#23242a] text-green-400 text-xs font-medium">
                                    Duration: {timeFormatter(train.duration)}
                                </span>
                                <span className="inline-block px-2 py-1 rounded bg-[#23242a] text-yellow-300 text-xs font-medium">
                                    Layover: {timeFormatter(train.layover)}
                                </span>
                            </div>
                            
                        </div>
                    )))

                    : <span className="loader"/>}
                </div>
            </div>
        </>
    );
}

export default ShowTrainPage;