import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DesktopShowTrainPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const receivedData = location.state;

    const [backendStatus, setBackendStatus] = useState("");
    const [backendStatusType, setBackendStatusType] = useState("#2563EB");
    const [directTrains, setDirectTrains] = useState([]);
    const [indirectTrains, setIndirectTrains] = useState([]);
    const [allStations, setAllStations] = useState([]);
    const [popupCardData, setPopupCardData] = useState(null);

    // Extract data from route state
    const { origin, destination, trainClass, date } = receivedData?.Data || {};

    // Redirect if no search data provided
    useEffect(() => {
        if (!receivedData || !origin || !destination) {
            navigate('/searchtrains');
        }
    }, [receivedData, origin, destination, navigate]);

    // Fetch stations metadata
    useEffect(() => {
        fetch('/stations.json')
            .then((res) => res.json())
            .then((data) => setAllStations(data))
            .catch((err) => console.error("Error loading stations.json:", err));
    }, []);

    // Prevent background scroll when popup is active
    useEffect(() => {
        if (popupCardData) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [popupCardData]);

    // Fetch SSE stream from backend
    useEffect(() => {
        if (!origin || !destination || !trainClass || !date) return;

        let eventSource = null;

        const startStream = async () => {
            try {
                const backendEndpoint = import.meta.env.VITE_RAILSPLIT_BACKEND_ENDPOINT || "http://127.0.0.1:8000";

                const res = await fetch(`${backendEndpoint}/start-stream`, {
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

                const { user_id } = await res.json();

                eventSource = new EventSource(`${backendEndpoint}/railsplit-server?user_id=${user_id}`);

                function processApiResponse(data) {
                    if (Array.isArray(data)) {
                        setDirectTrains(data[0]?.["Direct-trains"] || []);

                        const indirect = data.filter(item => item && item.hasOwnProperty('intermediate'));
                        indirect.sort((a, b) => ((a.duration || 0) + (a.layover || 15)) - ((b.duration || 0) + (b.layover || 15)));
                        setIndirectTrains(indirect);
                    } else if (data["Direct-trains"]) {
                        setDirectTrains(data["Direct-trains"]);
                        setIndirectTrains([]);
                    }
                }

                eventSource.onmessage = (event) => {
                    try {
                        const trimmed = event.data.trim();
                        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                            const data = JSON.parse(trimmed);
                            if (data.status) {
                                setBackendStatus(data.status);
                                if (data.type) setBackendStatusType(data.type);
                            } else {
                                processApiResponse(data);
                            }
                        } else {
                            setBackendStatus(trimmed);
                        }
                    } catch (e) {
                        console.error("Error parsing SSE message:", e);
                    }
                };

                eventSource.onerror = () => {
                    setBackendStatus("Connection lost due to some error!");
                    setBackendStatusType("#B91C1C");
                    if (eventSource) eventSource.close();
                };

            } catch (error) {
                console.error("Server connection error:", error);
                setBackendStatus("Server is unreachable!");
                setBackendStatusType("#B91C1C");
            }
        };

        startStream();

        return () => {
            if (eventSource) eventSource.close();
        };
    }, [origin, destination, trainClass, date]);

    const timeFormatter = (timeInMinutes) => {
        if (!timeInMinutes) return "0min";
        const hrs = Math.floor(timeInMinutes / 60);
        const mins = timeInMinutes % 60;
        return hrs >= 1 ? `${hrs}hr ${mins}min` : `${mins}min`;
    };

    const getStationName = (code) => {
        if (!code) return "";
        const found = allStations.find(st => st.Code?.toUpperCase() === code?.toUpperCase());
        if (!found) return code;
        return found.Name.charAt(0).toUpperCase() + found.Name.slice(1).toLowerCase();
    };

    if (!receivedData || !origin) return null;

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-black text-white py-8 px-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                {/* Header Card */}
                <div className="bg-[#16161a] rounded-2xl p-6 flex flex-col gap-4 shadow-lg border border-[#23252d]">
                    <div className="flex items-center gap-4">
                        <i
                            onClick={() => navigate('/searchtrains')}
                            className="fa-solid fa-angle-left text-[#767676] hover:text-white text-2xl cursor-pointer"
                        ></i>
                        <h2 className="text-white text-xl font-semibold">Trains with confirm seat</h2>
                    </div>

                    <div className="flex items-center justify-between px-4 pt-2">
                        <div className="flex flex-col items-start">
                            <h1 className="text-white text-2xl font-bold">{origin?.code}</h1>
                            <p className="text-gray-400 text-sm">{origin?.name}</p>
                        </div>
                        <i className="fa-solid fa-right-left text-gray-500 text-lg"></i>
                        <div className="flex flex-col items-end">
                            <h1 className="text-white text-2xl font-bold">{destination?.code}</h1>
                            <p className="text-gray-400 text-sm">{destination?.name}</p>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                {backendStatus && (
                    <div
                        className="rounded-xl px-4 py-3 text-white text-center font-medium text-sm transition-all"
                        style={{ backgroundColor: backendStatusType }}
                    >
                        <p>{backendStatus}</p>
                        <p className="text-xs opacity-90 mt-0.5">Indirect trains yet found: {indirectTrains.length}</p>
                    </div>
                )}

                {/* Direct Trains Section */}
                <div className="flex flex-col gap-4">
                    <p className="text-gray-400 text-center font-medium text-sm">-: Direct trains :-</p>

                    {directTrains.length > 0 ? (
                        directTrains.map((train, index) => (
                            <div
                                key={index}
                                className="bg-[#1c1c1e] rounded-2xl p-5 shadow-lg border border-[#2a2c34]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col items-start">
                                        <h2 className="text-white text-2xl font-bold">{train.departure?.[0]}</h2>
                                        <p className="text-gray-400 text-sm">{origin?.code}</p>
                                        <p className="text-gray-400 text-xs font-semibold mt-1">
                                            {train.departure?.[1]} {train.departure?.[2]} {train.departure?.[3]}
                                        </p>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center justify-center max-w-xs mx-6">
                                        <div className="w-full flex items-center justify-center gap-1">
                                            {Array.from({ length: 15 }).map((_, i) => (
                                                <div key={i} className="w-2 h-0.5 bg-[#3B3F48] rounded"></div>
                                            ))}
                                        </div>
                                        <span className="mt-2 px-3 py-1 rounded-full bg-[#23242a] text-green-400 text-xs font-medium">
                                            Duration: {train.duration}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <h2 className="text-white text-2xl font-bold">{train.arrival?.[0]}</h2>
                                        <p className="text-gray-400 text-sm">{destination?.code}</p>
                                        <p className="text-gray-400 text-xs font-semibold mt-1">
                                            {train.arrival?.[1]} {train.arrival?.[2]} {train.arrival?.[3]}
                                        </p>
                                    </div>
                                </div>

                                {/* Seat Availability */}
                                {train.seat_availabilty && (
                                    <div className="flex flex-wrap gap-2.5 mt-4 pt-3 border-t border-[#292b31]">
                                        {Object.entries(train.seat_availabilty).map(([seatClass, seats]) => (
                                            <div
                                                key={seatClass}
                                                className="bg-[#292B31] rounded-xl px-3 py-1.5 flex flex-col min-w-[70px]"
                                            >
                                                <span className="text-xs font-bold text-gray-300">{seatClass}</span>
                                                <span
                                                    className={`text-xs font-semibold mt-0.5 ${
                                                        seats.startsWith("AVL")
                                                            ? "text-green-500"
                                                            : seats.startsWith("RAC")
                                                            ? "text-blue-500"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {seats}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center py-6">
                            <span className="loader"></span>
                        </div>
                    )}
                </div>

                {/* In-direct Trains Section */}
                <div className="flex flex-col gap-4 mt-2">
                    <p className="text-white text-center font-medium text-sm">-: In-direct trains :-</p>

                    {indirectTrains.length > 0 ? (
                        indirectTrains.map((train, index) => {
                            const intermediateName = getStationName(train.intermediate);
                            return (
                                <div
                                    key={`${train.train1_number}-${train.train2_number}-${train.intermediate}-${index}`}
                                    onClick={() => setPopupCardData(train)}
                                    className="bg-[#1c1c1e] hover:bg-[#232428] rounded-2xl p-5 shadow-lg border border-[#2a2c34] cursor-pointer transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-start">
                                            <h2 className="text-white text-2xl font-bold">{train.train1_departure_time}</h2>
                                            <p className="text-gray-400 text-sm">{origin?.code}</p>
                                            <p className="text-gray-400 text-xs font-semibold mt-1">
                                                {train.train1_departure_date}
                                            </p>
                                        </div>

                                        <div className="flex-1 flex flex-col items-center justify-center max-w-xs mx-6">
                                            <div className="text-blue-400 text-sm font-medium mb-1">
                                                via {intermediateName}
                                            </div>
                                            <div className="w-full flex items-center justify-center gap-1">
                                                {Array.from({ length: 15 }).map((_, i) => (
                                                    <div key={i} className="w-2 h-0.5 bg-[#3B3F48] rounded"></div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <h2 className="text-white text-2xl font-bold">{train.train2_arrival_time}</h2>
                                            <p className="text-gray-400 text-sm">{destination?.code}</p>
                                            <p className="text-gray-400 text-xs font-semibold mt-1">
                                                {train.train2_arrival_date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-around pt-4 mt-3 border-t border-[#292b31] text-xs">
                                        <span className="px-3 py-1 rounded-full bg-[#23242a] text-green-400 font-medium">
                                            Duration: {timeFormatter(train.duration)}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-[#23242a] text-yellow-300 font-medium">
                                            Layover: {timeFormatter(train.layover)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex justify-center py-6">
                            <span className="loader"></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Route Details Modal */}
            {popupCardData && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-auto flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                            <span className="text-white font-semibold text-lg">-: Route details :-</span>
                            <span
                                onClick={() => setPopupCardData(null)}
                                className="text-gray-400 hover:text-white underline cursor-pointer text-sm"
                            >
                                Close
                            </span>
                        </div>

                        {/* Train 1 Details */}
                        <div className="bg-[#1c1c1e] rounded-xl p-4 border border-[#2a2c34]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-blue-400 font-bold">Leg 1 Train #{popupCardData.train1_number}</span>
                                <span className="text-xs text-gray-400 font-medium">{popupCardData.train1_duration}</span>
                            </div>
                            <div className="text-sm font-semibold text-white mb-2">{popupCardData.train1_name}</div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-xl font-bold">{popupCardData.train1_departure_time}</div>
                                    <div className="text-xs text-gray-400">{popupCardData.origin}</div>
                                    <div className="text-[11px] text-gray-500">{popupCardData.train1_departure_date}</div>
                                </div>
                                <i className="fa-solid fa-arrow-right text-gray-600"></i>
                                <div className="text-right">
                                    <div className="text-xl font-bold">{popupCardData.train1_arrival_time}</div>
                                    <div className="text-xs text-gray-400">{popupCardData.intermediate}</div>
                                    <div className="text-[11px] text-gray-500">{popupCardData.train1_arrival_date}</div>
                                </div>
                            </div>
                            {popupCardData.train1_seat_availability && (
                                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-[#292b31]">
                                    {Object.entries(popupCardData.train1_seat_availability).map(([cls, seats]) => (
                                        <span
                                            key={cls}
                                            className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                                                seats.startsWith("AVL") ? "text-green-400 bg-green-500/10" : "text-blue-400 bg-blue-500/10"
                                            }`}
                                        >
                                            {cls}: {seats}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Train 2 Details */}
                        <div className="bg-[#1c1c1e] rounded-xl p-4 border border-[#2a2c34]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-green-400 font-bold">Leg 2 Train #{popupCardData.train2_number}</span>
                                <span className="text-xs text-gray-400 font-medium">{popupCardData.train2_duration}</span>
                            </div>
                            <div className="text-sm font-semibold text-white mb-2">{popupCardData.train2_name}</div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-xl font-bold">{popupCardData.train2_departure_time}</div>
                                    <div className="text-xs text-gray-400">{popupCardData.intermediate}</div>
                                    <div className="text-[11px] text-gray-500">{popupCardData.train2_departure_date}</div>
                                </div>
                                <i className="fa-solid fa-arrow-right text-gray-600"></i>
                                <div className="text-right">
                                    <div className="text-xl font-bold">{popupCardData.train2_arrival_time}</div>
                                    <div className="text-xs text-gray-400">{popupCardData.destination}</div>
                                    <div className="text-[11px] text-gray-500">{popupCardData.train2_arrival_date}</div>
                                </div>
                            </div>
                            {popupCardData.train2_seat_availability && (
                                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-[#292b31]">
                                    {Object.entries(popupCardData.train2_seat_availability).map(([cls, seats]) => (
                                        <span
                                            key={cls}
                                            className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                                                seats.startsWith("AVL") ? "text-green-400 bg-green-500/10" : "text-blue-400 bg-blue-500/10"
                                            }`}
                                        >
                                            {cls}: {seats}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Route card */}
                        <div className="w-full flex justify-center py-2">
                            <div className="glass-card font-bold">
                                <div className="w-full flex justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                                        <path fill="none" stroke="#158df2" strokeLinecap="round" strokeLinejoin="round" d="M6.814 26.754s8.102 2.78 17.933-17.553h1.983V6.226h11.124v3.28h1.112s1.693-.782 3.327 8.663v10.89s-.136 4.854-2.702 5.206s-32.503 0-32.503 0s-2.595-3.022-.274-7.511" strokeWidth="1"/>
                                        <ellipse cx="38.218" cy="26.072" fill="none" stroke="#158df2" rx="2.232" ry="2.484" strokeWidth="1"/>
                                        <ellipse cx="28.67" cy="26.072" fill="none" stroke="#158df2" rx="2.232" ry="2.484" strokeWidth="1"/>
                                    </svg>
                                </div>

                                <div className="point from">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><path fill="#05c860" fillRule="evenodd" d="m7.539 14.841l.003.003l.002.002a.755.755 0 0 0 .912 0l.002-.002l.003-.003l.012-.009a6 6 0 0 0 .19-.153a15.6 15.6 0 0 0 2.046-2.082C11.81 11.235 13 9.255 13 7A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.6 15.6 0 0 0 2.046 2.082l.189.153zM8 8.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" clipRule="evenodd"/></svg>
                                    <div className="label">{getStationName(popupCardData.origin)}</div>
                                </div>

                                <div className="point via">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><path fill="#1c54ff" fillRule="evenodd" d="m7.539 14.841l.003.003l.002.002a.755.755 0 0 0 .912 0l.002-.002l.003-.003l.012-.009a6 6 0 0 0 .19-.153a15.6 15.6 0 0 0 2.046-2.082C11.81 11.235 13 9.255 13 7A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.6 15.6 0 0 0 2.046 2.082l.189.153zM8 8.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" clipRule="evenodd"/></svg>
                                    <div className="label">{getStationName(popupCardData.intermediate)}</div>
                                </div>

                                <div className="point to">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><path fill="#bb4300" fillRule="evenodd" d="m7.539 14.841l.003.003l.002.002a.755.755 0 0 0 .912 0l.002-.002l.003-.003l.012-.009a6 6 0 0 0 .19-.153a15.6 15.6 0 0 0 2.046-2.082C11.81 11.235 13 9.255 13 7A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.6 15.6 0 0 0 2.046 2.082l.189.153zM8 8.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" clipRule="evenodd"/></svg>
                                    <div className="label">{getStationName(popupCardData.destination)}</div>
                                </div>

                                <svg className="route-svg">
                                    <path d="M 40 98 C 240 138 145 32 260 40" stroke="#aaa" strokeWidth="2" fill="none" strokeDasharray="6,6"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DesktopShowTrainPage;
