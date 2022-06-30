import '../styles/Home.css'
import {Carousel} from "primereact/carousel";
import {useEffect, useState} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";
import {database} from "../Firebase";
import productPhoto from "../resources/img/product.jpg";
import productPhoto2 from "../resources/img/product2.jpg";
import productPhoto3 from "../resources/img/product3.jpg";
import productPhoto4 from "../resources/img/product4.jpg";
import productPhoto5 from "../resources/img/product5.jpg";
import productPhoto6 from "../resources/img/product6.jpg";
import productPhoto7 from "../resources/img/product7.jpg";
import {ProductModel} from "./Products";
import {Rating} from "primereact/rating";
import {sortByProdId} from "./ShoppingBag";

export const productPhotos = [productPhoto, productPhoto2, productPhoto3, productPhoto4, productPhoto5, productPhoto6, productPhoto7];

export const Home = () => {
  const [products, setProducts] = useState<Array<ProductModel>>([]);
  const allProducts: Array<ProductModel> = [];

  const carouselHeader = <h5>Cele mai îndrăgite produse!</h5>;

  const productTemplate = (product: ProductModel) => {
    return (<div className="product-item-content">
      <div className="mb-3">
        <img src={product.image} alt={product.name} className="product-image"/>
      </div>
      <div>
        <a href={`/produs/${product.productId}`}>{product.name}</a>
        <h6>{product.price} RON/{product.unit}</h6>
        {/*<Rating value={product.rating} readOnly cancel={false}></Rating>*/}
      </div>
    </div>);
  }

  useEffect(() => {
    const prodColRef = query(collection(database, '/products'))
    onSnapshot(prodColRef, (snapshot) => {
      snapshot.docs.map(doc => {
        Object.keys(doc.data()).map(fieldPath => {
          allProducts.push({
            availability: doc.get(fieldPath).availability,
            category: doc.get(fieldPath).category,
            name: doc.get(fieldPath).name,
            price: doc.get(fieldPath).price,
            unit: doc.get(fieldPath).unit,
            productId: doc.get(fieldPath).id,
            description: doc.get(fieldPath).description ? doc.get(fieldPath).description : undefined,
            image: doc.get(fieldPath).image ? doc.get(fieldPath).image : productPhotos[doc.get(fieldPath).id%7],
            quantity: doc.get(fieldPath).quantity ? doc.get(fieldPath).quantity : undefined,
            rating: doc.get(fieldPath).rating
          })
        })
        allProducts.sort(sortByProdId);
        setProducts(allProducts)
      })
    })
  }, [])

  return <>
    <Carousel
      value={products}
      numVisible={4}
      numScroll={1}
      circular
      autoplayInterval={3000}
      itemTemplate={productTemplate}
      header={carouselHeader}
    />
  </>
}
