import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

import api from "@/lib/api";

const logoSoeremf = "/lovable-uploads/c5d6aba5-7e98-4c61-9fda-fa60cc9c18ad.png";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupData, setSignupData] = useState({
    nom: "",
    email: "",
    promotion: "",
    password: "",
    confirmPassword: "",
    role: "Membre simple",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const res = await axios.post("https://association-soeremf.onrender.com/auth/login", {

        email,
        password,
      },{ withCredentials: true
        
      });

      const { user } = res.data;

      if (!user.valide) {
        toast({
          title: "Compte en attente",
          description: "Votre compte doit être validé avant de pouvoir vous connecter.",
          className: "bg-yellow-50 border-yellow-200 text-yellow-800",
        });
        return;
      }

      toast({
        title: "Connexion réussie!",
        description: "Bienvenue dans votre espace S.O.E.RE.M.F.",
        className: "bg-green-50 border-green-200 text-green-800",
      });

      onLogin();

    } catch (err: any) {
      toast({
        title: "Erreur de connexion",
        description: err.response?.data?.error || "Email ou mot de passe incorrect",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        className: "bg-red-50 border-red-200 text-red-800",
      });
      return;
    }

    try {

      await axios.post("https://association-soeremf.onrender.com/auth/register", signupData);


      toast({
        title: "Demande envoyée!",
        description: "Votre demande d'inscription a été envoyée pour validation.",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });

      setSignupData({
        nom: "",
        email: "",
        promotion: "",
        password: "",
        confirmPassword: "",
        role: "Membre simple",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.response?.data?.error || "Une erreur est survenue.",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src={logoSoeremf} alt="Logo S.O.E.RE.M.F" className="h-24 w-24 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            S.O.E.RE.M.F
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Solidarité des Étudiants de la Région Melaky à Fianarantsoa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            {/* CONNEXION */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@soeremf.mg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Se connecter
                </Button>
              </form>
            </TabsContent>

            {/* INSCRIPTION */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-nom">Nom complet</Label>
                  <Input
                    id="signup-nom"
                    type="text"
                    placeholder="Votre nom complet"
                    value={signupData.nom}
                    onChange={(e) => setSignupData({ ...signupData, nom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-promotion">Promotion</Label>
                  <Input
                    id="signup-promotion"
                    type="text"
                    placeholder="2024"
                    value={signupData.promotion}
                    onChange={(e) => setSignupData({ ...signupData, promotion: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirmation mot de passe</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  S'inscrire
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
