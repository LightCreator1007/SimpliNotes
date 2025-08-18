import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";
import Signup from "./pages/Signup.jsx";
import useTheme from "./utils/useTheme.jsx";
import { useAppStore } from "./store.js";
// import { useEffect } from "react";
// import apiFetch from "./utils/apiClient.js";

function ProtectedRoute({ children }) {
  const { user } = useAppStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  useTheme();

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     await apiFetch("/user/renew", { method: "POST" });
  //   }, 14 * 60 * 1000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
