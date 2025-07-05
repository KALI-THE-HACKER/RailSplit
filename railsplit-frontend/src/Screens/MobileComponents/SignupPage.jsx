import { React, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import image from "/image-2.png";
import { Eye, EyeOff } from "lucide-react";




function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    async function signup(){
        setError("");
        if (!username || !email || !password) {
            setError("Please fill all fields!");
            return;
        }
        setLoading(true);
        try {
            const emailUserCredential =  await createUserWithEmailAndPassword(auth, email, password);
            const user = emailUserCredential.user;

            // Update profile with username
            await updateProfile(user, { displayName: username });

            // Save user info in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                username: username,
            });

            // Set username/email in localStorage
            localStorage.setItem("username", username);
            localStorage.setItem("email", email);

            alert("Account created successfuly!");

            // Force reload to ensure auth state and displayName are synced everywhere
            window.location.replace("/");
        } catch(err) {
            setError(err.message);
        }
        setLoading(false);
    }     

    return (
        <div className="h-screen w-full relative bg-black">
          
            <img
                src={image}
                className="object-cover fixed w-screen top-[-10%] z-0"
                style={{ filter: 'blur(1px)' }}
            />

            <div className="absolute top-[20vh] left-[5vw] z-10 backdrop-blur-xs bg-white/10 p-6 rounded-2xl w-[90vw] text-center text-white">
            <h1 className="text-4xl font-semibold text-white mb-10">Signup</h1>
            <div className="flex flex-col gap-10 items-center">
                <input
                    className="border-b border-green-100 h-12 w-[80vw] rounded-lg bg-transparent text-white text-xl focus:outline-none"
                    placeholder="Username"
                    type="text"
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className="border-b border-green-100 h-12 w-[80vw] rounded-lg bg-transparent text-white text-xl focus:outline-none"
                    placeholder="Email"
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                />
                <div className="relative">
                    <input
                        className="border-b border-green-100 h-12 w-[80vw] rounded-lg bg-transparent text-white text-xl focus:outline-none" type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <div
                        className="absolute right-3 top-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >{showPassword ? <EyeOff color="white" size={20} /> : <Eye color="white" size={20} />}</div>
                </div>
            </div>
            {error && (
                <div className="text-red-500 p-2 rounded">
                    {error}
                </div>
            )}
            <div>
                <button onClick={signup} disabled={loading} className="border-0 bg-gray-100 text-black text-xl font-semibold mt-10 mb-0 h-11 w-70 rounded-xl">{loading ? "Signing up..." : "Signup"}</button>
            </div>
            </div>
            <p className="absolute bottom-25 z-20 text-gray-300 text-center w-full">Already have an account? <a href="/login" className=" text-white font-semibold underline text-md">Login</a></p>

            <div className="fixed top-80 w-full h-[100vh] bg-[linear-gradient(to_top,_black_65%,_transparent_100%)] z-5"></div>
        </div>
    );
}

export default SignupPage;
