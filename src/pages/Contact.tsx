import {Card} from "primereact/card";
import "../styles/Contact.css"

export const Contact = () => {
  return <>
    <Card className="contact-card">
      <p><b>Ne puteți găsi la adresa:</b> Strada Prăjiturilor, nr. 11, București</p>
      <p><b>Număr de contact:</b> 0236.001.002</p>
      <p><b>Program ridicare din cofetărie:</b></p>
      <p>Luni - Sâmbătă: 7:00 - 20:00</p>
      <p>Duminică: închis</p>
      <p><b>Program livrare:</b></p>
      <p>Luni - Sâmbătă: 9:00 - 19:00</p>
      <p>Duminică: nu se fac livrări</p>
    </Card>
  </>
}
