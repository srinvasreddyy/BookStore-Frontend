import * as React from "react";
import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage, // 👈 Add this line
});

function RootComponent() {
  const { location } = useRouterState();

  // Hide layout for auth routes
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verify-otp" ||
    location.pathname === "/reset-password";

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <>
      {!hideLayout && <NavBar />}
      <Outlet />
      {!hideLayout && <Footer />}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

// 👇 Fallback component for unmatched routes
function NotFoundPage() {
  return (
    <div className="h-[70vh] flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl max-lg:text-2xl font-semibold mb-3">🚧 Page Under Development</h1>
      <p className="text-gray-600 max-lg:text-xs text-sm mb-6">
        The page you’re looking for is still being built. Please check back soon!
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-black text-white rounded-md font-bold text-sm hover:bg-gray-800 transition"
      >
        Go Back Home
      </a>
    </div>
  );
}
