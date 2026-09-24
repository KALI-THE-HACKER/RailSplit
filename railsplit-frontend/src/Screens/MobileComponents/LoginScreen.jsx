import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "/image-2.png";

function LoginScreen() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('username');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
            <div className="h-screen w-full relative bg-black">
                <img className="object-cover fixed w-screen top-[-10%] z-0" src={image} />

                <div className="fixed top-80 w-full h-[100vh] bg-[linear-gradient(to_top,_black_75%,_transparent_100%)] z-10">
                    <div className="h-72 w-full fixed bottom-5 text-center">
                        <h1 className="text-white text-4xl font-semibold">Your Emergency<br /> <span className="text-green-200">Ticket Booking System</span></h1>
                        <button onClick={() => {
                            navigate('/login');
                        }} className="border-0 bg-blue-500 text-white text-xl font-semibold mt-8 mb-3 h-13 w-80 rounded-xl cursor-pointer">Log in to your account</button>
                        <button onClick={() => {
                            navigate('/login?demo=true');
                        }} className="border border-blue-400/40 bg-black/60 text-blue-400 text-lg font-semibold mb-4 h-11 w-80 rounded-xl flex items-center justify-center gap-2 mx-auto cursor-pointer">
                            <i className="fa-solid fa-user-check text-sm"></i>
                            <span>Guest Login</span>
                        </button>
                        <p className="text-gray-300">Don't have an account yet? <a href="/signup" className="text-white font-semibold underline text-md">Sign up</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginScreen;