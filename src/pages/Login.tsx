import {useEffect, useState} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";
import {database} from "../Firebase";
import { doc, setDoc } from "firebase/firestore";

type loginModel = {
  email: string;
  password: string;
  id: number;
}

export const Login = () => {

  const [accounts, setAccounts] = useState<Array<loginModel>>([]);
  const allAccounts: Array<loginModel> = [];

  useEffect(() => {
    const accountColRef = query(collection(database, '/accounts'))
    onSnapshot(accountColRef, (snapshot) => {
      snapshot.docs.forEach(doc => {
        Object.keys(doc.data()).forEach(fieldPath => {
          allAccounts.push({
            email: doc.get(fieldPath).email,
            password: doc.get(fieldPath).password,
            id: doc.get(fieldPath).id,
          })
        })
        // console.log(doc.data())
        setAccounts(allAccounts)
      })
    })
  }, [])

  const email = "admin@a.a";
  const password = "1234";

  for(let i = 0; i < accounts.length; i++) {
    if(email === accounts[i].email) {
      if(password === accounts[i].password)
        console.log("aaaaaa")
    }
  }

  // console.log(accounts)

  const addUsr = async () => {
    await setDoc(doc(database, "/accounts", "VgIwKzqq7RExK91S8P36"), {
      u3: {
        email: "admin@b.b",
        password: "4321",
        id: 3
      }
    }, { merge: true }).then();
  }

  addUsr();

  return <>

  </>
}
