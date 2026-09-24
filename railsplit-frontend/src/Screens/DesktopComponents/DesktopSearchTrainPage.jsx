import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

function DesktopSearchTrainPage() {
    const navigate = useNavigate();

    const [fromJunction, setFromJunction] = useState({
        code: '--',
        name: 'Select origin'
    });
    const [toJunction, setToJunction] = useState({
        code: '--',
        name: 'Select destination'
    });

    const [fromInputText, setFromInputText] = useState("");
    const [toInputText, setToInputText] = useState("");
    const [activeInput, setActiveInput] = useState(null); // 'fromStation' | 'toStation' | null

    const [allSuggestions, setAllSuggestions] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [classDropdown, setClassDropdown] = useState(false);
    const [trainClass, setTrainClass] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [formattedDate, setFormattedDate] = useState('');

    const trainClasses = ['No preference', 'Sleeper', '3A', '2A', '1A'];

    const fromDropdownRef = useRef(null);
    const toDropdownRef = useRef(null);

    // Fetch stations list on mount
    useEffect(() => {
        fetch('/stations.json')
            .then((res) => res.json())
            .then((data) => setAllSuggestions(data))
            .catch((err) => console.error("Error loading stations.json:", err));
    }, []);

    // Filter station suggestions
    const filterSuggestions = (input) => {
        if (!input || !input.trim()) {
            setSuggestions([]);
            return;
        }
        const term = input.trim().toLowerCase();
        const filtered = allSuggestions.filter(
            (s) =>
                s.Name.toLowerCase().startsWith(term) ||
                s.Code.toLowerCase().startsWith(term) ||
                s.Name.toLowerCase().includes(term)
        );
        setSuggestions(filtered.slice(0, 7));
    };

    const handleStationSelect = (station, type) => {
        const formattedName = station.Name.charAt(0).toUpperCase() + station.Name.slice(1).toLowerCase();
        if (type === "fromStation") {
            setFromJunction({ code: station.Code, name: formattedName });
            setFromInputText(formattedName);
        } else if (type === "toStation") {
            setToJunction({ code: station.Code, name: formattedName });
            setToInputText(formattedName);
        }
        setActiveInput(null);
        setSuggestions([]);
    };

    // Swap stations
    const handleSwapStations = () => {
        setFromJunction(toJunction);
        setToJunction(fromJunction);
        setFromInputText(toInputText);
        setToInputText(fromInputText);
    };

    const handleDemoSearch = () => {
        const originDemo = { code: "MAJN", name: "Mangalore Jn" };
        const destDemo = { code: "NDLS", name: "New Delhi" };
        setFromJunction(originDemo);
        setToJunction(destDemo);
        setFromInputText("Mangalore Jn");
        setToInputText("New Delhi");
        setTrainClass("No preference");

        const demoDate = new Date();
        demoDate.setDate(demoDate.getDate() + 20);
        setDepartureDate(demoDate);

        const dd = String(demoDate.getDate()).padStart(2, '0');
        const mm = String(demoDate.getMonth() + 1).padStart(2, '0');
        const yyyy = demoDate.getFullYear();
        setFormattedDate(`${dd}${mm}${yyyy}`);

        setActiveInput(null);
        setSuggestions([]);
        setClassDropdown(false);
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                fromDropdownRef.current &&
                !fromDropdownRef.current.contains(event.target) &&
                toDropdownRef.current &&
                !toDropdownRef.current.contains(event.target)
            ) {
                setActiveInput(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = () => {
        if (fromJunction.code === '--' || toJunction.code === '--' || !trainClass || !departureDate) {
            alert("Please fill in Origin, Destination, Class, and Departure Date.");
            return;
        }
        if (fromJunction.code === toJunction.code) {
            alert("Origin and destination cannot be the same station!");
            return;
        }

        const Data = {
            origin: fromJunction,
            destination: toJunction,
            trainClass: trainClass,
            date: formattedDate
        };

        navigate('/showtrains', { state: { Data } });
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
                    <h1 className="text-2xl font-semibold">Search trains</h1>
                </div>

                {/* Main Search Console Card */}
                <div className="bg-[#14151b] border border-[#242630] rounded-3xl p-8 shadow-2xl relative">
                    {/* Origin & Destination Row */}
                    <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center relative">
                        {/* From Station (5 cols) */}
                        <div ref={fromDropdownRef} className="md:col-span-5 relative">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                From Station
                            </label>
                            <div
                                onClick={() => {
                                    setActiveInput("fromStation");
                                    filterSuggestions(fromInputText);
                                }}
                                className={`w-full p-4 rounded-2xl bg-[#1b1d25] border transition flex items-center gap-3 cursor-text ${
                                    activeInput === "fromStation" ? "border-blue-500 ring-2 ring-blue-500/20" : "border-[#2c2f3c] hover:border-gray-600"
                                }`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center font-bold text-sm text-blue-400 flex-shrink-0">
                                    {fromJunction.code !== '--' ? fromJunction.code : <i className="fa-solid fa-train text-xs"></i>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={fromInputText}
                                        placeholder="Type station name or code..."
                                        onFocus={() => {
                                            setActiveInput("fromStation");
                                            filterSuggestions(fromInputText);
                                        }}
                                        onChange={(e) => {
                                            setFromInputText(e.target.value);
                                            filterSuggestions(e.target.value);
                                        }}
                                        className="w-full bg-transparent text-white font-semibold text-base outline-none placeholder:text-gray-500 placeholder:font-normal"
                                    />
                                    <div className="text-xs text-gray-400 truncate">
                                        {fromJunction.name !== 'Select origin' ? fromJunction.name : "Origin City / Junction"}
                                    </div>
                                </div>
                            </div>

                            {/* From Autocomplete Dropdown */}
                            {activeInput === "fromStation" && (
                                <div className="absolute left-0 right-0 top-full mt-2 bg-[#181a22] border border-[#2d303e] rounded-2xl shadow-2xl z-30 overflow-hidden max-h-64 overflow-y-auto">
                                    {suggestions.length > 0 ? (
                                        suggestions.map((station) => (
                                            <div
                                                key={station.Code}
                                                onMouseDown={() => handleStationSelect(station, "fromStation")}
                                                className="px-4 py-3 hover:bg-[#252834] cursor-pointer transition flex items-center justify-between border-b border-[#22242e] last:border-b-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono font-bold text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                                                        {station.Code}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-200">
                                                        {station.Name.charAt(0).toUpperCase() + station.Name.slice(1).toLowerCase()}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">Select</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-4 text-xs text-gray-500 text-center">
                                            {fromInputText ? "No matching station found." : "Type a station name or IRCTC code (e.g. NDLS, BCT, CNB)..."}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Swap Button (1 col) */}
                        <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                            <button
                                type="button"
                                onClick={handleSwapStations}
                                title="Swap Origin and Destination"
                                className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
                            >
                                <i className="fa-solid fa-right-left text-sm"></i>
                            </button>
                        </div>

                        {/* To Station (5 cols) */}
                        <div ref={toDropdownRef} className="md:col-span-5 relative">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                To Destination
                            </label>
                            <div
                                onClick={() => {
                                    setActiveInput("toStation");
                                    filterSuggestions(toInputText);
                                }}
                                className={`w-full p-4 rounded-2xl bg-[#1b1d25] border transition flex items-center gap-3 cursor-text ${
                                    activeInput === "toStation" ? "border-blue-500 ring-2 ring-blue-500/20" : "border-[#2c2f3c] hover:border-gray-600"
                                }`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center font-bold text-sm text-emerald-400 flex-shrink-0">
                                    {toJunction.code !== '--' ? toJunction.code : <i className="fa-solid fa-location-dot text-xs"></i>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={toInputText}
                                        placeholder="Type station name or code..."
                                        onFocus={() => {
                                            setActiveInput("toStation");
                                            filterSuggestions(toInputText);
                                        }}
                                        onChange={(e) => {
                                            setToInputText(e.target.value);
                                            filterSuggestions(e.target.value);
                                        }}
                                        className="w-full bg-transparent text-white font-semibold text-base outline-none placeholder:text-gray-500 placeholder:font-normal"
                                    />
                                    <div className="text-xs text-gray-400 truncate">
                                        {toJunction.name !== 'Select destination' ? toJunction.name : "Destination City / Junction"}
                                    </div>
                                </div>
                            </div>

                            {/* To Autocomplete Dropdown */}
                            {activeInput === "toStation" && (
                                <div className="absolute left-0 right-0 top-full mt-2 bg-[#181a22] border border-[#2d303e] rounded-2xl shadow-2xl z-30 overflow-hidden max-h-64 overflow-y-auto">
                                    {suggestions.length > 0 ? (
                                        suggestions.map((station) => (
                                            <div
                                                key={station.Code}
                                                onMouseDown={() => handleStationSelect(station, "toStation")}
                                                className="px-4 py-3 hover:bg-[#252834] cursor-pointer transition flex items-center justify-between border-b border-[#22242e] last:border-b-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono font-bold text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                                                        {station.Code}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-200">
                                                        {station.Name.charAt(0).toUpperCase() + station.Name.slice(1).toLowerCase()}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">Select</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-4 text-xs text-gray-500 text-center">
                                            {toInputText ? "No matching station found." : "Type a station name or IRCTC code (e.g. BSB, HWH, PUNE)..."}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Class Preference & Date Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#22242d]">
                        {/* Class Dropdown */}
                        <div className="relative">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Class Preference
                            </label>
                            <div
                                onClick={() => setClassDropdown(!classDropdown)}
                                className="w-full h-14 px-4 rounded-2xl bg-[#1b1d25] border border-[#2c2f3c] hover:border-gray-600 transition flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-couch text-gray-400 text-sm"></i>
                                    <span className={`text-base ${trainClass ? "font-semibold text-white" : "text-gray-400"}`}>
                                        {trainClass || "Select coach class"}
                                    </span>
                                </div>
                                <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${classDropdown ? "rotate-180" : ""}`}></i>
                            </div>

                            {classDropdown && (
                                <div className="absolute left-0 right-0 top-full mt-2 bg-[#181a22] border border-[#2d303e] rounded-2xl shadow-2xl z-20 overflow-hidden py-1">
                                    {trainClasses.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setTrainClass(item);
                                                setClassDropdown(false);
                                            }}
                                            className={`px-4 py-3 text-sm cursor-pointer transition flex items-center justify-between ${
                                                trainClass === item ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-[#252834]"
                                            }`}
                                        >
                                            <span>{item}</span>
                                            {trainClass === item && <i className="fa-solid fa-check text-xs"></i>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Departure Date */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Departure Date
                            </label>
                            <div className="w-full h-14 px-4 rounded-2xl bg-[#1b1d25] border border-[#2c2f3c] hover:border-gray-600 transition flex items-center gap-3">
                                <i className="fa-solid fa-calendar-days text-gray-400 text-sm"></i>
                                <DatePicker
                                    selected={departureDate}
                                    placeholderText="Select journey date"
                                    onChange={(date) => {
                                        setDepartureDate(date);
                                        if (date) {
                                            const dd = String(date.getDate()).padStart(2, '0');
                                            const mm = String(date.getMonth() + 1).padStart(2, '0');
                                            const yyyy = date.getFullYear();
                                            setFormattedDate(`${dd}${mm}${yyyy}`);
                                        } else {
                                            setFormattedDate('');
                                        }
                                    }}
                                    className="w-full bg-transparent text-white font-semibold text-base outline-none cursor-pointer placeholder:text-gray-400 placeholder:font-normal"
                                    minDate={new Date()}
                                    dateFormat="MMMM dd, yyyy"
                                    popperPlacement="bottom-start"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Search Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="flex-1 w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-lg transition duration-150 flex items-center justify-center gap-3 cursor-pointer"
                        >
                            <i className="fa-solid fa-magnifying-glass text-base"></i>
                            <span>Search trains</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleDemoSearch}
                            className="w-full sm:w-auto px-6 h-14 bg-[#1b1d25] hover:bg-[#242732] border border-blue-500/30 text-blue-400 font-semibold text-base rounded-2xl transition duration-150 flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap shadow-md"
                            title="Fill demo route: MAJN → NDLS (20 days ahead, No preference)"
                        >
                            <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
                            <span>Demo Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesktopSearchTrainPage;
