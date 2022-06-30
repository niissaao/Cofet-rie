import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {collection, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {database} from "../Firebase";
import {customObject, ProductModel} from "./Products";
import {productPhotos} from "./Home";
import "../styles/Product.css";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";

export const Product = () => {
  const params = useParams();

  const [thisProduct, setThisProduct] = useState<ProductModel>();
  let product: ProductModel = {availability: false, category: "", name: "", price: 0, productId: -1, unit: ""};
  const [index, setIndex] = useState<number>(0);
  const toast = useRef<any>(null);

  useEffect(() => {
    const prodColRef = query(collection(database, '/products'))
    onSnapshot(prodColRef, (snapshot) => {
      snapshot.docs.map(doc => {
        Object.keys(doc.data()).map(fieldPath => {
          if (doc.get(fieldPath).id.toString() === params.productId) {
            product.availability = doc.get(fieldPath).availability;
            product.category = doc.get(fieldPath).category;
            product.name = doc.get(fieldPath).name;
            product.price = doc.get(fieldPath).price;
            product.unit = doc.get(fieldPath).unit;
            product.productId = doc.get(fieldPath).id;
            product.description = doc.get(fieldPath).description ? doc.get(fieldPath).description : undefined;
            product.image = doc.get(fieldPath).image ? doc.get(fieldPath).image : productPhotos[doc.get(fieldPath).id%7];
            product.quantity = doc.get(fieldPath).quantity ? doc.get(fieldPath).quantity : undefined;
            product.rating = doc.get(fieldPath).rating
          }
        })
        setThisProduct(product)
      })
    })
  }, [])

  const addProductInBag = async (product: any) => {
    const addedProduct: customObject = {};
    const rand = index+Math.floor(Math.random() * 1000);
    addedProduct[rand] = {
      name: product.name,
      productId: product.productId,
      image: product.image,
      price: product.price,
      unit: product.unit,
      index: rand
    }
    await setDoc(doc(database, "/productsInBag", "NeMO54Cz8bkfEHj9mu17"),
      addedProduct,
      {merge: true}).then(() => {
      toast.current?.show({
        severity: 'success',
        summary: 'Produs adăugat cu succes',
        detail: 'Vezi detalii coș',
        life: 3000
      });
      setIndex(index + 1)
    });
  }

  return <>
  <Toast ref={toast} />
  <Card className="product-container">
    <img src={thisProduct?.image} alt="photo"/>
    <div className="details">
      <h1>{thisProduct?.name}</h1>
      <h2 className="product-price">{thisProduct?.price} RON/{thisProduct?.unit}</h2>
      {!thisProduct?.availability ? <p>Produs momentan indisponibil</p> : undefined}
      <div className="category">
        <i className="pi pi-tag product-category-icon"></i>
        <span className="product-category">{thisProduct?.category}</span>
      </div>
      <h2>Descrierea produsului</h2>
      <p>{thisProduct?.description}</p>
      <Button
        icon="pi pi-shopping-cart"
        label="Adaugă în coș"
        disabled={!thisProduct?.availability}
        onClick={() => addProductInBag({
          name: thisProduct?.name,
          productId: thisProduct?.productId,
          price: thisProduct?.price,
          unit: thisProduct?.unit,
          image: thisProduct?.image
        })}
      />
    </div>
  </Card>
  </>
}
