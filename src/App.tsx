import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute, PublicRouter } from "./components/layout";
import { AuthProvider } from "./context/auth";
import { AuthUserProvider } from "./context/authUser";
import { ToastProvider } from "./context/toast";
import Login from "./pages/login";

function App() {
  return (
    <ToastProvider>
      <AuthUserProvider>
        <AuthProvider>
          <BrowserRouter>
            <AnimatePresence mode='wait'>
              <Routes>
                <Route element={<PrivateRoute />} path="*" />
                <Route element={<PublicRouter />}>
                  <Route element={<Login />} path="/login" />
                </Route>
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </AuthProvider>
      </AuthUserProvider>
    </ToastProvider>
  )
}

export default App
