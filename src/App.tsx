import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/SignIn";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header"; // Import the Header component

// Define a layout component to manage the header visibility
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const showHeader = location.pathname !== "/login"; // Show header on all pages except login

  return (
    <>
      {showHeader && <Header />}
      <main>{children}</main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
