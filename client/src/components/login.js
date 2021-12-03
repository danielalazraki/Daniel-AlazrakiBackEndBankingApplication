import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, login, signInWithGoogle } from "../api/firebase-client-helper";
import { useAuthState } from "react-firebase-hooks/auth";
import "./login.css";

//add provider

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) history.replace("/dashboard");
  }, [user, loading]);

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={(e) => {
            login(email, password);
          }}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/#CreateAccount/">Register</Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}
