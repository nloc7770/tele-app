import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { ToastProvider } from "./context/toast";
import Login from "./pages/login";
import { PrivateRoute, PublicRouter } from "./components/layout";

function App() {
  return (
    <ToastProvider>
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
    </ToastProvider>
  )
}

export default App
