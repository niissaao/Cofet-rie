import {useEffect, useState} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";
import {database} from "../Firebase";
import timelinePhoto1 from "../resources/img/home-timeline.jpg";
import {sortById} from "../components/Navbar";
import {Card} from "primereact/card";
import {Login} from "./Login";
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
  const about: Array<AboutModel> = [];

  useEffect(() => {
    const homeColRef = query(collection(database, '/home'))
    onSnapshot(homeColRef, (snapshot) => {
      snapshot.docs.map(doc => {
        Object.keys(doc.data()).map(fieldPath => {
          about.push({
            id: doc.get(fieldPath).id,
            title: doc.get(fieldPath).title,
            subTitle: doc.get(fieldPath).subTitle,
            icon: doc.get(fieldPath).icon,
            color: doc.get(fieldPath).color,
            description: doc.get(fieldPath).description,
            image: doc.get(fieldPath).image ? doc.get(fieldPath).image : timelinePhoto1
          })
        })
        about.sort(sortById);
        setAboutDetails(about)
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

  return <>
    <Login/>
    <Timeline value={aboutDetails} align="alternate" content={customizedContent} marker={customizedMarker}
              className="timeline"/>
  </>
}
