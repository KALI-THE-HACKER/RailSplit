import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from '../../firebase';
import { getDoc, doc, setDoc } from "firebase/firestore";

function TatkalPage(){
    const navigate = useNavigate();

    const [showNotice, setShowNotice] = useState(true);
    const [phone, setPhone] = useState('');
    

    const iAgree = async () => {
        
        try{
            const userDoc = await getDoc(doc(db, "users", auth.currentUser?.uid));
            if(userDoc.exists()){
                const isPhoneVerified = await userDoc.data().phone;
                if(isPhoneVerified){
                    const tempMessage = "Your phone number " + isPhoneVerified + " is already added. You can proceed!";
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
            return null;
        }
    };

    async function saveNumberToDb(phoneNumber) {
        try {
            const userEmail = localStorage.getItem("email");
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                phone: phoneNumber,
                email: userEmail,
                ip: await getUserIP(),
                phoneVerifiedAt: new Date(),
            }, { merge: true });
        } catch(err) {
            alert("Error : " + err.message);
        }
    };

    const addNumber = async () => {
        try {
            await saveNumberToDb("+91"+phone);
            localStorage.setItem('phone', phone);
            alert("Phone number added, you can now proceed!");
            navigate('/tatkalbooking');
        } catch(err) {
            alert("Error : " + err.message);
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
                    <p>We don’t book Tatkal tickets directly. Instead, we coordinate with our trusted agents to handle the booking. To proceed, we need your phone number. Once you submit your request, we’ll reach out to the agent. If booking is available, we’ll contact you for payment. After receiving the payment, we’ll send you the ticket.</p>

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

                <button onClick={addNumber} className="border-0 bg-blue-500 text-white text-xl font-semibold mt-4 mb-2 h-13 w-[75vw] rounded-xl">
                    Add Number
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