import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface Transaction {
  id: number;
  type: "revenu" | "depense";
  description: string;
  montant: number;
  nom?: string;
  prenom?: string;
  role?: string;
  date: string;
}
interface TresorerieProps {
  currentUser: {
    role: string;
  } | null;
}

const Tresorerie = ({ currentUser }: TresorerieProps) => {
  const [revenus, setRevenus] = useState<Transaction[]>([]);
  const [depenses, setDepenses] = useState<Transaction[]>([]);
  const isRestricted = currentUser?.role !== "Trésorier";
  const [newRevenu, setNewRevenu] = useState({
    source: "",
    montant: ""
  });

  const [newDepense, setNewDepense] = useState({
    description: "",
    montant: ""
  });


  const fetchRevenus = async () => {
  try {
    const res = await axios.get("http://localhost:3000/tresorerie/list");
    const revenusFromApi: Transaction[] = res.data.map((r: any) => ({
      id: r.id,
      type: "revenu",
      description: r.source,
      montant: Number(r.montant), 
      nom: r.nom ?? "Inconnu",
      prenom: r.prenom ?? "",
      role: r.role ?? "Inconnu",
      date: r.date_creation
    }));
    setRevenus(revenusFromApi);
  } catch (error) {
    console.error("Erreur lors du chargement des revenus", error);
  }
};

const fetchDepenses = async () => {
  try {
    const res = await axios.get("http://localhost:3000/depense/list");
    const depensesFromApi: Transaction[] = res.data.map((d: any) => ({
      id: d.id,
      type: "depense",
      description: d.description,
      montant: Number(d.montant), 
      nom: d.nom ?? "Inconnu",
      prenom: d.prenom ?? "",
      role: d.role ?? "Inconnu",
      date: d.date_creation
    }));
    setDepenses(depensesFromApi);
  } catch (error) {
    console.error("Erreur lors du chargement des dépenses", error);
  }
};


  useEffect(() => {
    fetchRevenus();
    fetchDepenses();
  }, []);

  const totalRevenus = revenus.reduce((sum, t) => sum + t.montant, 0);
  const totalDepenses = depenses.reduce((sum, t) => sum + t.montant, 0);
  const solde = totalRevenus - totalDepenses;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA', minimumFractionDigits: 0 })
      .format(amount).replace('MGA', 'Ar');

  const handleAddRevenu = async () => {
    if (!newRevenu.source || !newRevenu.montant) {
      alert("Merci de remplir tous les champs du revenu");
      return;
    }
    if (isNaN(Number(newRevenu.montant)) || Number(newRevenu.montant) <= 0) {
      alert("Le montant doit être un nombre positif");
      return;
    }
    try {
      await axios.post("http://localhost:3000/tresorerie/create", {
        source: newRevenu.source,
        montant: Number(newRevenu.montant),
        responsable: 1 
      });
      setNewRevenu({ source: "", montant: "" });
      await fetchRevenus();
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu", error);
      alert("Erreur lors de l'ajout du revenu");
    }
  };

  const handleAddDepense = async () => {
    if (!newDepense.description || !newDepense.montant) {
      alert("Merci de remplir tous les champs de la dépense");
      return;
    }
    if (isNaN(Number(newDepense.montant)) || Number(newDepense.montant) <= 0) {
      alert("Le montant doit être un nombre positif");
      return;
    }
    try {
      await axios.post("http://localhost:3000/depense/create", {
        description: newDepense.description,
        montant: Number(newDepense.montant),
        responsable: 1 
      });
      setNewDepense({ description: "", montant: "" });
      await fetchDepenses();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense", error);
      alert("Erreur lors de l'ajout de la dépense");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Gestion de la trésorerie</h2>
        <p className="text-muted-foreground">Gérez les revenus et dépenses de l'association</p>
      </div>

      <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total des revenus</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-success">{formatCurrency(totalRevenus)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total des dépenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-destructive">{formatCurrency(totalDepenses)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Solde actuel</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-lg sm:text-2xl font-bold ${solde >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(solde)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenus" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
        </TabsList>

        {/* Revenus */}
        <TabsContent value="revenus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un revenu</CardTitle>
              <CardDescription>Enregistrez un nouveau revenu pour l'association</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-3 sm:p-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="source-revenu">Source du revenu</Label>
                  <Input
                    id="source-revenu"
                    value={newRevenu.source}
                    onChange={(e) => setNewRevenu({ ...newRevenu, source: e.target.value })}
                    placeholder="Ex: Parrainage, Festival, etc."
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="montant-revenu">Montant (en Ariary)</Label>
                  <Input
                    id="montant-revenu"
                    type="number"
                    value={newRevenu.montant}
                    onChange={(e) => setNewRevenu({ ...newRevenu, montant: e.target.value })}
                    placeholder="100000"
                    className="text-sm"
                  />
                </div>
                <Button onClick={handleAddRevenu} className="w-full text-sm" disabled={isRestricted}>Enregistrer le revenu</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des revenus</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Source</TableHead>
                      <TableHead className="text-xs sm:text-sm">Montant</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Nom responsable</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Rôle</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenus.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4 max-w-[120px] sm:max-w-none truncate">
                          {transaction.description}
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          <Badge className="bg-success text-xs">{formatCurrency(transaction.montant)}</Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          {transaction.nom} {transaction.prenom}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs font-medium">
                            {transaction.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dépenses */}
        <TabsContent value="depenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter une dépense</CardTitle>
              <CardDescription>Enregistrez une nouvelle dépense pour l'association</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-3 sm:p-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="description-depense">Description de la dépense</Label>
                  <Input
                    id="description-depense"
                    value={newDepense.description}
                    onChange={(e) => setNewDepense({ ...newDepense, description: e.target.value })}
                    placeholder="Ex: Achat matériel, Location salle, etc."
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="montant-depense">Montant (en Ariary)</Label>
                  <Input
                    id="montant-depense"
                    type="number"
                    value={newDepense.montant}
                    onChange={(e) => setNewDepense({ ...newDepense, montant: e.target.value })}
                    placeholder="50000"
                    className="text-sm"
                  />
                </div>
                <Button onClick={handleAddDepense} className="w-full text-sm" disabled={isRestricted}>Enregistrer la dépense</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des dépenses</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Description</TableHead>
                      <TableHead className="text-xs sm:text-sm">Montant</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Nom responsable</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Rôle</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {depenses.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4 max-w-[120px] sm:max-w-none truncate">
                          {transaction.description}
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          <Badge className="bg-destructive text-xs">{formatCurrency(transaction.montant)}</Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          {transaction.nom} {transaction.prenom}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs font-medium">
                            {transaction.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tresorerie;
