import React from 'react';
import './styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {Navbar} from "./components/Navbar";
import {Products} from "./pages/Products";
import {MyAccount} from "./pages/MyAccount";
import {About} from "./pages/About";
import {Signup} from "./pages/SignUp";
import {Login} from "./pages/Login";
import {ShoppingBag} from "./pages/ShoppingBag";
import {Contact} from "./pages/Contact";
import {Product} from "./pages/Product";
import {ConfirmCommand} from "./pages/ConfirmCommand";

function App() {
  return (<div className="App">
    <BrowserRouter>
      <Navbar/>
    </BrowserRouter>
    <BrowserRouter>
      <Routes>
        <Route path="/produse" element={<Products/>}/>
      </Routes>
      <Routes>
        <Route path="/contul-meu" element={<MyAccount/>}/>
      </Routes>
      <Routes>
        <Route path="/despre-noi" element={<About/>}/>
      </Routes>
      <Routes>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
      <Routes>
        <Route path="/cosul-meu" element={<ShoppingBag/>}/>
      </Routes>
      <Routes>
        <Route path="/inregistrare" element={<Signup/>}/>
      </Routes>
      <Routes>
        <Route path="/autentificare" element={<Login/>}/>
      </Routes>
      <Routes>
        <Route path="/produs">
          <Route path=":productId" element={<Product/>}/>
        </Route>
      </Routes>
      <Routes>
        <Route path="/comanda-finalizata">
          <Route path=":orderId" element={<ConfirmCommand/>}/>
        </Route>
      </Routes>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  </div>);
}

export default App;
