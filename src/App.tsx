import React from 'react';
import './styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {Navbar} from "./components/Navbar";
import {Cakes} from "./pages/produse/Cakes";
import {Cookies} from "./pages/produse/Cookies";
import {Cupcakes} from "./pages/produse/Cupcakes";
import {AllProducts} from "./pages/produse/AllProducts";
import homeImg from "./resources/img/home.jpg";
import {Image} from "primereact/image";
import {MyAccount} from "./pages/MyAccount";
import {About} from "./pages/About";

function App() {
  return (<div className="App">
      <BrowserRouter>
        <Navbar/>
      </BrowserRouter>
      <div className="image-container">
        <Image src={homeImg} alt='home image' className='homeImage'/>
        <BrowserRouter>
          <Routes>
            <Route path="/torturi-tarte-prajituri" element={<Cakes/>}/>
          </Routes>
          <Routes>
            <Route path="/biscuiti-fursecuri-macarons" element={<Cookies/>}/>
          </Routes>
          <Routes>
            <Route path="/briose-mini-prajituri-eclere" element={<Cupcakes/>}/>
          </Routes>
          <Routes>
            <Route path="/toate-produsele" element={<AllProducts/>}/>
          </Routes>
          <Routes>
            <Route path="/contul-meu" element={<MyAccount/>}/>
          </Routes>
          <Routes>
            <Route path="/despre-noi" element={<About/>}/>
          </Routes>
          <Routes>
            <Route path="/" element={<Home/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>);
}

export default App;
