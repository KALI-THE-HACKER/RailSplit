import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";


function TatkalBookingPage(){


    const navigate = useNavigate();
    const refs = {
        fromStation: useRef(null),
        toStation: useRef(null),
    };
    const [cleared, setCleared] = useState({
        fromStation: false,
        toStation: false,
    });
    
    const [activeInput, setActiveInput] = useState(null); // 'fromStation' or 'toStation'

    const [fromJunction, setFromJunction] = useState({
        code: '--',
        name: 'Select origin'
    });
    const [toJunction, setToJunction] = useState({
        code: '--',
        name: 'Select destination'
    });
    const [allSuggestions, setAllSuggestions] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [classDropdown, setClassDropdown] = useState(false);
    const [trainClass, setTrainClass] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const trainClasses = ['No preference', 'Sleeper', '3A', '2A', '1A']
    const [loading, setLoading] = useState(false);

    const handleFocus = (key) => {
        setActiveInput(key);
        if (!cleared[key]) {
        refs[key].current.innerText = "";
        setCleared((prev) => ({ ...prev, [key]: true }));
        }
    };

    const handleInput = (e) => {
        const inputText = e.target.innerText || ""
        if (activeInput === "fromStation") {
            setFromJunction((prev) => ({
            ...prev,
            name: inputText,
            }));
        } else if (activeInput === "toStation") {
            setToJunction((prev) => ({
            ...prev,
            name: inputText,
            }));
        }
        
        filterSuggestions(inputText);
    };

    useEffect(() => {
        if (refs.fromStation.current && !cleared.fromStation) {
          refs.fromStation.current.innerText = fromJunction.name;
        }
    }, [fromJunction.name, cleared.fromStation]);

    useEffect(() => {
        if (refs.toStation.current && !cleared.toStation) {
          refs.toStation.current.innerText = toJunction.name;
        }
    }, [toJunction.name, cleared.toStation]);

    useEffect(() => {
        try{
        fetch('/stations.json')
            .then((res) => res.json())
            .then((data) => setAllSuggestions(data));
        }catch(err){
            alert(err);
        }
    }, []);


    const filterSuggestions = (input) => {
        if(!input){
            setSuggestions([]);
            return;
        }
        
        const filtered = allSuggestions.filter(
            (suggestion) => suggestion.Name.toLowerCase().startsWith(input.toLowerCase()) || suggestion.Code.toLowerCase().startsWith(input.toLowerCase())
        );
        const limitedSuggestions = filtered.slice(0, 4);
        setSuggestions(limitedSuggestions);
    };

    const handleSuggestionClick = (station) => {
        const formattedName = station.Name.charAt(0).toUpperCase() + station.Name.slice(1).toLowerCase();

        if(activeInput === "fromStation"){
            setFromJunction({
                code: station.Code,
                name: formattedName,
            })
            if (refs.fromStation.current) {
                refs.fromStation.current.innerText = formattedName;
            }
        } else if(activeInput === "toStation"){
            setToJunction({
                code: station.Code,
                name: formattedName,
            })
            if (refs.toStation.current) {
                refs.toStation.current.innerText = formattedName;
            }
        }

        setSuggestions([]);
        setActiveInput(null);
    };

    async function submitButton(){
        if(fromJunction.code === '--' || toJunction.code === '--' || !trainClass || !departureDate){
            alert("Please fill up all the spaces");
            return;
        }
        if(fromJunction.code === toJunction.code){
            alert("Origin and destination can't be same!");
            return;
        }
        setLoading(true);

        try {
            const form = document.createElement('form');
            form.action = 'https://formsubmit.co/luckyverma05657@gmail.com';
            form.method = 'POST';

            const data = {
                Title: 'Tatkal booking request',
                Name: localStorage.getItem('username'),
                Phone: localStorage.getItem('phone'),
                Email: localStorage.getItem('email'),
                Origin: fromJunction.name,
                Destination: toJunction.name,
                Class: trainClass,
                Date: departureDate instanceof Date ? departureDate.toLocaleDateString() : departureDate
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

            alert("Your request has been sent!\nThank you for using our service :)");
        } catch (error) {
            alert(`Unfortunately we encountered an error: ${error}`);
        } finally {
            setLoading(false);
        }
    }


    return(
        <>
        <div onClick={() => {
            if(suggestions){
                setSuggestions([]);
            }
            if(classDropdown){
                setClassDropdown(false);
            }
        }
        } className="h-screen w-full bg-black relative flex flex-col items-center py-5 ">
            <div className="flex flex-row items-center w-full">
                <i onClick={() => navigate('/')} className="fa-solid fa-angle-left text-[#767676] text-2xl" />
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#1D1F24] h-12 w-[90vw] flex justify-center items-center rounded-4xl"><h2 className="text-white text-2xl font-semibold">Book train</h2></div>    
            </div>
            <div className="h-150 w-[90vw] bg-[#1D1F24] my-10 rounded-[2rem] py-5 px-10 text-center">

                {/* Origin Junction section */}
                <p className="text-neutral-500 text-lg text-left">From</p>

                <div
                    className="h-auto w-[70vw] bg-[#28292E] rounded-[1.3rem] my-2 mx-auto focus:outline-none text-2xl flex justify-start px-5 py-3 items-center" spellCheck={false}
                    >
                    <div className="flex flex-row gap-4 items-baseline-last">
                    <span className="text-white font-bold" contentEditable="false">{fromJunction.code}</span>
                    <span contentEditable="true" ref={refs.fromStation}
                    onFocus={() => handleFocus("fromStation")} 
                    onInput={handleInput}
                    suppressContentEditableWarning={true}  className="text-gray-500 text-[16px] focus:outline-none"></span></div>

                </div>
                {activeInput === "fromStation" && (
                <div className="absolute w-[70vw] z-20 bg-[#1D1F24]">
                {suggestions.map((station) => (
                        <div
                            key={station.code}
                            onMouseDown={() => handleSuggestionClick(station)}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = "#3A3B42")
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = "#28292E")
                            }
                            className="bg-[#28292E] rounded-xl h-10 my-1 text-left px-5 flex items-center text-neutral-400"
                            >
                            <strong className="mr-5 text-neutral-300">{station.Code}</strong>  {station.Name.charAt(0).toUpperCase() + station.Name.slice(1).toLowerCase()}
                        </div>
                    ))
                    } </div>
                )}

                <div className="my-5 h-10">
                    <div className="absolute h-13 w-13 rounded-full bg-black left-0" /> 
                    <div className="absolute h-13 w-13 rounded-full bg-black right-0" />
                    <div  className="absolute my-6 w-[65vw] border-t-3 left-1/2 -translate-x-1/2 border-dashed border-[#3B3F48] "></div>
                    <div className="absolute h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center left-1/2 -translate-x-1/2"><i className="fa-solid fa-right-left rotate-90 text-white text-xl"></i></div>
                </div>

                {/* To destination section */}
                <p className="text-neutral-500 text-lg text-left">To</p>

                <div
                    className="h-auto w-[70vw] bg-[#28292E] rounded-[1.3rem] my-2 mx-auto focus:outline-none text-2xl flex justify-start px-5 py-3 items-center" spellCheck={false}
                    >
                    <div className="flex flex-row gap-4 items-baseline-last">
                    <span className="text-white font-bold" contentEditable="false">{toJunction.code}</span>
                    <span contentEditable="true" ref={refs.toStation}
                    onFocus={() => handleFocus("toStation")} 
                    onInput={handleInput}
                    suppressContentEditableWarning={true}  className="text-gray-500 text-[16px] focus:outline-none"></span></div>
                </div>

                {activeInput === "toStation" && (
                <div className="absolute w-[70vw] z-20 bg-[#1D1F24]">
                {suggestions.map((station) => (
                        <div
                            key={station.code}
                            onMouseDown={() => handleSuggestionClick(station)}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = "#3A3B42")
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = "#28292E")
                            }
                            className="bg-[#28292E] rounded-xl h-10 my-1 text-left px-5 flex items-center text-neutral-400"
                            >
                            <strong className="mr-5 text-neutral-300">{station.Code}</strong>  {station.Name.charAt(0).toUpperCase() + station.Name.slice(1).toLowerCase()}
                        </div>
                    ))
                    } </div>
                )}

                {/* Class section  */}
                <p className="text-neutral-500 text-lg text-left mt-5 mb-2">Class preference</p>

                <div className="mx-auto relative w-[70vw] z-10">
                    <div
                        onClick={() => setClassDropdown(!classDropdown)}
                        className="h-10 bg-[#28292E] rounded-[0.8rem] my-2 text-xl flex justify-start px-5 py-3 items-center text-white"
                    >
                        {trainClass || <span className="text-neutral-400">Select class</span>}
                    </div>

                    {classDropdown && (
                        <div className="absolute w-full mt-1 z-20 bg-[#1D1F24] rounded-[0.8rem]">
                        {trainClasses.map((item, index) => (
                            <div
                            key={index}
                            onClick={() => {
                                setTrainClass(item);
                                setClassDropdown(false);
                            }}
                            className="bg-[#28292E] rounded-xl h-10 my-1 px-5 flex items-center text-neutral-400 hover:bg-[#3A3B42] cursor-pointer"
                            >
                            {item}
                            </div>
                        ))}
                        </div>
                    )}
                </div>

                {/* Date section  */}
                <p className="text-neutral-500 text-lg text-left mt-5">Departure date</p>

                <div className=" mx-auto relative w-[70vw]">
                    <div
                        className=""
                    >
                    <DatePicker
                        selected={departureDate}
                        placeholderText="Select date"
                        
                        onChange={(date) => setDepartureDate(date)}
                        className="h-10 w-[70vw] bg-[#28292E] rounded-[0.8rem] my-2 text-xl flex justify-start px-5 py-3 items-center cursor-pointer text-white z-0"
                        minDate={new Date()}
                        id="hiddenDatePicker"
                        popperPlacement="bottom"
                        
                        popperModifiers={[
                        {
                            name: "offset",
                            options: {
                            offset: [0, 10],
                            },
                        },
                        ]}
                        dateFormat="MMMM dd, yyyy"
                        withPortal 
                    />
                    </div>

                </div>
                <button onClick={submitButton} className="border-0 bg-blue-500 text-white text-xl font-semibold mt-10 mb-5 h-13 w-[70vw] rounded-xl">Submit</button>
            </div>

            
                {loading  && 
                    <div className="fixed top-0 left-0 h-screen w-screen z-50 bg-black/40 flex flex-col gap-7 items-center justify-center backdrop-blur-xs">
                        <span className="loader"></span>
                        <span>Loading...</span>
                    </div>
                }
        </div>
        </>
    );
}

export default TatkalBookingPage;