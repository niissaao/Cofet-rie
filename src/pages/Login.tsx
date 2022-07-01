import React, {useRef, useState} from "react";
import {auth} from "../Firebase";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import "../styles/Login.css"
import {useNavigate} from "react-router-dom";
import {onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import {Toast} from "primereact/toast";

export const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const toast = useRef<any>(null);

  const onLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password)
    }
    catch(error) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Email sau parolă incorecte.',
        detail: 'Încearcă din nou.',
        life: 3000
      })
    }
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/");
    }
  });

  return (
    <>
      <Toast ref={toast} />
      <div className="login-container">
        <form className="login-form" autoComplete="off">
          <h1>Autentificare</h1>
          <div className="login-inputs">
            <label htmlFor="email">Adresă de email:</label>
            <InputText
              name="username"
              id="username"
              aria-describedby="username-help"
              className="login-input"
              placeholder="Adresa ta de email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-inputs">
            <label htmlFor="password">Parolă:</label>
            <Password
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              placeholder="Parola"
              className="login-input"/>
          </div>
          <div className="login-buttons">
            <Button type="submit" onClick={onLogin}>Autentifică-te</Button>
            <Button type="button" onClick={() => navigate("/inregistrare")}>Creează-ți cont!</Button>
          </div>
        </form>
      </div>
    </>
  )
}
