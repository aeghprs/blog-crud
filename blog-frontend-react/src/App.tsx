import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "components/Navbar/Navbar";
import Toaster from "components/ui/Toaster";

import Login from "pages/Login";
import Register from "pages/Register";

import { useThemeStore } from "store/themeStore";

export default function App() {
  const applyTheme = useThemeStore((s) => s.apply);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Toaster />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </div>
  );
}
