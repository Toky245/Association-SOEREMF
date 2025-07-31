import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Membres from "./components/Membres";
import Tresorerie from "./components/Tresorerie";
import Annonces from "./components/Annonces";
import Reglement from "./components/Reglement";
import Compte from "./components/Compte";
import NotFound from "./pages/NotFound";
import UserProfile, { User } from "./components/UserProfile";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import axios from "axios";


const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get("https://association-soeremf.onrender.com/auth/me", {
        withCredentials: true,
      });

      const userData = res.data.user;

      const fullName = userData.nom || userData.name || "Inconnu";

      setCurrentUser({
        name: fullName,
        email: userData.email || "",
        role: userData.role || "",
        promotion: userData.promotion || "",
        telephone: userData.telephone || "",
        dateInscription: userData.dateInscription || "",
      });

      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = () => {
    fetchUser();
  };

  const handleLogout = async () => {
    try {
      await axios.get("https://association-soeremf.onrender.com/auth/logout", {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Erreur lors de la déconnexion", err);
    } finally {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <>
            <BrowserRouter>
              <Layout onLogout={handleLogout} currentUser={currentUser!}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/membres" element={<Membres currentUser={currentUser} />} />
                  <Route path="/tresorerie" element={<Tresorerie currentUser={currentUser}/>} />
                  <Route path="/annonces" element={<Annonces currentUser={currentUser} />} />
                  <Route path="/reglement" element={<Reglement />} />
                  <Route path="/compte" element={<Compte />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>

              
            </BrowserRouter>
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
