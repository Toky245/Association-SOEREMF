import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

interface Membre {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  promotion: string;
  statut: "Actif" | "Inactif";
  dateInscription: string;
}

const Membres = () => {
  const [membres] = useState<Membre[]>([
    {
      id: 1,
      nom: "Rakoto",
      prenom: "Jean",
      email: "jean.rakoto@email.com",
      telephone: "034 12 345 67",
      promotion: "L3 Informatique",
      statut: "Actif",
      dateInscription: "2024-01-15"
    },
    {
      id: 2,
      nom: "Rasoa",
      prenom: "Marie",
      email: "marie.rasoa@email.com",
      telephone: "033 98 765 43",
      promotion: "M1 Gestion",
      statut: "Actif",
      dateInscription: "2024-02-20"
    },
    {
      id: 3,
      nom: "Randria",
      prenom: "Paul",
      email: "paul.randria@email.com",
      telephone: "032 11 223 44",
      promotion: "L2 Droit",
      statut: "Inactif",
      dateInscription: "2023-09-10"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    promotion: ""
  });

  const filteredMembres = membres.filter(membre =>
    membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    // Simulation d'ajout - UI seulement
    console.log("Nouveau membre à ajouter:", newMember);
    setShowAddDialog(false);
    setNewMember({ nom: "", prenom: "", email: "", telephone: "", promotion: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">
            Gestion des membres
          </h2>
          <p className="text-muted-foreground">
            Gérez les membres de l'association S.O.E.RE.M.F
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un membre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau membre</DialogTitle>
              <DialogDescription>
                Remplissez les informations du nouveau membre
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={newMember.nom}
                    onChange={(e) => setNewMember({...newMember, nom: e.target.value})}
                    placeholder="Nom de famille"
                  />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={newMember.prenom}
                    onChange={(e) => setNewMember({...newMember, prenom: e.target.value})}
                    placeholder="Prénom"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="adresse@email.com"
                />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={newMember.telephone}
                  onChange={(e) => setNewMember({...newMember, telephone: e.target.value})}
                  placeholder="034 12 345 67"
                />
              </div>
              <div>
                <Label htmlFor="promotion">Promotion</Label>
                <Input
                  id="promotion"
                  value={newMember.promotion}
                  onChange={(e) => setNewMember({...newMember, promotion: e.target.value})}
                  placeholder="L3 Informatique"
                />
              </div>
              <Button onClick={handleAddMember} className="w-full">
                Enregistrer le membre
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des membres</CardTitle>
          <CardDescription>
            {membres.length} membres au total
          </CardDescription>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Promotion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembres.map((membre) => (
                <TableRow key={membre.id}>
                  <TableCell className="font-medium">
                    {membre.prenom} {membre.nom}
                  </TableCell>
                  <TableCell>{membre.email}</TableCell>
                  <TableCell>{membre.telephone}</TableCell>
                  <TableCell>{membre.promotion}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={membre.statut === "Actif" ? "default" : "secondary"}
                      className={membre.statut === "Actif" ? "bg-success" : ""}
                    >
                      {membre.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(membre.dateInscription).toLocaleDateString('fr-FR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Membres;