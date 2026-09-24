import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Eye, EyeOff } from "lucide-react";
import image from "/image-2.png";

function DesktopLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function login(e) {
        if (e) e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill all fields!");
            return;
        }
        setLoading(true);
        try {
            const emailUserCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            const user = emailUserCredential.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                const username = userDoc.data().username || user.displayName || "User";
                localStorage.setItem("username", username);
                localStorage.setItem("email", email.trim());
                navigate('/');
            } else {
                const username = user.displayName || email.split('@')[0];
                localStorage.setItem("username", username);
                localStorage.setItem("email", email.trim());
                navigate('/');
            }
        } catch (err) {
            setError(err.message || "Failed to sign in. Please verify your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-black flex items-center justify-center py-12 px-6">
            <div className="max-w-md w-full bg-[#1D1F24] rounded-3xl p-8 shadow-2xl border border-[#2a2d36]">
                <h1 className="text-3xl font-semibold text-white mb-8 text-center">Login</h1>

                <form onSubmit={login} className="flex flex-col gap-6">
                    <div>
                        <input
                            className="border-b border-gray-600 focus:border-blue-500 h-12 w-full bg-transparent text-white text-lg focus:outline-none transition placeholder:text-gray-500"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="relative">
                        <input
                            className="border-b border-gray-600 focus:border-blue-500 h-12 w-full bg-transparent text-white text-lg focus:outline-none transition pr-10 placeholder:text-gray-500"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-3 text-gray-400 hover:text-white transition cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-white text-black font-semibold rounded-xl text-lg transition hover:bg-gray-200 mt-4 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-8 text-sm text-gray-400 text-center">
                    Don't have an account yet?{" "}
                    <Link to="/signup" className="text-white underline font-semibold">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default DesktopLoginPage;
