import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from '../../firebase';
import { getDoc, doc, setDoc } from "firebase/firestore";

function DesktopTatkalPage() {
    const navigate = useNavigate();
    const [showNotice, setShowNotice] = useState(true);
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const iAgree = async () => {
        setLoading(true);
        try {
            if (!auth.currentUser) {
                alert("Please log in to continue.");
                navigate('/login');
                return;
            }

            const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (userDoc.exists()) {
                const isPhoneVerified = userDoc.data()?.phone;
                if (isPhoneVerified) {
                    localStorage.setItem('phone', isPhoneVerified.replace('+91', ''));
                    alert(`Your phone number ${isPhoneVerified} is already added. You can proceed!`);
                    navigate('/tatkalbooking');
                    return;
                } else {
                    setShowNotice(false);
                }
            } else {
                setShowNotice(false);
            }
        } catch (err) {
            alert("Error checking verification: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUserIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return null;
        }
    };

    const addNumber = async (e) => {
        if (e) e.preventDefault();
        const cleanedPhone = phone.replace(/\D/g, "");
        if (cleanedPhone.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        setLoading(true);
        try {
            const userEmail = localStorage.getItem("email") || auth.currentUser?.email;
            const fullPhone = "+91" + cleanedPhone;

            await setDoc(doc(db, "users", auth.currentUser.uid), {
                phone: fullPhone,
                email: userEmail,
                ip: await getUserIP(),
                phoneVerifiedAt: new Date().toISOString(),
            }, { merge: true });

            localStorage.setItem('phone', cleanedPhone);
            alert("Phone number added, you can now proceed!");
            navigate('/tatkalbooking');
        } catch (err) {
            alert("Error saving phone number: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-black text-white py-12 px-8 flex items-center justify-center">
            <div className="max-w-xl w-full">
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#767676] hover:text-white transition cursor-pointer text-xl"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <h1 className="text-2xl font-semibold">Tatkal Booking</h1>
                </div>

                {showNotice ? (
                    <div className="bg-[#1D1F24] rounded-2xl p-8 shadow-xl text-justify text-white">
                        <p className="text-base text-gray-200 leading-relaxed">
                            We don’t book Tatkal tickets directly. Instead, we coordinate with our trusted agents to handle the booking. To proceed, we need your phone number. Once you submit your request, we’ll reach out to the agent. If booking is available, we’ll contact you for payment. After receiving the payment, we’ll send you the ticket.
                        </p>

                        <button
                            onClick={iAgree}
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold text-lg py-3.5 rounded-xl transition mt-8 cursor-pointer"
                        >
                            {loading ? "Checking..." : "I agree"}
                        </button>
                    </div>
                ) : (
                    <div className="bg-[#1D1F24] rounded-2xl p-8 shadow-xl text-white text-center">
                        <h2 className="text-3xl font-semibold mb-8">Phone Verification</h2>

                        <form onSubmit={addNumber} className="flex flex-col gap-6 items-center">
                            <div className="flex items-center border border-gray-500 rounded-xl overflow-hidden w-full h-14 bg-[#28292E]">
                                <span className="text-white text-lg px-4 border-r border-gray-600">+91</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    className="text-lg flex-1 px-4 outline-none bg-transparent text-white placeholder:text-gray-500"
                                    placeholder="9876XXXXX"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || phone.length !== 10}
                                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-lg font-semibold py-3.5 rounded-xl transition cursor-pointer"
                            >
                                {loading ? "Adding..." : "Add Number"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DesktopTatkalPage;
