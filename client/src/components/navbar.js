import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router";
import { useHistory, Link } from "react-router-dom";
import "../index.css";
import { useState } from "react";
import { auth, logout, get } from "../api/firebase-client-helper";

export function NavBar() {
  let location = useLocation();
  console.log(location);
  console.log(location.pathname);
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  auth.onAuthStateChanged((user) => {
    if (user) {
      setIsLoggedIn(true);
      setUsername(user.email);
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  });

  console.log("logged in?", isLoggedIn);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        BadBank
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/CreateAccount">
                  Create Account
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/deposit">
                  Deposit
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/withdraw">
                  Withdraw
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={logout} id="logout">
                  Log Out
                </Link>
              </li>
              <li className="nav-item">
                <p className="nav-link">{username}</p>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
