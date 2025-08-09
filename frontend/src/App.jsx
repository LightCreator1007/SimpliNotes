import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
