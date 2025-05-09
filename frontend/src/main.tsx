import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import PrivateRoute from "./components/PrivateRoute.tsx";
import AdminRoutes from "./components/AdminRoute.tsx";
import store from "./redux/features/store.ts";
import Home from "./Home.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import VerifyEmail from "./pages/auth/VerifyEmail.tsx";




function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/verify-email",
          element: <VerifyEmail />,
        },
        {
          element: <PrivateRoute />,
          children: [
            // Protected routes in a wrapper

            // { path: "/profile", element: <Profile /> },
            // { path: "/shipping", element: <Shipping /> },
            // { path: "/placeorder", element: <PlaceOrder /> },
            // { path: "/order/:id", element: <OrderPageWrapper /> },
            // { path: "/user-orders", element: <UserOrders /> },
          ],
        },

        {
          element: <AdminRoutes />,
          children: [
            // { path: "/userlist", element: <UserList /> },
            // { path: "/categorylist", element: <CategoryList /> },
            // { path: "/productlist", element: <ProductList /> },
            // { path: "/productupdate/:_id", element: <ProductUpdate /> },
            // { path: "/allproducts", element: <AllProducts /> },
            // { path: "/orderlist", element: <OrderList /> },
            // { path: "/admin-dashboard", element: <AdminDashboard /> },
          ],
        },

        {
          path: "/login",
          element: <Login />,
        },

        {
          path: "/Register",
          element: <Register />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </StrictMode>
);
