import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ContactUsPage() {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const formRef = useRef(null);

    // Show overlay on successful submit
    const handleFormSubmit = (e) => {
        setTimeout(() => setShowSuccess(true), 300); // slight delay for UX
    };

    return (
        <div className="relative min-h-screen h-screen bg-gradient-to-br from-black via-[#1D1F24] to-[#23252b] flex flex-col items-center justify-center px-5 py-10 overflow-hidden">
            {/* Header */}
            <div className="fixed flex flex-row items-center w-full top-5 left-0 z-20">
                <i onClick={() => navigate('/')} className="fa-solid fa-angle-left text-[#767676] text-2xl ml-1 mt-2" />
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#1D1F24] h-12 w-[90vw] flex justify-center items-center rounded-4xl mt-2 shadow-lg">
                    <h2 className="text-white text-2xl font-semibold">Contact us</h2>
                </div>    
            </div>

            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute bg-blue-500 opacity-30 rounded-full w-72 h-72 top-[-80px] left-[-80px] animate-blob1"></div>
                <div className="absolute bg-green-400 opacity-20 rounded-full w-80 h-80 bottom-[-100px] right-[-100px] animate-blob2"></div>
                <div className="absolute bg-purple-600 opacity-20 rounded-full w-60 h-60 top-1/2 left-1/2 animate-blob3"></div>
            </div>

            {/* Contact Card */}
            <div className="relative z-10 bg-[#1D1F24]/80 rounded-3xl shadow-2xl p-8 w-[90vw] max-w-md flex flex-col items-center backdrop-blur-xl border border-[#333] animate-fadein" style={{ marginTop: "80px" }}>
                <h1 className="text-3xl font-bold text-white mb-4">Get in Touch</h1>
                <p className="text-gray-300 text-center mb-6">
                    Have questions, feedback, or need help? <br />
                    We're here for you!
                </p>
                <div className="w-full flex flex-col gap-4">
                    <div onClick={() => window.location.href = 'mailto:support@luckylinux.xyz'} className="flex items-center gap-3 bg-[#23252b] rounded-xl px-4 py-3 cursor-pointer hover:bg-[#23252b]/80 transition">
                        <i className="fa-solid fa-envelope text-blue-400 text-xl"></i>
                        <span className="text-white text-lg break-all">support@luckylinux.xyz</span>
                    </div>
                </div>
                <div className="mt-8 w-full">
                    <h2 className="text-white text-lg font-semibold mb-2">Or send us a message:</h2>
                    <form
                        ref={formRef}
                        action="https://formsubmit.co/luckyverma05657@gmail.com"
                        method="POST"
                        className="flex flex-col gap-3"
                        target="hidden_iframe"
                        onSubmit={handleFormSubmit}
                    >
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Your Name"
                            className="px-4 py-3 rounded-xl bg-[#28292E] text-white outline-none border border-gray-600 focus:border-blue-500"
                        />
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Your Email"
                            className="px-4 py-3 rounded-xl bg-[#28292E] text-white outline-none border border-gray-600 focus:border-blue-500"
                        />
                        <textarea
                            name="message"
                            required
                            placeholder="Your Message"
                            rows={3}
                            className="px-4 py-3 rounded-xl bg-[#28292E] text-white outline-none border border-gray-600 focus:border-blue-500 resize-none"
                        />
                        <input type="hidden" name="_captcha" value="false" />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-lg transition mt-2"
                        >
                            Send Message
                        </button>
                    </form>
                    {/* Hidden iframe to prevent redirect */}
                    <iframe name="hidden_iframe" style={{ display: "none" }} title="hidden_iframe"></iframe>
                </div>
            </div>

            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed top-0 left-0 h-screen w-screen z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="flex flex-col items-center">
                        {/* Animated Green Tick */}
                        <svg
                            className="mb-6"
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="8"
                                opacity="0.2"
                            />
                            <polyline
                                points="30,55 45,70 70,40"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    strokeDasharray: 60,
                                    strokeDashoffset: 60,
                                    animation: "tick-anim 0.7s ease forwards"
                                }}
                            />
                        </svg>
                        <h2 className="text-3xl font-bold text-green-400 mb-2">Thank You!</h2>
                        <p className="text-white text-lg text-center mb-6">
                            Your message has been sent.<br />
                            We appreciate you contacting us!
                        </p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-8 rounded-xl text-lg transition"
                        >
                            Close
                        </button>
                    </div>
                    <style>{`
                        @keyframes tick-anim {
                            to { stroke-dashoffset: 0; }
                        }
                        @keyframes blob1 {
                            0%,100% { transform: scale(1) translateY(0px);}
                            50% { transform: scale(1.1) translateY(30px);}
                        }
                        @keyframes blob2 {
                            0%,100% { transform: scale(1) translateY(0px);}
                            50% { transform: scale(1.15) translateY(-20px);}
                        }
                        @keyframes blob3 {
                            0%,100% { transform: scale(1) translate(-50%, -50%);}
                            50% { transform: scale(1.08) translate(-55%, -45%);}
                        }
                        .animate-blob1 { animation: blob1 8s ease-in-out infinite; will-change: transform; }
                        .animate-blob2 { animation: blob2 10s ease-in-out infinite; will-change: transform; }
                        .animate-blob3 { animation: blob3 12s ease-in-out infinite; will-change: transform; }
                        .animate-fadein { animation: fadein 1s ease; }
                        @keyframes fadein { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none;} }
                    `}</style>
                </div>
            )}

            {/* Add global blob animations if not already present */}
            <style>{`
                @keyframes blob1 {
                    0%,100% { transform: scale(1) translateY(0px);}
                    50% { transform: scale(1.1) translateY(30px);}
                }
                @keyframes blob2 {
                    0%,100% { transform: scale(1) translateY(0px);}
                    50% { transform: scale(1.15) translateY(-20px);}
                }
                @keyframes blob3 {
                    0%,100% { transform: scale(1) translate(-50%, -50%);}
                    50% { transform: scale(1.08) translate(-55%, -45%);}
                }
                .animate-blob1 { animation: blob1 8s ease-in-out infinite; will-change: transform; }
                .animate-blob2 { animation: blob2 10s ease-in-out infinite; will-change: transform; }
                .animate-blob3 { animation: blob3 12s ease-in-out infinite; will-change: transform; }
            `}</style>
        </div>
    );
}

export default ContactUsPage;
