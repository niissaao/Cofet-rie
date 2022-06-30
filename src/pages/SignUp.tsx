import React, { useState} from 'react'
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Divider} from "primereact/divider";
import "../styles/SignUp.css"
import {Button} from "primereact/button";
import {auth, database} from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {customObject} from "./Products";
import {useNavigate} from "react-router-dom";

export const Signup = () => {

  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  let userId = ''

  const footer = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Parola trebuie să conțină:</p>
      <ul className="pl-2 ml-2 mt-0" style={{lineHeight: '1.5'}}>
        <li>Cel puțin o literă mică</li>
        <li>Cel puțin o literă mare</li>
        <li>Cel puțin o cifră</li>
        <li>Minim 8 caractere</li>
      </ul>
    </React.Fragment>
  );

  const onSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then((user ) => {
        userId = user.user.uid;
        addUserDetails();
        navigate("/contul-meu");
      })
    }
    catch(error) {
      console.log(`There was an error: ${error}`)
    }
  }

  const addUserDetails = async () => {
    const newUser: customObject = {};
    newUser[userId!] = {
      name: name,
      phoneNumber: phone,
      address: address,
      userId: userId
    }
    await setDoc(doc(database, "/accounts", "CyPZL7rglCM6ozXy2ESH"), newUser, {merge: true})
  }

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" autoComplete="off">
        <h1>Înregistrare</h1>
        <div className="sign-up-inputs">
          <label htmlFor="username">Adresă de email:</label>
          <InputText
            id="username"
            aria-describedby="username-help"
            className="sign-up-input"
            placeholder="Adresa ta de email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="sign-up-inputs">
          <label htmlFor="name">Nume și prenume:</label>
          <InputText
            id="name"
            className="sign-up-input"
            placeholder="Nume și prenume"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="sign-up-inputs">
          <label htmlFor="phone">Numărul tău de telefon:</label>
          <InputText
            id="phone"
            className="sign-up-input"
            placeholder="Număr de telefon"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="sign-up-inputs">
          <label htmlFor="address">Adresă:</label>
          <InputText
            id="address"
            className="sign-up-input"
            placeholder="Adresă"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="sign-up-inputs">
          <label htmlFor="password">Parolă:</label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            footer={footer}
            toggleMask
            placeholder="Alege parola"
            className="sign-up-input"/>
        </div>
        <Button type="button" onClick={() => onSignUp()}>Înregistrează-te</Button>
      </form>
    </div>
  )
}
