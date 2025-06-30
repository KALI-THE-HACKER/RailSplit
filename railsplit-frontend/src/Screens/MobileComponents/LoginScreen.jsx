import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "/image-2.png";

function LoginScreen(){
    const navigate = useNavigate();

    useEffect(() => {
        // Replace 'token' with your actual key
        const token = localStorage.getItem('username');
        if (token) {
            navigate('/'); // Redirect to homepage if logged in
        }
    }, [navigate]);

    return(
        <>
            <div className="h-screen w-full relative bg-black">
                <img className="object-cover fixed w-screen top-[-10%] z-0" src={image}/>

                <div className="fixed top-80 w-full h-[100vh] bg-[linear-gradient(to_top,_black_75%,_transparent_100%)] z-10">
                    <div className="h-60 w-full fixed bottom-7 text-center">
                        <h1 className="text-white text-4xl font-semibold">Your Emergency<br/> <span className="text-green-200">Ticket Booking System</span></h1>
                        <button onClick={() => {
                                navigate('/login');
                            }} className="border-0 bg-blue-500 text-white text-xl font-semibold mt-10 mb-5 h-13 w-80 rounded-xl">Log in to your account</button>
                        <p className="text-gray-300">Don't have an account yet? <a href="/signup" className="text-white font-semibold underline text-md">Sign up</a></p>
                    </div>
                </div>

                
            </div>
        </>
    );
}

export default LoginScreen