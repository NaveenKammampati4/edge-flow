import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserRepos from "./components/UserRepos";
import Main from "./components/Main";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/my", {
      credentials: "include",
    })
      .then((res) => setAllowed(res.ok))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div>Checking authentication...</div>;

  return allowed ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRepos />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
