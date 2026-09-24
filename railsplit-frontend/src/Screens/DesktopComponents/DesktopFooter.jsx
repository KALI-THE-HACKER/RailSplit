import React from "react";
import { Link } from "react-router-dom";

function DesktopFooter() {
    return (
        <footer className="w-full bg-[#0e0f12] border-t border-[#1f2128] py-8 mt-auto text-gray-400 text-sm">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-white font-bold font-['Montserrat'] tracking-tight">
                        Rail<span className="text-blue-500">Split</span>
                    </span>
                    <span className="text-gray-600">|</span>
                    <p className="text-xs text-gray-500">
                        Smart split-ticket finder & tatkal assistance for Indian Railways.
                    </p>
                </div>

                <div className="flex items-center gap-6 text-xs text-gray-400">
                    <Link to="/searchtrains" className="hover:text-white transition">Indirect Trains</Link>
                    <Link to="/tatkal" className="hover:text-white transition">Tatkal Booking</Link>
                    <Link to="/pnrstatus" className="hover:text-white transition">PNR Status</Link>
                    <Link to="/aboutus" className="hover:text-white transition">About Us</Link>
                    <Link to="/contactus" className="hover:text-white transition">Contact</Link>
                </div>

            </div>
        </footer>
    );
}

export default DesktopFooter;
