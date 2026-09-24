import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function DesktopContactUsPage() {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const formRef = useRef(null);

    const handleFormSubmit = () => {
        setTimeout(() => setShowSuccess(true), 300);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-black text-white py-12 px-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                {/* Header row */}
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#767676] hover:text-white transition cursor-pointer text-xl"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <h1 className="text-2xl font-semibold">Contact us</h1>
                </div>

                {/* Main Card */}
                <div className="bg-[#1D1F24] rounded-3xl p-8 md:p-10 shadow-xl flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
                    <p className="text-gray-300 text-center mb-6">
                        Have questions, feedback, or need help? <br />
                        We're here for you!
                    </p>

                    <div className="w-full max-w-md flex flex-col gap-4 mb-8">
                        <div
                            onClick={() => window.location.href = 'mailto:support@luckylinux.xyz'}
                            className="flex items-center gap-3 bg-[#23252b] rounded-xl px-5 py-3 cursor-pointer hover:bg-[#2b2d35] transition"
                        >
                            <i className="fa-solid fa-envelope text-blue-400 text-xl"></i>
                            <span className="text-white text-base">support@luckylinux.xyz</span>
                        </div>
                    </div>

                    <div className="w-full max-w-md">
                        <h3 className="text-white text-lg font-semibold mb-3">Or send us a message:</h3>
                        <form
                            ref={formRef}
                            action="https://formsubmit.co/luckyverma05657@gmail.com"
                            method="POST"
                            className="flex flex-col gap-3"
                            target="hidden_contact_iframe"
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
                                rows={4}
                                className="px-4 py-3 rounded-xl bg-[#28292E] text-white outline-none border border-gray-600 focus:border-blue-500 resize-none"
                            />
                            <input type="hidden" name="_captcha" value="false" />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-base transition mt-2 cursor-pointer"
                            >
                                Send Message
                            </button>
                        </form>

                        <iframe name="hidden_contact_iframe" style={{ display: "none" }} title="hidden_contact_iframe"></iframe>
                    </div>
                </div>
            </div>

            {/* Success Overlay Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                    <div className="bg-[#1D1F24] rounded-2xl p-8 max-w-sm w-full text-center flex flex-col items-center shadow-2xl">
                        <div className="w-14 h-14 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-2xl mb-4">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                        <p className="text-xs text-gray-300">
                            Thank you for reaching out. We will get back to you shortly.
                        </p>
                        <button
                            onClick={() => {
                                setShowSuccess(false);
                                if (formRef.current) formRef.current.reset();
                            }}
                            className="mt-6 px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DesktopContactUsPage;
