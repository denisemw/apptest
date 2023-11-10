import React from "react";
import WebcamVideo from "./WebcamVideo";
import "./App.css";
import logo from './ORCA.png'

function App() {

  return (

    <div className="App">
      
      <div className="img">
      <img src={logo} />
      </div>
      <WebcamVideo/>
    </div>

  );
}

export default App;