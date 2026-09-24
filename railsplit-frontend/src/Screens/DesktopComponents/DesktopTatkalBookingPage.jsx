import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

function DesktopTatkalBookingPage() {
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
    const [activeInput, setActiveInput] = useState(null);

    const [allSuggestions, setAllSuggestions] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [classDropdown, setClassDropdown] = useState(false);
    const [trainClass, setTrainClass] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const trainClasses = ['No preference', 'Sleeper', '3A', '2A', '1A'];

    const fromDropdownRef = useRef(null);
    const toDropdownRef = useRef(null);

    const userName = localStorage.getItem('username') || "Traveller";
    const userPhone = localStorage.getItem('phone') || "Not provided";
    const userEmail = localStorage.getItem('email') || "";

    useEffect(() => {
        fetch('/stations.json')
            .then((res) => res.json())
            .then((data) => setAllSuggestions(data))
            .catch((err) => console.error("Error loading stations.json:", err));
    }, []);

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

    const handleSwapStations = () => {
        setFromJunction(toJunction);
        setToJunction(fromJunction);
        setFromInputText(toInputText);
        setToInputText(fromInputText);
    };

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

    const submitTatkalRequest = async (e) => {
        if (e) e.preventDefault();
        if (fromJunction.code === '--' || toJunction.code === '--' || !trainClass || !departureDate) {
            alert("Please fill in Origin, Destination, Class, and Travel Date.");
            return;
        }
        if (fromJunction.code === toJunction.code) {
            alert("Origin and destination cannot be the same!");
            return;
        }

        setLoading(true);
        try {
            const form = document.createElement('form');
            form.action = 'https://formsubmit.co/luckyverma05657@gmail.com';
            form.method = 'POST';
            form.target = 'hidden_tatkal_iframe';

            const formattedDateString = departureDate instanceof Date ? departureDate.toLocaleDateString('en-GB') : departureDate;

            const data = {
                Title: 'Tatkal booking request (Desktop)',
                Name: userName,
                Phone: userPhone,
                Email: userEmail,
                Origin: `${fromJunction.name} (${fromJunction.code})`,
                Destination: `${toJunction.name} (${toJunction.code})`,
                Class: trainClass,
                Date: formattedDateString,
                _captcha: 'false'
            };

            for (const key in data) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);

            setSubmitted(true);
        } catch (error) {
            alert(`Error submitting Tatkal request: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-black text-white py-10 px-8">
            <iframe name="hidden_tatkal_iframe" style={{ display: "none" }} title="tatkal_submission"></iframe>

            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                {/* Header Row */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/tatkal')}
                        className="text-[#767676] hover:text-white transition cursor-pointer text-xl"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <h1 className="text-2xl font-semibold">Book train</h1>
                </div>

                {submitted ? (
                    <div className="bg-[#1D1F24] rounded-3xl p-10 shadow-2xl text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mb-6">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Request Received!
                        </h2>
                        <p className="text-gray-300 max-w-md mt-2 text-sm leading-relaxed">
                            Thank you, <strong>{userName}</strong>. Your Tatkal booking request for <strong>{fromJunction.name} to {toJunction.name}</strong> on <strong>{departureDate?.toLocaleDateString()}</strong> has been submitted.
                        </p>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setFromJunction({ code: '--', name: 'Select origin' });
                                    setToJunction({ code: '--', name: 'Select destination' });
                                }}
                                className="px-6 py-2.5 rounded-xl bg-[#28292E] hover:bg-[#343740] text-white text-sm font-semibold transition cursor-pointer"
                            >
                                Submit Another Request
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition cursor-pointer"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Booking Form Card */}
                        <div className="bg-[#1D1F24] rounded-3xl p-8 shadow-2xl">

                            {/* Origin / Destination Row */}
                            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                                {/* From Station */}
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
                                            activeInput === "fromStation" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-[#2c2f3c] hover:border-gray-600"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-sm text-amber-400 flex-shrink-0">
                                            {fromJunction.code !== '--' ? fromJunction.code : <i className="fa-solid fa-train text-xs"></i>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="text"
                                                value={fromInputText}
                                                placeholder="Type origin station..."
                                                onFocus={() => {
                                                    setActiveInput("fromStation");
                                                    filterSuggestions(fromInputText);
                                                }}
                                                onChange={(e) => {
                                                    setFromInputText(e.target.value);
                                                    filterSuggestions(e.target.value);
                                                }}
                                                className="w-full bg-transparent text-white font-semibold text-base outline-none placeholder:text-gray-500"
                                            />
                                            <div className="text-xs text-gray-400 truncate">
                                                {fromJunction.name}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dropdown */}
                                    {activeInput === "fromStation" && (
                                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#181a22] border border-[#2d303e] rounded-2xl shadow-2xl z-30 overflow-hidden max-h-60 overflow-y-auto">
                                            {suggestions.map((station) => (
                                                <div
                                                    key={station.Code}
                                                    onMouseDown={() => handleStationSelect(station, "fromStation")}
                                                    className="px-4 py-3 hover:bg-[#252834] cursor-pointer transition flex items-center justify-between border-b border-[#22242e]"
                                                >
                                                    <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                                                        {station.Code}
                                                    </span>
                                                    <span className="text-sm text-gray-200">
                                                        {station.Name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Swap */}
                                <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                                    <button
                                        type="button"
                                        onClick={handleSwapStations}
                                        className="w-10 h-10 rounded-full bg-[#20222c] hover:bg-[#2a2d3a] border border-[#313544] text-white flex items-center justify-center transition cursor-pointer"
                                    >
                                        <i className="fa-solid fa-right-left text-xs"></i>
                                    </button>
                                </div>

                                {/* To Station */}
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
                                            activeInput === "toStation" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-[#2c2f3c] hover:border-gray-600"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-sm text-amber-400 flex-shrink-0">
                                            {toJunction.code !== '--' ? toJunction.code : <i className="fa-solid fa-location-dot text-xs"></i>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input
                                                type="text"
                                                value={toInputText}
                                                placeholder="Type destination station..."
                                                onFocus={() => {
                                                    setActiveInput("toStation");
                                                    filterSuggestions(toInputText);
                                                }}
                                                onChange={(e) => {
                                                    setToInputText(e.target.value);
                                                    filterSuggestions(e.target.value);
                                                }}
                                                className="w-full bg-transparent text-white font-semibold text-base outline-none placeholder:text-gray-500"
                                            />
                                            <div className="text-xs text-gray-400 truncate">
                                                {toJunction.name}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dropdown */}
                                    {activeInput === "toStation" && (
                                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#181a22] border border-[#2d303e] rounded-2xl shadow-2xl z-30 overflow-hidden max-h-60 overflow-y-auto">
                                            {suggestions.map((station) => (
                                                <div
                                                    key={station.Code}
                                                    onMouseDown={() => handleStationSelect(station, "toStation")}
                                                    className="px-4 py-3 hover:bg-[#252834] cursor-pointer transition flex items-center justify-between border-b border-[#22242e]"
                                                >
                                                    <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                                                        {station.Code}
                                                    </span>
                                                    <span className="text-sm text-gray-200">
                                                        {station.Name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Class & Date Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#22242d]">
                                {/* Class Preference */}
                                <div className="relative">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        Travel Class
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
                                                        trainClass === item ? "bg-amber-600 text-white font-semibold" : "text-gray-300 hover:bg-[#252834]"
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
                                        Tatkal Travel Date
                                    </label>
                                    <div className="w-full h-14 px-4 rounded-2xl bg-[#1b1d25] border border-[#2c2f3c] hover:border-gray-600 transition flex items-center gap-3">
                                        <i className="fa-solid fa-calendar-days text-gray-400 text-sm"></i>
                                        <DatePicker
                                            selected={departureDate}
                                            placeholderText="Select journey date"
                                            onChange={(date) => setDepartureDate(date)}
                                            className="w-full bg-transparent text-white font-semibold text-base outline-none cursor-pointer placeholder:text-gray-400"
                                            minDate={new Date()}
                                            dateFormat="MMMM dd, yyyy"
                                            popperPlacement="bottom-start"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={submitTatkalRequest}
                                    disabled={loading}
                                    className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded-2xl shadow-lg transition duration-150 flex items-center justify-center cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Book train"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default DesktopTatkalBookingPage;
