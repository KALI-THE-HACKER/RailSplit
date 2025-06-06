import React from "react";
import navCSS from "./Nav.module.css"
import logo from "../../assets/IRCTC-logo.png"
import FavRoutes from "../FavRoutes.jsx";

function Nav(){
    return(
        <div className={navCSS.nav_wrapper}>
            <div className="navCSS.logo-div">
                <img className='navCSS.logo-img' src={logo} height='80px'/>
            </div>
            <ul>
                <li><a href="https://luckylinux.xyz">Home</a></li>
                <li><a href="https://luckylinux.xyz/favroutes">Favourite route</a></li>
                <li><a href="https://luckylinux.xyz/contactus">Contact us</a></li>
                <li><a href="https://luckylinux.xyz/aboutus">About us</a></li>
            </ul>
            
            <div>
                <button className={navCSS.signup_button}>Signup</button>
                <button className="px-4 py-2 rounded-[10px]">Login</button>
                
            </div>
        </div>
    );
}

export default Nav