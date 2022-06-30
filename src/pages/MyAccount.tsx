import {useNavigate} from "react-router-dom";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, database} from "../Firebase";
import {Card} from "primereact/card";
import photo from "../resources/img/product.jpg"
import {Button} from "primereact/button";
import "../styles/MyAccount.css";
import {useEffect, useState} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";

export type AccountModel = {
  name: string,
  address: string,
  phoneNumber: string,
  userId: string
}

const logout = async () => {
  await signOut(auth);
}

export const MyAccount = () => {
  const navigate = useNavigate();

  const header = <img src={photo} className="profile-photo" alt="photo"/>
  const footer = <Button label="Deconectare" onClick={() => logout()}/>
  const [email, setEmail] = useState<string | null>();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  let accounts: Array<AccountModel> = [];

  useEffect(() => {
    const accountsRef = query(collection(database, '/accounts'))
    onSnapshot(accountsRef, (snapshot) => {
      snapshot.docs.map(doc => {
        Object.keys(doc.data()).map(fieldPath => {
          accounts.push({
            name: doc.get(fieldPath).name,
            address: doc.get(fieldPath).address,
            phoneNumber: doc.get(fieldPath).phoneNumber,
            userId: doc.get(fieldPath).userId,
          })
        })
        accounts.forEach((account) => {
          if(account.userId === auth.currentUser?.uid) {
            setAddress(account.address)
            setName(account.name)
            setPhone(account.phoneNumber)
            setEmail(auth.currentUser.email)
          }
        })
      })
    })
  }, [])

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/autentificare")
    }
  });

  return <>
    <Card title="Contul meu" header={header} footer={footer} className="profile-card">
      <p>Nume: {name}</p>
      <p>Adresă: {address}</p>
      <p>Număr de telefon: {phone}</p>
      <p>Adresă de email: {email}</p>
    </Card>
  </>
}
