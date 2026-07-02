import { Navigate, useLocation, Outlet } from "react-router-dom";

import { useAuthStore } from "store/authStore";

export default function ProtectedRoute() {
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const isLoggedIn = Boolean(user && accessToken);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
