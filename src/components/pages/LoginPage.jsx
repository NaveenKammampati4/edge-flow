
import axios from "axios";
import { useState } from "react";
import Login from "../Login";

export default function LoginPage() {
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  const handleLogin = async (data) => {
    try {
      await axios.post("http://127.0.0.1:5000/user_login", data);
      setSuccess("Login successful");
      setError("");
    } catch {
      setError("Invalid username or password");
    }
  };

  return <Login onSubmit={handleLogin} error={error} success={success}/>;
}