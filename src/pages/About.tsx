import {useEffect, useState} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";
import {database} from "../Firebase";
import about from "../resources/img/about.jpg";
import about2 from "../resources/img/about2.jpg";
import about3 from "../resources/img/about3.jpg";
import about4 from "../resources/img/about4.jpg";
import {sortById} from "../components/Navbar";
import {Card} from "primereact/card";
import {Timeline} from "primereact/timeline";
import "../styles/About.css"

type AboutModel = {
  id: number,
  title: string,
  subTitle: string,
  icon: string,
  color: string,
  description: string,
  image: string;
}

export const About = () => {
  const [aboutDetails, setAboutDetails] = useState<Array<AboutModel>>([]);
  const aboutArr: Array<AboutModel> = [];
  const aboutPhotos = [about, about2, about3, about4];

  useEffect(() => {
    const homeColRef = query(collection(database, '/home'))
    onSnapshot(homeColRef, (snapshot) => {
      snapshot.docs.map(doc => {
        let i = 0;
        Object.keys(doc.data()).map(fieldPath => {
          aboutArr.push({
            id: doc.get(fieldPath).id,
            title: doc.get(fieldPath).title,
            subTitle: doc.get(fieldPath).subTitle,
            icon: doc.get(fieldPath).icon,
            color: doc.get(fieldPath).color,
            description: doc.get(fieldPath).description,
            image: doc.get(fieldPath).image ? doc.get(fieldPath).image : aboutPhotos[i%4]
          })
          i++;
        })
        aboutArr.sort(sortById);
        setAboutDetails(aboutArr)
      })
    })
  }, [])

  const customizedContent = (item: AboutModel) => <Card title={item.title} subTitle={item.subTitle}>
    <p>{item.description}</p>
    <img src={item.image} alt="photo"/>
  </Card>

  const customizedMarker = (item: { color: any; icon: string | undefined; }) => {
    return (<span className="custom-marker shadow-1" style={{backgroundColor: item.color}}>
      <i className={item.icon}></i>
    </span>);
  };

  return (
      <Timeline
        value={aboutDetails}
        align="alternate"
        content={customizedContent}
        marker={customizedMarker}
        className="timeline"
      />
    )
}
