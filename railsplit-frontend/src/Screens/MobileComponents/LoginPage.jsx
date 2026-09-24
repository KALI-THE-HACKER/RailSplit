import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import image from "/image-2.png";
import { Eye, EyeOff } from "lucide-react";

const DEMO_EMAIL = "guest@luckylinux.dev";
const DEMO_PASSWORD = "demo123456";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    async function executeLogin(loginEmail, loginPassword) {
        setError("");
        if (!loginEmail || !loginPassword) {
            setError("Please fill all fields!");
            return;
        }
        setLoading(true);
        try {
            const emailUserCredential = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
            const user = emailUserCredential.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                const username = userDoc.data().username;
                localStorage.setItem("username", username);
                localStorage.setItem("email", loginEmail.trim());
                navigate('/');
            } else {
                const username = user.displayName || loginEmail.split('@')[0];
                localStorage.setItem("username", username);
                localStorage.setItem("email", loginEmail.trim());
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }

    async function login() {
        await executeLogin(email, password);
    }

    async function handleDemoLogin() {
        setEmail(DEMO_EMAIL);
        setPassword(DEMO_PASSWORD);
        await executeLogin(DEMO_EMAIL, DEMO_PASSWORD);
    }

    useEffect(() => {
        if (location.search.includes("demo=true")) {
            setEmail(DEMO_EMAIL);
            setPassword(DEMO_PASSWORD);
        }
    }, [location.search]);

    return (
        <div className="h-screen w-full relative bg-black">
            <img
                src={image}
                className="object-cover fixed w-screen top-[-10%] z-0"
                style={{ filter: 'blur(1px)' }}
            />

            <div className="absolute top-[24vh] left-[5vw] z-10 backdrop-blur-xs bg-white/10 p-6 rounded-2xl w-[90vw] text-center text-white">
                <h1 className="text-4xl font-semibold text-white mb-8">Login</h1>
                <div className="flex flex-col gap-8 items-center">
                    <input
                        className="border-b border-green-100 h-12 w-[80vw] rounded-lg bg-transparent text-white text-xl focus:outline-none"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <div className="relative">
                        <input
                            className="border-b border-green-100 h-12 w-[80vw] rounded-lg bg-transparent text-white text-xl focus:outline-none pr-10"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div
                            className="absolute right-3 top-3 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff color="white" size={20} /> : <Eye color="white" size={20} />}
                        </div>
                    </div>
                </div>
                {error && (
                    <div className="text-red-500 p-2 rounded mt-2">
                        {error}
                    </div>
                )}
                <div className="flex flex-col items-center gap-3 mt-8">
                    <button
                        onClick={() => {
                            if (email && password) { login(); }
                        }}
                        disabled={loading}
                        className="border-0 bg-gray-100 text-black text-xl font-semibold h-11 w-70 rounded-xl"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        disabled={loading}
                        className="border border-blue-400/40 bg-black/40 text-blue-400 text-lg font-semibold h-11 w-70 rounded-xl flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-user-check text-sm"></i>
                        <span>Guest Login</span>
                    </button>
                </div>
            </div>

            <p className="absolute bottom-28 z-20 text-gray-300 text-center w-full">
                Don't have an account yet? <a href="/signup" className="text-white font-semibold underline text-md">Sign up</a>
            </p>

            <div className="fixed top-80 w-full h-[100vh] bg-[linear-gradient(to_top,_black_65%,_transparent_100%)] z-5"></div>
        </div>
    );
}

export default LoginPage;
