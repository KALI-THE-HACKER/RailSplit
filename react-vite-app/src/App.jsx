import React from 'react';
import Nav from './Components/Nav/Nav.jsx';
import Bg1 from './assets/background-1.png';
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return(
    <>
    <div className="section section1">
    <Nav/>
    </div>
    </>
  );
}

export default App
