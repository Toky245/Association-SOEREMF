import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

interface Annonce {
  id: number;
  titre: string;
  contenu: string;
  importance: "Faible" | "Moyenne" | "Élevée";
  dateCreation: string;
  auteur: string;
}

const Annonces = () => {
  const [annonces] = useState<Annonce[]>([
    {
      id: 1,
      titre: "Assemblée générale annuelle",
      contenu: "L'assemblée générale annuelle de l'association S.O.E.RE.M.F aura lieu le 15 mars 2024 à 14h00 en salle de conférence. Tous les membres sont invités à participer.",
      importance: "Élevée",
      dateCreation: "2024-02-20",
      auteur: "Président"
    },
    {
      id: 2,
      titre: "Festival culturel Melaky",
      contenu: "Nous organisons un festival culturel pour promouvoir la culture de la région Melaky. Inscriptions ouvertes pour les performances artistiques.",
      importance: "Moyenne",
      dateCreation: "2024-02-18",
      auteur: "Vice-président"
    },
    {
      id: 3,
      titre: "Collecte de fonds pour les nouveaux étudiants",
      contenu: "Une collecte de fonds est organisée pour aider les nouveaux étudiants de la région Melaky. Chaque contribution compte.",
      importance: "Moyenne",
      dateCreation: "2024-02-15",
      auteur: "Trésorier"
    }
  ]);

  const [newAnnonce, setNewAnnonce] = useState({
    titre: "",
    contenu: "",
    importance: ""
  });

  const handleAddAnnonce = () => {
    // Simulation d'ajout - UI seulement
    console.log("Nouvelle annonce:", newAnnonce);
    setNewAnnonce({ titre: "", contenu: "", importance: "" });
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case "Élevée":
        return <AlertTriangle className="h-4 w-4" />;
      case "Moyenne":
        return <Info className="h-4 w-4" />;
      case "Faible":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getImportanceBadgeVariant = (importance: string) => {
    switch (importance) {
      case "Élevée":
        return "destructive";
      case "Moyenne":
        return "default";
      case "Faible":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">
          Gestion des annonces
        </h2>
        <p className="text-muted-foreground">
          Créez et consultez les annonces de l'association
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer une nouvelle annonce</CardTitle>
          <CardDescription>
            Rédigez une annonce pour informer les membres de l'association
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="titre-annonce">Titre de l'annonce</Label>
            <Input
              id="titre-annonce"
              value={newAnnonce.titre}
              onChange={(e) => setNewAnnonce({...newAnnonce, titre: e.target.value})}
              placeholder="Titre de votre annonce"
            />
          </div>
          <div>
            <Label htmlFor="contenu-annonce">Contenu de l'annonce</Label>
            <Textarea
              id="contenu-annonce"
              value={newAnnonce.contenu}
              onChange={(e) => setNewAnnonce({...newAnnonce, contenu: e.target.value})}
              placeholder="Rédigez le contenu de votre annonce..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="importance-annonce">Niveau d'importance</Label>
            <Select 
              value={newAnnonce.importance} 
              onValueChange={(value) => setNewAnnonce({...newAnnonce, importance: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le niveau d'importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Faible">Faible</SelectItem>
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Élevée">Élevée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddAnnonce} className="w-full">
            Publier l'annonce
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">
          Annonces publiées ({annonces.length})
        </h3>
        <div className="space-y-4">
          {annonces.map((annonce) => (
            <Card key={annonce.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{annonce.titre}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Par {annonce.auteur}</span>
                      <span>•</span>
                      <span>{new Date(annonce.dateCreation).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={getImportanceBadgeVariant(annonce.importance)}
                    className="flex items-center gap-1"
                  >
                    {getImportanceIcon(annonce.importance)}
                    {annonce.importance}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {annonce.contenu}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Annonces;