import {useEffect, useState} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";
import {database} from "../../Firebase";
import {sortById} from "../../components/Navbar";
import {ProductModel} from "./AllProducts";

export const Cookies = () => {
  const [cookies, setCookies] = useState<Array<ProductModel>>([]);
  const allCookies: Array<ProductModel> = [];

  useEffect(() => {
    const prodColRef = query(collection(database, '/products'))
    onSnapshot(prodColRef, (snapshot) => {
      snapshot.docs.map(doc => {
        Object.keys(doc.data()).map(fieldPath => {
          if(doc.get(fieldPath).category === "Biscuiți, fursecuri, macarons") {
            allCookies.push({
              availability: doc.get(fieldPath).availability,
              category: doc.get(fieldPath).category,
              name: doc.get(fieldPath).name,
              price: doc.get(fieldPath).price,
              unit: doc.get(fieldPath).unit,
              id: doc.get(fieldPath).id,
              description: doc.get(fieldPath).description ? doc.get(fieldPath).description : undefined,
              image: doc.get(fieldPath).image ? doc.get(fieldPath).image : undefined,
              quantity: doc.get(fieldPath).quantity ? doc.get(fieldPath).quantity : undefined
            })
          }
        })
        allCookies.sort(sortById);
        setCookies(allCookies)
      })
    })
  }, [])
	return <>
		<div>Cookies</div>
      {cookies.map(product => {
        return <div>{product.name}</div>
      })}
	</>
}
