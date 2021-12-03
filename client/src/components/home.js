import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Bank from "./bank.png";
import { Card } from "./createaccount";

export function Home() {
  const history = useHistory();

  return (
    <>
      <Card
        txtcolor="black"
        header="BadBank Landing Module"
        title="Welcome to the bank"
        text="You can move around using the navigation bar."
        body={<img src={Bank} className="img-fluid" alt="Responsive" />}
      />
      <button
        onClick={(e) => {
            e.preventDefault();
          history.replace("/login");
        }}
      >Login</button>
    </>
  );
}
