import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "components/Navbar/Navbar";
import ProtectedRoute from "components/Shared/ProtectedRoute";
import Toaster from "components/ui/Toaster";

import Dashboard from "pages/Dashboard";
import Home from "pages/Home";
import Login from "pages/Login";
import NotFound from "pages/NotFound";
import Posts from "pages/Posts";
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
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
