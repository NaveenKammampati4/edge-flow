
import axios from "axios";
import { useState } from "react";
import Register from "../Register";

export default function RegisterPage() {
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  const handleRegister = async (data) => {
    try {
      await axios.post("http://127.0.0.1:5000/register", data);
      setSuccess("Account created successfully");
      setError("");
    } catch {
      setError("Registration failed");
    }
  };

  return <Register onSubmit={handleRegister} error={error} success={success}/>;
}