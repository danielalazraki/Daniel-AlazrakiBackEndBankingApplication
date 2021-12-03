import { Card } from "./createaccount";
import { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import superagent from "superagent";
import { UserContext } from "../App";
import { getBalance } from "../api/firebase-client-helper";

export function Withdraw() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const user = useContext(UserContext);
  return (
    <Card
      bgcolor="success"
      header="Withdraw"
      status={status}
      body={
        show ? (
          <WithdrawForm setShow={setShow} setStatus={setStatus} user={user} />
        ) : (
          <WithdrawMsg setShow={setShow} setStatus={setStatus} user={user} />
        )
      }
    />
  );
}

function WithdrawMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <button
        type="submit"
        className="btn btn-light"
        onClick={() => {
          props.setShow(true);
          props.setStatus("");
        }}
      >
        Withdraw again
      </button>
    </>
  );
}

function WithdrawForm(props) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  function handle() {
    console.log("hello");
    console.log(props.user.uid);
    try {
      superagent
        .post(
          `${config.serverRoot}/withdraw/${props.user.uid}/${Number(amount)}`
        )
        .then(async (res) => {
          let bal = await getBalance(props.user.uid);
          console.log('bal', bal);
          return bal;
        })
        .then((bal) => {
          props.setShow(false);
          props.setStatus(`Your updated balance is ${bal}`);
          console.log("user: ", props.user);
        });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      Email
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <br />
      Amount
      <br />
      <input
        type="number"
        className="form-control"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.currentTarget.value)}
      />
      <br />
      <button
        type="submit"
        className="btn btn-light"
        onClick={(e) => {
          e.preventDefault();
          handle();
        }}
      >
        Withdraw
      </button>
    </>
  );
}
export const config = {
  serverRoot: "http://localhost:8080",
};
