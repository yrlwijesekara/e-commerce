import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import AdminPage from "./pages/adminPage";
import LoginPage from "./pages/loginPage";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/registerPage";
import Test from "./pages/test";
import ClientPage from "./pages/client/clientpage";
import { GoogleOAuthProvider } from '@react-oauth/google';



function App() {
  return (
    <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/*" element={<ClientPage />} />
      </Routes>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
