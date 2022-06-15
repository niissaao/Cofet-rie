import '../styles/Home.css'
import {Carousel} from "primereact/carousel";
import {useEffect, useState} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";
import {database} from "../Firebase";
import productPhoto from "../resources/img/product.jpg";
import {sortById} from "../components/Navbar";
import {ProductModel} from "./produse/AllProducts";
import {Rating} from "primereact/rating";

export const Home = () => {
  const [products, setProducts] = useState<Array<ProductModel>>([]);
  const allProducts: Array<ProductModel> = [];

  const carouselHeader = <h5>Cele mai îndrăgite produse ale noastre!</h5>;

  const productTemplate = (product: ProductModel) => {
    return (<div className="product-item-content">
      <div className="mb-3">
        <img src={product.image} alt={product.name} className="product-image"/>
      </div>
      <div>
        <a
          href={product.category === "Biscuiți, fursecuri, macarons" ? "/biscuiti-fursecuri-macarons"
            : product.category === "Brioșe, mini prăjituri, eclere" ? "/briose-mini-prajituri-eclere"
              : "/torturi-tarte-prajituri"}>{product.name}
        </a>
        <h6>${product.price}</h6>
        <Rating value={product.rating} readOnly cancel={false}></Rating>
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
            id: doc.get(fieldPath).id,
            description: doc.get(fieldPath).description ? doc.get(fieldPath).description : undefined,
            image: doc.get(fieldPath).image ? doc.get(fieldPath).image : productPhoto,
            quantity: doc.get(fieldPath).quantity ? doc.get(fieldPath).quantity : undefined,
            rating: doc.get(fieldPath).rating
          })
        })
        allProducts.sort(sortById);
        setProducts(allProducts)
      })
    })
  }, [])

  return <>
    <Carousel value={products} numVisible={4} numScroll={1} circular autoplayInterval={3000}
              itemTemplate={productTemplate} header={carouselHeader}/>
  </>
}
