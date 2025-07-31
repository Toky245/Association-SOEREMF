import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Annonce {
  id: number;
  titre: string;
  contenus: string;
  niveau_importance: "Faible" | "Moyenne" | "Élevée";
  debut: string;
  fin: string;
  dateCreation: string;
  auteur?: string;
}
interface AnnoncesProps {
  currentUser: {
    role: string;
  } | null;
}


const Annonces = ({ currentUser }: AnnoncesProps) => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const isRestricted = currentUser?.role !== "Responsable communication";
  const [newAnnonce, setNewAnnonce] = useState({
    titre: "",
    contenus: "",
    niveau_importance: "",
    debut: "",
    fin: ""
  });

  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://association-soeremf.onrender.com/annonces/list");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const annoncesValides: Annonce[] = [];
      for (const annonce of response.data) {
        const finDate = new Date(annonce.fin);
        finDate.setHours(0, 0, 0, 0);

        if (finDate >= today) {
          annoncesValides.push(annonce);
        } else {
          // Supprimer du backend si expirée
          await axios.delete(`https://association-soeremf.onrender.com/annonces/${annonce.id}`);
        }
      }

      setAnnonces(annoncesValides);
    } catch (error) {
      console.error("Erreur lors du chargement des annonces", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const handleAddAnnonce = async () => {
    if (
      !newAnnonce.titre ||
      !newAnnonce.contenus ||
      !newAnnonce.niveau_importance ||
      !newAnnonce.debut ||
      !newAnnonce.fin
    ) {
      alert("Merci de remplir tous les champs");
      return;
    }

    if (new Date(newAnnonce.debut) > new Date(newAnnonce.fin)) {
      alert("La date de début doit être avant ou égale à la date de fin");
      return;
    }

    try {
      await axios.post("https://association-soeremf.onrender.com/annonces/create", newAnnonce);
      await fetchAnnonces();
      setNewAnnonce({
        titre: "",
        contenus: "",
        niveau_importance: "",
        debut: "",
        fin: ""
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce", error);
    }
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

  // Skeleton loader pour les annonces
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        <div>
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-l-4 border-l-primary">
                <CardHeader>
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Gestion des annonces</h2>
        <p className="text-muted-foreground">Créez et consultez les annonces de l'association</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer une nouvelle annonce</CardTitle>
          <CardDescription>Rédigez une annonce pour informer les membres de l'association</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="titre-annonce">Titre de l'annonce</Label>
            <Input
              id="titre-annonce"
              value={newAnnonce.titre}
              onChange={(e) => setNewAnnonce({ ...newAnnonce, titre: e.target.value })}
              placeholder="Titre de votre annonce"
            />
          </div>
          <div>
            <Label htmlFor="contenu-annonce">Contenu de l'annonce</Label>
            <Textarea
              id="contenu-annonce"
              value={newAnnonce.contenus}
              onChange={(e) => setNewAnnonce({ ...newAnnonce, contenus: e.target.value })}
              placeholder="Rédigez le contenu de votre annonce..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="importance-annonce">Niveau d'importance</Label>
            <Select
              value={newAnnonce.niveau_importance}
              onValueChange={(value) => setNewAnnonce({ ...newAnnonce, niveau_importance: value })}
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
          <div>
            <Label htmlFor="debut-annonce">Date de début</Label>
            <Input
              id="debut-annonce"
              type="date"
              value={newAnnonce.debut}
              onChange={(e) => setNewAnnonce({ ...newAnnonce, debut: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="fin-annonce">Date de fin</Label>
            <Input
              id="fin-annonce"
              type="date"
              value={newAnnonce.fin}
              onChange={(e) => setNewAnnonce({ ...newAnnonce, fin: e.target.value })}
            />
          </div>
          <Button onClick={handleAddAnnonce} className="w-full" disabled={isRestricted}>
            Publier l'annonce
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">Annonces publiées ({annonces.length})</h3>
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
                      <span>
                        Du {new Date(annonce.debut).toLocaleDateString("fr-FR")} au{" "}
                        {new Date(annonce.fin).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={getImportanceBadgeVariant(annonce.niveau_importance)}
                    className="flex items-center gap-1"
                  >
                    {getImportanceIcon(annonce.niveau_importance)}
                    {annonce.niveau_importance}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{annonce.contenus}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Annonces;
