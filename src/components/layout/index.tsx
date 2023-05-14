import { useAuth } from "@/context/auth";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Fragment, lazy, Suspense } from "react";
import { Navigate, Outlet, useLocation, useRoutes } from "react-router-dom";
import Header from "./header";
const HomePage = lazy(() => import("@/pages/home"));
const HistoryPage = lazy(() => import("@/pages/history"));

export const PrivateRoute = () => {
  const location = useLocation();
   const routes = [
     { path: "/", element: <HomePage /> },
     { path: "/history", element: <HistoryPage /> },
  ];
  const element = useRoutes(routes);
  let { user, loading } = useAuth();
  const Loader = () => {
    return <div className="w-screen h-screen flex items-center justify-center">Loading...</div>
  }
  
  return (
    user ? (
      <Fragment>
        <div className="flex w-full h-full flex-col">
          <Header />
          <Suspense fallback={<Loader />}>
            <AnimatePresence mode="wait" initial={false}>
              <div className="w-full bg-[#F7F7F7]">
                <motion.div
                  className="md:px-[32px] md:py-[40px] relative z-0 w-full mx-auto md:overflow-auto min-h-[calc(100vh-64px)] bg-blue-50"
                  key={location.pathname}
                >
                  {React.cloneElement(element as any, { key: location.pathname })}
                </motion.div>
              </div>
            </AnimatePresence>
          </Suspense>

        </div>
      </Fragment >
    ) : (
      <Navigate to="/login" />
    )
  )
};

export const PublicRouter = () => {
  let auth = useAuth();
  return !auth.user ? <Outlet /> : <Navigate to="/" />;
};
