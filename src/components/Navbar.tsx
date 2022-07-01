import {Menubar} from "primereact/menubar";
import "../styles/Navbar.css"
import {database} from "../Firebase";
import {useEffect, useRef, useState} from "react";
import {collection, onSnapshot, query} from "firebase/firestore"
import {AutoComplete} from "primereact/autocomplete";
import {ProductModel} from "../pages/Products";
import {useNavigate} from 'react-router-dom';
import {Avatar} from "primereact/avatar";
import {sortByProdId} from "../pages/ShoppingBag";

type NavbarItemModel = {
  id: number;
  label?: string;
  url?: string;
  icon?: string;
  items?: Array<NavbarItemModel>;
}

export const sortById = (a: NavbarItemModel, b: NavbarItemModel) => {
  if (a.id < b.id)
    return -1;
  if (a.id > b.id)
    return 1;
  return 0;
}

export const Navbar = () => {
  const [navbarItem, setNavbarItem] = useState<Array<NavbarItemModel>>([]);
  const navbarItems: Array<NavbarItemModel> = [];

  const [products, setProducts] = useState<Array<ProductModel>>([]);
  const allProducts: Array<ProductModel> = [];

  const [selectedValue, setSelectedValue] = useState<ProductModel>();
  const [filteredOptions, setFilteredOptions] = useState(products)

  const navigate = useNavigate();

  const search = (event: any) => {
    let query = event.query;
    const filteredValues = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
    setFilteredOptions(filteredValues)
  }

  const navigateFn = (event: any) => {
    const path = `/produs/${event.value.productId}`
    navigate(path)
    window.location.reload();
  }

  useEffect(() => {
    const navColRef = query(collection(database, '/navbar'))
    const prodColRef = query(collection(database, '/products'))

    onSnapshot(navColRef, (snapshot) => {
      snapshot.docs.map(doc => {
        Object.keys(doc.data()).map(fieldPath => {
          const arrayItems: Array<NavbarItemModel> = [];
          if (doc.get(fieldPath).items) {
            Object.keys(doc.get(fieldPath).items).forEach(item => {
              arrayItems.push(doc.get(fieldPath).items[item]);
            })
          }
          arrayItems.sort(sortById);
          navbarItems.push({
            id: doc.get(fieldPath).id,
            label: doc.get(fieldPath).label ? doc.get(fieldPath).label : undefined,
            icon: doc.get(fieldPath).icon ? doc.get(fieldPath).icon : undefined,
            url: doc.get(fieldPath).url ? doc.get(fieldPath).url : undefined,
            items: doc.get(fieldPath).items ? arrayItems : undefined
          })
        })
        navbarItems.sort(sortById);
        setNavbarItem(navbarItems)
      })
    })

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
            image: doc.get(fieldPath).image ? doc.get(fieldPath).image : undefined,
            quantity: doc.get(fieldPath).quantity ? doc.get(fieldPath).quantity : undefined,
            rating: doc.get(fieldPath).rating
          })
        })
        allProducts.sort(sortByProdId);
        setProducts(allProducts)
      })
    })
  }, [])

  const end = <>
    <AutoComplete
      value={selectedValue}
      suggestions={filteredOptions}
      completeMethod={search}
      field="name"
      placeholder="Caută produsul"
      type="text"
      dropdown
      onChange={(e) => setSelectedValue(e.value)}
      onSelect={navigateFn}
    />
    <Avatar
      icon="pi pi-user"
      size={"large"}
      onClick={(event) => {
        navigate("/contul-meu");
        window.location.reload();
      }}
      aria-controls="popup_menu"
      aria-haspopup
    />
    <Avatar
      icon="pi pi-shopping-bag"
      size={"large"}
      onClick={() => {
        navigate("/cosul-meu");
        window.location.reload();
      }}
      aria-controls="popup_menu"
      aria-haspopup
    />
  </>;

  return <>
    <Menubar model={navbarItem} end={end}/>
  </>
}
