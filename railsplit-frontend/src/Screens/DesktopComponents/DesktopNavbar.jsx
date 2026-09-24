import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

function DesktopNavbar({ loggedIn, username }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            navigate('/');
        } catch (err) {
            alert("Logout failed: " + err.message);
        }
    };

    const navLinks = [
        { name: "Indirect Trains", path: "/searchtrains" },
        { name: "Tatkal Booking", path: "/tatkal" },
        { name: "PNR Status", path: "/pnrstatus" },
        { name: "Live Status", path: "/livetrainstatus" },
        { name: "About Us", path: "/aboutus" },
        { name: "Contact Us", path: "/contactus" },
    ];

    const isActive = (path) => {
        if (path === "/searchtrains" && (location.pathname === "/searchtrains" || location.pathname === "/showtrains")) {
            return true;
        }
        if (path === "/tatkal" && (location.pathname === "/tatkal" || location.pathname === "/tatkalbooking")) {
            return true;
        }
        return location.pathname === path;
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-[#121316]/95 backdrop-blur-md border-b border-[#23252d]">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                        <i className="fa-solid fa-train-subway text-lg"></i>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white font-['Montserrat']">
                        Rail<span className="text-blue-500">Split</span>
                    </span>
                </Link>

                {/* Center Navigation Links */}
                <nav className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    active
                                        ? "text-white bg-[#1e2027] font-semibold"
                                        : "text-gray-400 hover:text-gray-200 hover:bg-[#181a20]"
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Auth / Profile section */}
                <div className="flex items-center gap-3">
                    {loggedIn ? (
                        <>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1c23] border border-[#2a2d38]">
                                <i className="fa-solid fa-user-circle text-blue-400 text-base"></i>
                                <span className="text-sm font-medium text-gray-200 max-w-[120px] truncate">
                                    {username || "User"}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                title="Sign out of account"
                                className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-[#1c1d24] transition flex items-center gap-1.5"
                            >
                                <i className="fa-solid fa-right-from-bracket text-xs"></i>
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1c1e24] transition"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default DesktopNavbar;
