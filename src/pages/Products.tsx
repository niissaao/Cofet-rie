import {useEffect, useRef, useState} from "react";
import {collection, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {database} from "../Firebase";
import {DataView, DataViewSortOrderType} from "primereact/dataview";
import {Rating} from "primereact/rating";
import {Button} from "primereact/button";
import "../styles/Products.css";
import {Dropdown} from "primereact/dropdown";
import {Checkbox} from "primereact/checkbox";
import {Slider, SliderValueType} from "primereact/slider";
import {MultiSelect} from "primereact/multiselect";
import {Toast} from "primereact/toast";
import {productPhotos} from "./Home";
import {sortByProdId} from "./ShoppingBag";

export type ProductModel = {
  availability?: boolean,
  category?: string,
  description?: string,
  productId: number,
  image?: string,
  name: string,
  price: number,
  quantity?: string,
  unit: string,
  rating?: number;
}

export interface customObject {
  [key: string]: any;
}

export const Products = () => {
  let maxPrice = 0;

  const sortOptions = [
    {label: 'După categorie', value: 'category'},
    {label: 'Preț crescător', value: 'price'},
    {label: 'Preț descrescător', value: '!price'},
    {label: 'De la A la Z', value: 'az'},
    {label: 'De la Z la A', value: 'za'},
    // {label: 'Rating', value: 'rating'},
  ];

  const [products, setProducts] = useState<Array<ProductModel>>([]);
  const allProducts: Array<ProductModel> = [];

  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState<DataViewSortOrderType>(null);
  const [sortField, setSortField] = useState<string>("");

  const [filteredProducts, setFilteredProducts] = useState<Array<ProductModel>>(products)

  const categs = ["Biscuiți, fursecuri, macarons", "Brioșe, mini prăjituri, eclere", "Torturi, tarte, prăjituri"];
  const units = ["pe kg", "la bucată", "pe cutie"];
  const [stockFilter, setStockFilter] = useState<boolean>(false);
  const [categories, setCategories] = useState(categs);
  const [priceRange, setPriceRange] = useState<Array<number>>([0, maxPrice]);
  const [filteredUnits, setFilteredUnits] = useState<Array<string>>(units);

  const [maxRange, setMaxRange] = useState<number>(0);

  const [index, setIndex] = useState<number>(0);

  const toast = useRef<any>(null);

  const renderListItem = (data: ProductModel) => {
    return (
      <div className="col-12">
        <div className="product-list-item">
          <img src={data.image} alt={data.name}/>
          <div className="product-list-detail">
            <a href={`/produs/${data.productId}`} className="product-name">{data.name}</a>
            {/*<Rating value={data.rating} readOnly cancel={false}></Rating>*/}
            <div>
              <i className="pi pi-tag product-category-icon"></i>
              <span className="product-category">{data.category}</span>
            </div>
          </div>
          <div className="product-list-action">
            <span className="product-price">{data.price} RON/{data.unit}</span>
            <Button
              icon="pi pi-shopping-cart"
              label="Adaugă în coș"
              disabled={!data.availability}
              onClick={() => addProductInBag(data)}
            />
          </div>
        </div>
      </div>
    );
  }

  const itemTemplate = (product: ProductModel, layout: string) => {
    if (!product) {
      return;
    }
    if (layout === 'list')
      return renderListItem(product);
  }

  const onSortChange = (e: { value: any; }) => {
    const value = e.value;

    if (value === "category") {
      setSortOrder(1);
      setSortField(value);
    }
    if (value === "price") {
      setSortOrder(1);
      setSortField(value);
    }
    if (value === "!price") {
      setSortOrder(-1);
      setSortField("price");
    }
    if (value === "rating") {
      setSortOrder(-1);
      setSortField(value);
    }
    if (value === "az") {
      setSortOrder(1);
      setSortField("name");
    }
    if (value === "za") {
      setSortOrder(-1);
      setSortField("name");
    }
    setSortKey(value);
  }

  const renderHeader = () => {
    return (
      <div className="grid grid-nogutter">
        <div className="col-6" style={{textAlign: 'left'}}>
          <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Sortează"
                    onChange={onSortChange}/>
        </div>
      </div>
    );
  }

  const onCategoryChange = (e: any) => {
    const selectedCategories: Array<string> = [...categories];

    if (e.checked)
      selectedCategories.push(e.value);
    else
      selectedCategories.splice(selectedCategories.indexOf(e.value), 1);

    setCategories(selectedCategories);
  }

  const onFilterChange = (e: any) => {
    e.preventDefault();
    const funcFilteredProducts: Array<ProductModel> = [];
    products.forEach(product => funcFilteredProducts.push(product));

    for (let i = 0; i < funcFilteredProducts.length; i++) {
      if (stockFilter && !funcFilteredProducts[i].availability) {
        funcFilteredProducts.splice(funcFilteredProducts.indexOf(funcFilteredProducts[i]), 1);
        i--;
      }
    }
    for (let i = 0; i < funcFilteredProducts.length; i++) {
      if (!categories.includes(funcFilteredProducts[i].category!)) {
        funcFilteredProducts.splice(funcFilteredProducts.indexOf(funcFilteredProducts[i]), 1);
        i--;
      }
    }
    for (let i = 0; i < funcFilteredProducts.length; i++) {
      if (funcFilteredProducts[i].price > priceRange[1] || funcFilteredProducts[i].price < priceRange[0]) {
        funcFilteredProducts.splice(funcFilteredProducts.indexOf(funcFilteredProducts[i]), 1);
        i--;
      }
    }
    for (let i = 0; i < funcFilteredProducts.length; i++) {
      if (!filteredUnits.includes(`pe ${funcFilteredProducts[i].unit}`) && !filteredUnits.includes(`la ${funcFilteredProducts[i].unit}`)) {
        funcFilteredProducts.splice(funcFilteredProducts.indexOf(funcFilteredProducts[i]), 1);
        i--;
      }
    }

    setFilteredProducts(funcFilteredProducts)
  }

  const resetFields = () => {
    setStockFilter(false);
    setCategories(categs);
    setPriceRange([0, maxRange]);
    setFilteredUnits(units);
  }

  useEffect(() => {
    const prodColRef = query(collection(database, '/products'))
    const prodAddedRef = query(collection(database, '/productsInBag'))
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
        setFilteredProducts(allProducts)
        let max = 0;
        allProducts.forEach(product => {
          if (product.price > max)
            max = product.price;
        })
        maxPrice = max;
        setPriceRange([0, maxPrice])
        setMaxRange(max)
      })
    })
    onSnapshot(prodAddedRef, (snapshot) => {
      snapshot.docs.map(doc => {
        setIndex(Object.keys(doc.data()).length + 1);
      })
    })
  }, [])

  const addProductInBag = async (product: ProductModel) => {
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

  // const addProduct = async () => {
  //   await setDoc(doc(database, "/products", "RTdb48UXfANLLmg67u3H"), {
  //     p10: {
  //       availability: true,
  //       category: "Biscuiți, fursecuri, macarons",
  //       description: "Macarons uriași",
  //       id: 10,
  //       image: "",
  //       name: "Macarons uriași",
  //       price: 15,
  //       quantity: "80g",
  //       unit: "bucata"
  //     }
  //   }, { merge: true }).then();
  // }
  //
  // addProduct();

  return <div className="products-container">
    <Toast ref={toast} />
    <form className="filters">
      <Button type="reset" onClick={resetFields}>Resetează filtrele</Button>
      <div className="field-checkbox" id="reset-button">
        <Checkbox
          inputId="stoc"
          name="stock"
          value="În stoc"
          onChange={e => setStockFilter(e.checked)}
          checked={stockFilter}
        />
        <label htmlFor="stoc"> În stoc</label>
      </div>
      <div className="checkbox-group">
        <label>Filtrează după categorie:</label>
        <div className="field-checkbox">
          <Checkbox
            inputId="bfm"
            name="category"
            value="Biscuiți, fursecuri, macarons"
            onChange={onCategoryChange}
            checked={categories.indexOf('Biscuiți, fursecuri, macarons') !== -1}
          />
          <label htmlFor="bfm"> Biscuiți, fursecuri, macarons</label>
        </div>
        <div className="field-checkbox">
          <Checkbox
            inputId="mbpe"
            name="category"
            value="Brioșe, mini prăjituri, eclere"
            onChange={onCategoryChange}
            checked={categories.indexOf('Brioșe, mini prăjituri, eclere') !== -1}
          />
          <label htmlFor="mbpe"> Brioșe, mini prăjituri, eclere</label>
        </div>
        <div className="field-checkbox">
          <Checkbox
            inputId="ttp"
            name="category"
            value="Torturi, tarte, prăjituri"
            onChange={onCategoryChange}
            checked={categories.indexOf('Torturi, tarte, prăjituri') !== -1}
          />
          <label htmlFor="ttp"> Torturi, tarte, prăjituri</label>
        </div>
      </div>
      <label htmlFor={"price"}>{priceRange[0]} - {priceRange[1]}</label>
      <Slider
        itemID={"price"}
        value={priceRange as SliderValueType}
        onChange={e => setPriceRange(e.value as Array<number>)}
        range
        step={1}
        max={maxRange}
        name={"price"}
      />
      <MultiSelect
        display="chip"
        name={"unit"}
        value={filteredUnits}
        options={units}
        id="units"
        onChange={e => setFilteredUnits(e.value)}
      />
      <Button type="submit" id="submit-button" onClick={onFilterChange}>Filtrează</Button>
    </form>

    <DataView
      value={filteredProducts}
      layout="list"
      itemTemplate={itemTemplate}
      paginator
      rows={5}
      header={renderHeader()}
      sortOrder={sortOrder}
      sortField={sortField}
    />
  </div>
}
