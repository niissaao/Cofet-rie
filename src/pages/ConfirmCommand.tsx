import {Card} from "primereact/card";
import "../styles/ConfirmCommand.css"
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";

export const ConfirmCommand = () => {
  const navigate = useNavigate();

  return (
    <Card className="confirm-card">
      <h1>Comanda dumneavoastră a fost înregistrată!</h1>
      <h3>Vă mulțumim și vă mai așteptăm!</h3>
      <Button
        label="Înapoi la pagina de start."
        onClick={() => navigate("/")}
      />
    </Card>
  )
}
