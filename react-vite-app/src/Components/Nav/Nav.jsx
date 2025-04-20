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
                <li><a href={FavRoutes}></a>Favourite route</li>
                <li>Contact us</li>
                <li>About us</li>
            </ul>
            
            <div>
                <button className={navCSS.nav_buttons}>Signup</button>
                <button className={navCSS.nav_buttons}>Login</button>
                
            </div>
        </div>
    );
}

export default Nav