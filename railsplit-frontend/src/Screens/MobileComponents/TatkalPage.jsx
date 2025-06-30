import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from '../../firebase';
import { getDoc, doc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from "firebase/auth";

function TatkalPage(){
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    const [showNotice, setShowNotice] = useState(true);
    const [phone, setPhone] = useState('');
    const [showOtpBox, setShowOtpBox] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState(null);
    

    const iAgree = async () => {
        
        try{
            const userDoc = await getDoc(doc(db, "users", auth.currentUser?.uid));
            if(userDoc.exists()){
                const isPhoneVerified = await userDoc.data().phone;
                if(isPhoneVerified){
                    const tempMessage = "Your phone number " + isPhoneVerified + " is already verified. You can proceed!";
                    alert(tempMessage);
                    navigate('/tatkalbooking');
                    return;
                }else{
                    setShowNotice(false);
                }
            }else{
                alert("Error fetching user info from our servers. Try again!")
            }
        }catch(err){
            alert(err.message)
        }
    };

    // Get user's IP address
    const getUserIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error getting IP:', error);
            return null;
        }
    };

    // Store IP-based limits in Firestore
    const checkIPLimits = async () => {
        const userIP = await getUserIP();
        if (!userIP) return { allowed: true };
        
        const ipDoc = await getDoc(doc(db, "ipLimits", userIP));
        
        if (ipDoc.exists()) {
            const data = ipDoc.data();
            const today = new Date().toDateString();
            
            if (data.date === today && data.requests >= 2) {
                return { 
                    allowed: false, 
                    message: "You have reached the maximum limit of OTP requests for today. If you need immediate assistance, please contact the admin." 
                };
            }
        }
        
        return { allowed: true, userIP };
    };


    const setupRecaptcha = () => {
        try {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
            
            
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible",
            });
            
        } catch (error) {
            alert("Error creating recaptcha: " + error.message);
            console.error("Full error:", error);
        }
    };


    const sendOtp = async () => {
        if(phone.length!=10){
            alert("Please provide a legit phone number!");
            return;
        }

        // Check IP limits first
        const ipCheck = await checkIPLimits();
        if (!ipCheck.allowed) {
            alert(ipCheck.message);
            return;
        }
        try{
            setupRecaptcha();
            setSendingOtp(true);
            setShowOtpBox(true);
            const confirmationResult = await signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier);
            setConfirmation(confirmationResult);
            setSendingOtp(false);

            
        }catch(err){
            setError(err);
            setSendingOtp(false);
        }
        
        setSendingOtp(false);

        // Update IP counter after successful send
        if (ipCheck.userIP) {
            await setDoc(doc(db, "ipLimits", ipCheck.userIP), {
                requests: increment(1),
                phone: "+91"+phone,
                date: new Date().toDateString(),
                lastRequest: serverTimestamp()
            }, { merge: true });
        }

    };

    async function saveNumberToDb(phoneNumber) {
        try {
            const userEmail = localStorage.getItem("email");
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                phone: phoneNumber,
                email: userEmail,
                phoneVerifiedAt: new Date(),
            }, { merge: true });
        } catch(err) {
            alert("Error : " + err.message);
        }
    }

    const verifyOtp = async () => {
        if(otp.length!=6){
            alert("Please enter a valid OTP!");
            return;
        }
        try {
            setVerifyingOtp(true);

            // Confirm the OTP and get the phone credential
            const result = await confirmation.confirm(otp);
            const phoneCredential = PhoneAuthProvider.credential(confirmation.verificationId, otp);

            // Ensure the user is signed in with email before linking
            const emailUser = auth.currentUser;
            if (!emailUser) {
                alert("You must be logged in with your email to link your phone.");
                setVerifyingOtp(false);
                return;
            }

            // Link the phone credential to the current user
            await linkWithCredential(emailUser, phoneCredential);
            await auth.updateCurrentUser(emailUser);

            // Save/merge the phone number in Firestore
            await saveNumberToDb("+91" + phone);
            localStorage.setItem("phone", phone);

            alert("Phone verified and linked!");
            navigate('/tatkalbooking');
        } catch (err) {
            if (err.code === 'auth/credential-already-in-use' || err.code === 'auth/account-exists-with-different-credential') {
                alert("This phone number is already linked to another account. Please login with the correct account.");
            } else if (err.code === 'auth/invalid-verification-code') {
                alert("Incorrect OTP. Please try again.");
            } else if (err.code === 'auth/provider-already-linked') {  
                localStorage.setItem("phone", phone);
                alert("You can proceed, you're linked already!");
                navigate('/tatkalbooking');
            } else {
                alert(err.message);
            }
        } finally {
            setVerifyingOtp(false);
        }
    };
  

    return(
        <>
        <div className="h-screen w-full bg-black relative flex flex-col items-center py-5 ">
            <div className="flex flex-row items-center w-full">
                <i onClick={() => navigate('/')} className="fa-solid fa-angle-left text-[#767676] text-2xl" />
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#1D1F24] h-12 w-[90vw] flex justify-center items-center rounded-4xl"><h2 className="text-white text-2xl font-semibold">{"Tatkal Booking"}</h2></div>    
            </div>

            { showNotice ?
                <div className="relative w-90 h-fit py-5 rounded-2xl text-justify bg-[#1D1F24] text-white text-2xl px-5 top-20">
                    <p>We don’t book Tatkal tickets directly. Instead, we coordinate with our trusted agents to handle the booking. To proceed, we need to verify your phone number. Once you submit your request, we’ll reach out to the agent. If booking is available, we’ll contact you for payment. After receiving the payment, we’ll send you the ticket.</p>

                    <button onClick={iAgree} className="border-0 bg-blue-500 text-white text-xl font-semibold mt-10 mb-5 h-13 rounded-xl w-full">I agree</button>
                </div>
            
            
            : <div className="absolute top-[27vh] left-[5vw] backdrop-blur-xs bg-[#1D1F24] p-6 rounded-2xl w-[90vw] text-center text-white z-20">
            <h1 className="text-4xl font-semibold text-white mb-10">Phone Verification</h1>
            <div className="flex flex-col gap-4 items-center">
                <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden w-[75vw] h-14">
                    <span className="text-white text-xl px-3">+91</span>
                    <input
                        onChange={(e) => setPhone(e.target.value)}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={10}
                        className="text-xl flex-1 px-3 py-2 outline-none bg-transparent text-white"
                        placeholder="9876XXXXX"
                    />
                    </div>

                <div id="recaptcha-container"></div>
                { showOtpBox && 
                <div className="relative flex flex-col gap-2">
                    <input
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        maxLength={6}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        className="border border-gray-400 px-4 h-12 w-[75vw] rounded-lg bg-transparent text-white text-xl focus:outline-none"
                    />
                    <span className="italic text-green-600"> OTP sent!</span>
                    
                </div>
                }

                <button onClick={() => {
                    if(!showOtpBox){
                        sendOtp();
                    } else{
                        verifyOtp();
                    }
                    }} className="border-0 bg-blue-500 text-white text-xl font-semibold mt-4 mb-2 h-13 w-[75vw] rounded-xl">{!showOtpBox 
                        ? (sendingOtp ? "Sending OTP..." : "Get OTP") 
                        : (verifyingOtp ? "verifying OTP..." : "Verify OTP")}
                </button>
            </div>
            
            <div>
            </div>
            </div>
            }
            
        </div>
        </>
    );
}

export default TatkalPage;