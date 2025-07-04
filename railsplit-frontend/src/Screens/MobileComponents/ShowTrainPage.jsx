import { key } from "fontawesome";
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
    const [popupCardData, setPopupCardData] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationShowed, setNotificationShowed] = useState(false);



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

    useEffect(() => {
        // Show notification telling user about popup feature
        if(indirectTrains.length !== 0 && !notificationShowed){
            setShowNotification(true);
            const notificationTimeout = setTimeout(() => {
                setShowNotification(false);
            }, 6000); //Timeout 3 seconds
            setNotificationShowed(true);
            return () => clearTimeout(notificationTimeout);
        }
    }, [indirectTrains]);

    //Making bg unclickable and unscrollable when the popup is active
    useEffect(() => {
        if (popupCardData) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [popupCardData]);


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
                        // Do nothing
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
                alert(`${error}.\nServer is unreachable!`);
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
        } else{
            return `${timeInMinutes}min`
        }
    };

    return (
        <>
            <div className="relative h-screen w-full bg-black flex flex-col">
                <div ref={headerRef} className="fixed top-0 h-fit w-full bg-[#16161a] px-2 py-2 flex flex-col gap-7 rounded-b-2xl z-20">
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
                <div className="fixed w-[90vw] blue mx-[5vw] px-3 h-fit text-white text-center rounded-lg z-20" style={{ marginTop: `${headerHeight + 10}px`, backgroundColor: `${backendStatusType}` }}>
                    <p>{backendStatus}</p>
                    <p>Indirect trains yet found: {indirectTrains.length}</p>
                </div>

                <div className="relative flex-1 bg-black h-full w-full overflow-y-auto flex flex-col items-center gap-3 px-4 bottom-5" style={{ marginTop: `${headerHeight +80}px` }}>
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
                                        {seats.split(' ')[0] === "AVL" ?
                                            <p className="text-green-500 text-[11px]">{seats}</p>
                                            : seats.split(' ')[0] === "RAC" ?
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
                        <div key={`${train.train1_number}-${train.train2_number}`} onClick={() => setPopupCardData(train)} className="bg-[#1c1c1e] h-fit rounded-xl w-full mx-auto px-5 py-3 rounded-box">
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

                    : <div className="flex items-center justify-center w-full py-8">
                        <span className="loader"></span>
                    </div>}
                </div>

                {/*Popup card*/}

                {popupCardData &&
                (<div  className="fixed z-30 h-auto w-[45vh] bg-neutral-900 top-5/9 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-[2rem] shadow-2xl py-3 px-4 flex flex-col gap-5">
                    <span className="text-center text-[16px]">-: Route details :-</span>
                    <span onClick={() => setPopupCardData(null)} className="absolute right-4 underline text-gray-500">Close</span>

                    {/* Train-1 details */}

                    <div className="bg-[#1c1c1e] h-fit rounded-xl w-full mx-auto px-5 py-3 rounded-box">
                            <div className="flex flex-row w-full justify-between">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-white text-2xl android-text-20">{popupCardData.train1_departure_time}</h2>
                                    <p className="text-gray-500 android-text-12">{popupCardData.origin}</p>
                                    <p className="text-gray-500 android-text-12 font-bold text-[14px] mb-1">
                                        {popupCardData.train1_departure_date}
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
                                            Duration: {popupCardData.train1_duration}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <h2 className="text-white text-2xl text-right android-text-20">{popupCardData.train1_arrival_time}</h2>
                                    <p className="text-gray-500 android-text-12">{popupCardData.intermediate}</p>
                                    <p className="text-gray-500 android-text-12 text-[14px] font-bold text-right">{popupCardData.train1_arrival_date}</p>
                                </div>
                            </div>
                            <div className="flex flex-row flex-nowrap gap-3 overflow-x-auto hide-scrollbar">
                                {popupCardData.train1_seat_availability &&
                                Object.entries(popupCardData.train1_seat_availability).map(([seatClass, seats]) => (
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
                    
                    
                    {/* Train-2 details */}
                    <div className="bg-[#1c1c1e] h-fit rounded-xl w-full mx-auto px-5 py-3 rounded-box">
                            <div className="flex flex-row w-full justify-between">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-white text-2xl android-text-20">{popupCardData.train2_departure_time}</h2>
                                    <p className="text-gray-500 android-text-12">{popupCardData.intermediate}</p>
                                    <p className="text-gray-500 android-text-12 font-bold text-[14px] mb-1">
                                        {popupCardData.train2_departure_date}
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
                                            Duration: {popupCardData.train2_duration}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <h2 className="text-white text-2xl text-right android-text-20">{popupCardData.train2_arrival_time}</h2>
                                    <p className="text-gray-500 android-text-12">{popupCardData.destination}</p>
                                    <p className="text-gray-500 android-text-12 text-[14px] font-bold text-right">{popupCardData.train2_arrival_date}</p>
                                </div>
                            </div>
                        <div className="flex flex-row flex-nowrap gap-3 overflow-x-auto hide-scrollbar">
                            {popupCardData.train2_seat_availability &&
                                Object.entries(popupCardData.train2_seat_availability).map(([seatClass, seats]) => (
                                    <div key={seatClass} className="bg-[#292B31] mt-2 h-fit min-w-[80px]  rounded-xl flex flex-col flex-shrink-0 px-3 py-0.5">
                                        <p className="text-[12px] font-bold">{seatClass}</p>
                                        {seats.split(' ')[0] == "AVL" ?
                                            <p className="text-green-500 text-[11px]">{seats}</p>
                                            : seats.split(' ')[0] == "RAC" ?
                                            <p className="text-blue-500 text-[11px]">{seats}</p>
                                            : <p className="text-#B91C1C-500 text-[11px]">{seats}</p>
                                        }
                                    </div>))
                            }
                        </div>
                    </div>

                    {/* Route card  */}
                    <div className="w-full flex justify-center">
                        <div class="glass-card font-bold">
                        <div class="w-full flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="#158df2" stroke-linecap="round" stroke-linejoin="round" d="M6.814 26.754s8.102 2.78 17.933-17.553h1.983V6.226h11.124v3.28h1.112s1.693-.782 3.327 8.663v10.89s-.136 4.854-2.702 5.206s-32.503 0-32.503 0s-2.595-3.022-.274-7.511" stroke-width="1"/><path fill="none" stroke="#158df2" stroke-linecap="round" stroke-linejoin="round" d="M21.362 21.03c-.744 0-1.347.672-1.347 1.5h0v3.329c0 .828.603 1.499 1.347 1.499s1.347-.671 1.347-1.499h0v-3.33c0-.827-.603-1.498-1.347-1.498m-4.16 3.581c-.64 0-1.158.578-1.159 1.29v2.41c.006.712.53 1.284 1.17 1.278c.631-.007 1.142-.575 1.148-1.278v-2.41c0-.712-.519-1.29-1.159-1.29q0 0 0 0m-3.793 2.382c-.546 0-.989.492-.989 1.1h0v1.619c-.005.607.433 1.105.98 1.11c.545.006.992-.481.998-1.09v-1.64c0-.607-.443-1.1-.99-1.1Zm-3.608 1.435c-.439 0-.794.396-.794.884h0v1.346c.004.488.364.88.803.874c.432-.005.782-.393.786-.874v-1.346c0-.488-.356-.884-.795-.884" stroke-width="1"/><ellipse cx="38.218" cy="26.072" fill="none" stroke="#158df2" stroke-linecap="round" stroke-linejoin="round" rx="2.232" ry="2.484" stroke-width="1"/><ellipse cx="28.67" cy="26.072" fill="none" stroke="#158df2" stroke-linecap="round" stroke-linejoin="round" rx="2.232" ry="2.484" stroke-width="1"/><path fill="none" stroke="#158df2" stroke-linecap="round" stroke-linejoin="round" d="M29.555 12.67c-1.664-.011-3.02 1.481-3.03 3.332s1.332 3.36 2.996 3.371h.034" stroke-width="1"/><path fill="none" stroke="#158df2" stroke-linecap="round" stroke-linejoin="round" d="M36.508 12.67c1.663-.011 3.02 1.481 3.03 3.332c.008 1.852-1.333 3.36-2.996 3.371h-6.988m.001-6.703h6.953M6.538 36.557c-.513-.064-.975.347-1.032.918a1 1 0 0 0 0 .23c0 1.265.437 1.12.437 1.12h1.12c11.948 0 17.112 2.949 17.112 2.949H42.5v-2.35h-1.917v-2.555h-5.158v2.45h-7.566v-2.763z" stroke-width="1"/></svg>
                        </div>

                        {/* <!-- From --> */}
                        <div class="point from">
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 16 16"><path fill="#05c860" fill-rule="evenodd" d="m7.539 14.841l.003.003l.002.002a.755.755 0 0 0 .912 0l.002-.002l.003-.003l.012-.009a6 6 0 0 0 .19-.153a15.6 15.6 0 0 0 2.046-2.082C11.81 11.235 13 9.255 13 7A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.6 15.6 0 0 0 2.046 2.082l.189.153zM8 8.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" clip-rule="evenodd"/></svg>
                            {(() => {
                                const originStation = allStations.find(st => st.Code === popupCardData.origin);
                                return (
                                    <div class="label">
                                        {originStation
                                            ? originStation.Name.charAt(0).toUpperCase() + originStation.Name.slice(1).toLowerCase()
                                            : popupCardData.origin}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* <!-- Via --> */}
                        <div class="point via">
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 16 16"><path fill="#1c54ff" fill-rule="evenodd" d="m7.539 14.841l.003.003l.002.002a.755.755 0 0 0 .912 0l.002-.002l.003-.003l.012-.009a6 6 0 0 0 .19-.153a15.6 15.6 0 0 0 2.046-2.082C11.81 11.235 13 9.255 13 7A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.6 15.6 0 0 0 2.046 2.082l.189.153zM8 8.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" clip-rule="evenodd"/></svg>
                            <div class="label">{(() => {
                                const intermediateStation = allStations.find(st => st.Code === popupCardData.intermediate);
                                return (
                                    <div class="label">
                                        {intermediateStation
                                            ? intermediateStation.Name.charAt(0).toUpperCase() + intermediateStation.Name.slice(1).toLowerCase()
                                            : popupCardData.intermediate}
                                    </div>
                                );
                            })()}</div>
                        </div>

                        {/* <!-- To --> */}
                        <div class="point to">
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 16 16"><path fill="#bb4300" fill-rule="evenodd" d="m7.539 14.841l.003.003l.002.002a.755.755 0 0 0 .912 0l.002-.002l.003-.003l.012-.009a6 6 0 0 0 .19-.153a15.6 15.6 0 0 0 2.046-2.082C11.81 11.235 13 9.255 13 7A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.6 15.6 0 0 0 2.046 2.082l.189.153zM8 8.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" clip-rule="evenodd"/></svg>
                            <div class="label">{(() => {
                                const destinationStation = allStations.find(st => st.Code === popupCardData.destination);
                                return (
                                    <div class="label">
                                        {destinationStation
                                            ? destinationStation.Name.charAt(0).toUpperCase() + destinationStation.Name.slice(1).toLowerCase()
                                            : popupCardData.destination}
                                    </div>
                                );
                            })()}</div>
                        </div>

                        {/* <!-- SVG Curved Line --> */}
                        <svg class="route-svg">
                            <path d="M 40 98 C 240 138 145 32 260 40"stroke="#aaa" stroke-width="2" fill="none" stroke-dasharray="6,6"/>
                        </svg>
                        </div>

                    </div>
                </div>
                )}

                    {showNotification && (
                    <div className="fixed z-40 top-35 right-0 w-7/8 px-3 py-2 backdrop-blur-md bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-md flex items-start space-x-3">
                        <i className="fa fa-thumbs-up animate-bounce mt-1"></i>
                        <div>
                        <strong className="block font-semibold">Tip!</strong>
                        <span className="leading-[1.1]">You can enlarge the indirect train's card to see proper route details.</span>
                        </div>
                        <button 
                        onClick={() => setShowNotification(false)} 
                        className="ml-4 text-white hover:text-gray-200"
                        >
                        <i className="fa fa-times"></i>
                        </button>
                    </div>
                    )}

            </div>
        </>
    );
}

export default ShowTrainPage;