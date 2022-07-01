import {useEffect, useRef, useState} from "react";
import {collection, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {auth, database} from "../Firebase";
import {Button} from "primereact/button";
import "../styles/ShoppingBag.css"
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {DataView} from "primereact/dataview";
import {customObject} from "./Products";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import {AccountModel} from "./MyAccount";

type AddedProductModel = {
  productId: number,
  name: string,
  image: string,
  price: number,
  unit: string,
  number?: number,
  index: number
}

type OrderModel = {
  userId: string,
  orderId: number,
  products: Array<{productId: number, number: number | undefined}>
}

export const sortByProdId = (a: any, b: any) => {
  if (a.productId < b.productId)
    return -1;
  if (a.productId > b.productId)
    return 1;
  return 0;
}

export const ShoppingBag = () => {

  const navigate = useNavigate();

  const [products, setProducts] = useState<Array<AddedProductModel>>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  let allProducts: Array<AddedProductModel> = [];

  const toast = useRef<any>(null);

  let accounts: Array<AccountModel> = [];

  const deleteProduct = async (product: AddedProductModel) => {
    await setDoc(doc(database, "/productsInBag", "NeMO54Cz8bkfEHj9mu17"), {})
    let remainingProducts: Array<AddedProductModel> = [];
    products.forEach((prod) => {
      console.log("prod", prod)
      console.log("product", product)
      if(prod.name !== product.name){
        console.log("asta am pus in remainingProducts", prod)
        remainingProducts.push(prod)
      }
    })
    console.log(remainingProducts)
    for (const prod of remainingProducts) {
      let productObject: customObject = {};
      productObject[prod.index] = prod;
      console.log(productObject)
      await setDoc(doc(database, "/productsInBag", "NeMO54Cz8bkfEHj9mu17"), productObject, {merge: true})
    }
    setProducts(remainingProducts)
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/autentificare")
    }
  });

  const accept = async () => {
    const addedOrder: customObject = {};
    const order = ({
      userId: auth.currentUser!.uid,
      orderId: Math.floor(Math.random() * 1000),
      products: products.map((product) => {
        return {
          productId: product.productId,
          number: product.number
        }
      })
    })
    addedOrder[order.orderId] = order;
    await setDoc(doc(database, "/orders", "YLcdFKMEq15473EVihQc"), addedOrder, {merge: true})
    toast.current.show({ severity: 'info', summary: 'Comandă confirmată', detail: 'Comanda ta a fost înregistrată', life: 3000 });
    await setDoc(doc(database, "/productsInBag", "NeMO54Cz8bkfEHj9mu17"), {})
    setProducts([]);
    navigate(`/comanda-finalizata/${order.orderId}`);
  }

  const dialogMessage = (<div>
    <p>Comanda va fi livrată la adresa:</p>
    <p>{address}</p>
    <p>Veți fi contactat la numărul:</p>
    <p>{phone}</p>
  </div>);

  const footer = (<div className="footer-shopping-bag">
    <p className="total-products">Sumă totală: {totalProducts}</p>
    <Button
      label="Finalizare comandă"
      onClick={() => confirmDialog({
        message: dialogMessage,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: accept,
        acceptLabel: "Plasează comanda",
        rejectLabel: "Anulare"
      })}
    />
  </div>)

  const itemTemplate = (data: AddedProductModel) => {
    return (
      <div className="col-12">
        <div className="product-list-item">
          <img src={data.image} alt={data.name}/>
          <div className="product-list-detail">
            <a href={`/produs/${data.productId}`} className="product-name">{data.name}</a>
          </div>
          <div className="product-list-action">
            <span className="product-price">{data.price} RON/{data.unit}</span>
            <Button
              icon="pi pi-shopping-cart"
              label="Șterge produsul"
              onClick={() => deleteProduct(data)}
            />
          </div>
          <div className="quantity">
            <p>Cantitate: </p>
            <p>{data.number}</p>
          </div>
          <div className="quantity">
            <p>Total: </p>
            <p>{data.price * (data.number ? data.number : 1)} RON</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const prodColRef = query(collection(database, '/productsInBag'))
    const accountsRef = query(collection(database, '/accounts'))
    onSnapshot(prodColRef, (snapshot) => {
      snapshot.docs.map(doc => {
        let i = 0;
        Object.keys(doc.data()).map(fieldPath => {
          allProducts.push({
            name: doc.get(fieldPath).name,
            productId: doc.get(fieldPath).productId,
            image: doc.get(fieldPath).image,
            price: doc.get(fieldPath).price,
            unit: doc.get(fieldPath).unit,
            index: doc.get(fieldPath).index
          })
          i++;
        })
        allProducts.sort(sortByProdId);
        let total = 0;
        allProducts.forEach((product) => {
          let i = 0;
          total = total + product.price;
          allProducts.forEach((product2, index) => {
            if(product.productId === product2.productId) {
              i++;
              if(i > 1) {
                total = total + product2.price;
                allProducts.splice(index, 1);
              }
            }
          })
          product.number = i;
        })
        setProducts(allProducts);
        setTotalProducts(total);
      })
    })
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
            setPhone(account.phoneNumber)
          }
        })
      })
    })
  }, [])

  return<>
    <Toast ref={toast} />
    <ConfirmDialog />
    <DataView
      value={products}
      itemTemplate={itemTemplate}
      sortField="id"
      className="shopping-bag-container"
      header="Sumar comandă"
      footer={footer}
      emptyMessage="Coșul dumneavoastră este gol."
    />
  </>
}
