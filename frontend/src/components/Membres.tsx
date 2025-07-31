import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Search, ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Membre {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  promotion: string;
  role: string;
  statut: "Actif" | "Inactif";
  dateInscription: string;
}
interface MembresProps {
  currentUser: {
    role: string;
  } | null;
}



const roles = [
  "Membre simple",
  "Trésorier",
  "Secrétaire",
  "Responsable communication",
  "Président",
  "Vice Président"
];
const disabledRoles = ["Membre simple", "Trésorier", "Responsable communication", "Secrétaire"];



const roleColors: { [key: string]: string } = {
  "Membre simple": "bg-green-100 text-green-800",
  "Trésorier": "bg-yellow-100 text-yellow-800",
  "Secrétaire": "bg-green-100 text-green-800",
  "Responsable communication": "bg-blue-100 text-blue-800",
  "Président": "bg-red-100 text-red-800",
  "Vice Président": "bg-violet-100 text-violet-800"
};

const Membres = ({ currentUser }: MembresProps) => {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const isRestricted = currentUser ? disabledRoles.includes(currentUser.role) : true;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newMember, setNewMember] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    promotion: "",
    role: "Membre simple"
  });
  const { toast } = useToast();
  const itemsPerPage = 6;

  const fetchMembres = async () => {
    try {
      const response = await axios.get("http://localhost:3000/membres");
      setMembres(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des membres", error);
    }
  };

  useEffect(() => {
    fetchMembres();
  }, []);

  const filteredMembres = membres.filter(membre =>
    membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMembres = [...filteredMembres].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.nom.localeCompare(b.nom);
    }
    return b.nom.localeCompare(a.nom);
  });

  const totalPages = Math.ceil(sortedMembres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembres = sortedMembres.slice(startIndex, startIndex + itemsPerPage);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleDeleteMember = async (membreId: number, nom: string) => {
    try {
      await axios.delete(`http://localhost:3000/membres/${membreId}`);
      setMembres(prev => prev.filter(membre => membre.id !== membreId));
      toast({
        title: "Membre supprimé",
        description: `${nom} a été supprimé de la liste des membres.`,
        className: "bg-red-50 border-red-200 text-red-800"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  
  const handleAddMember = async () => {
    try {
      if (editMode && editingId !== null) {
        const response = await axios.put(`http://localhost:3000/membres/${editingId}`, newMember);
        await fetchMembres();
        toast({
          title: "Membre mis à jour",
          description: `${newMember.prenom} ${newMember.nom} a été modifié avec succès.`,
          className: "bg-blue-50 border-blue-200 text-blue-800"
        });
      } else {
        const membreToAdd = {
          ...newMember,
          statut: "Actif" as const,
          dateInscription: new Date().toISOString()
        };
        const response = await axios.post("http://localhost:3000/membres", membreToAdd);
        const addedMembre: Membre = response.data;
        setMembres(prev => [...prev, addedMembre]);
        toast({
          title: "Membre ajouté",
          description: `${newMember.prenom} ${newMember.nom} a été ajouté avec succès.`,
          className: "bg-green-50 border-green-200 text-green-800"
        });
      }
      setShowAddDialog(false);
      setNewMember({ nom: "", prenom: "", email: "", telephone: "", promotion: "", role: "Membre simple" });
      setEditMode(false);
      setEditingId(null);
    } catch (error: any) {
      console.error("Erreur lors de l’ajout/modification du membre", error);
      toast({
        title: "Erreur",
        description: error?.response?.data?.message || "Échec de l'opération.",
        className: "bg-red-50 border-red-200 text-red-800"
      });
    }
  };

  const handleEditClick = (membre: Membre) => {
    setNewMember({
      nom: membre.nom,
      prenom: membre.prenom,
      email: membre.email,
      telephone: membre.telephone,
      promotion: membre.promotion,
      role: membre.role
    });
    setEditingId(membre.id);
    setEditMode(true);
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Gestion des membres
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gérez les membres de l'association S.O.E.RE.M.F
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto text-sm" disabled={isRestricted}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter un membre</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau membre</DialogTitle>
              <DialogDescription>
                Remplissez les informations du nouveau membre
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select value={newMember.role} onValueChange={(value) => setNewMember({...newMember, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddMember} className="w-full">
                Enregistrer le membre
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                Liste des membres
                <Badge variant="secondary">{membres.length}</Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                Gérez les membres de l'association
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">
                    <Button 
                      variant="ghost" 
                      onClick={toggleSort}
                      className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                    >
                      Nom
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Prénom</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Téléphone</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Promotion</TableHead>
                  <TableHead className="text-xs sm:text-sm">Rôle</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Date d'inscription</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMembres.map((membre) => (
                  <TableRow key={membre.id}>
                    <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4">
                      <div>{membre.nom}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">
                        {membre.prenom}
                      </div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {membre.email}
                      </div>
                      <div className="text-xs text-muted-foreground sm:hidden">
                        {membre.promotion}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell p-2 sm:p-4">
                      {membre.prenom}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden md:table-cell p-2 sm:p-4">
                      {membre.email}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell p-2 sm:p-4">
                      {membre.telephone}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell p-2 sm:p-4">
                      {membre.promotion}
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 text-xs sm:text-sm">
                    <Badge className={roleColors[membre.role] || "bg-gray-100 text-gray-800"}>
                      {membre.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm hidden lg:table-cell p-2 sm:p-4">
                    {membre.dateInscription ? new Date(membre.dateInscription).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </TableCell>
                    <TableCell className="p-2 sm:p-4">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditClick(membre)}
                          disabled={isRestricted}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteMember(membre.id, `${membre.prenom} ${membre.nom}`)}
                        className="h-8 w-8 p-0"
                          disabled={isRestricted}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Membres;