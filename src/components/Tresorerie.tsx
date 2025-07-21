import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface Transaction {
  id: number;
  type: "revenu" | "depense";
  description: string;
  montant: number;
  responsable: string;
  date: string;
}

const Tresorerie = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "revenu",
      description: "Parrainage entreprise locale",
      montant: 200000,
      responsable: "Trésorier",
      date: "2024-01-15"
    },
    {
      id: 2,
      type: "depense",
      description: "Réception des nouveaux",
      montant: 75000,
      responsable: "Président",
      date: "2024-01-20"
    },
    {
      id: 3,
      type: "revenu",
      description: "Festival culturel",
      montant: 300000,
      responsable: "Vice-président",
      date: "2024-02-10"
    },
    {
      id: 4,
      type: "depense",
      description: "Location salle conférence",
      montant: 50000,
      responsable: "Secrétaire",
      date: "2024-02-15"
    }
  ]);

  const [newRevenu, setNewRevenu] = useState({
    source: "",
    montant: "",
    responsable: ""
  });

  const [newDepense, setNewDepense] = useState({
    justification: "",
    montant: "",
    responsable: ""
  });

  const totalRevenus = transactions
    .filter(t => t.type === "revenu")
    .reduce((sum, t) => sum + t.montant, 0);

  const totalDepenses = transactions
    .filter(t => t.type === "depense")
    .reduce((sum, t) => sum + t.montant, 0);

  const solde = totalRevenus - totalDepenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount).replace('MGA', 'Ar');
  };

  const handleAddRevenu = () => {
    // Simulation d'ajout - UI seulement
    console.log("Nouveau revenu:", newRevenu);
    setNewRevenu({ source: "", montant: "", responsable: "" });
  };

  const handleAddDepense = () => {
    // Simulation d'ajout - UI seulement
    console.log("Nouvelle dépense:", newDepense);
    setNewDepense({ justification: "", montant: "", responsable: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">
          Gestion de la trésorerie
        </h2>
        <p className="text-muted-foreground">
          Gérez les revenus et dépenses de l'association
        </p>
      </div>

      {/* Compteurs en haut */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des revenus
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalRevenus)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des dépenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(totalDepenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde actuel
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${solde >= 0 ? 'text-success' : 'text-destructive'}`}>
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

        <TabsContent value="revenus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un revenu</CardTitle>
              <CardDescription>
                Enregistrez un nouveau revenu pour l'association
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="source-revenu">Source du revenu</Label>
                <Input
                  id="source-revenu"
                  value={newRevenu.source}
                  onChange={(e) => setNewRevenu({...newRevenu, source: e.target.value})}
                  placeholder="Ex: Parrainage, Festival, etc."
                />
              </div>
              <div>
                <Label htmlFor="montant-revenu">Montant (en Ariary)</Label>
                <Input
                  id="montant-revenu"
                  type="number"
                  value={newRevenu.montant}
                  onChange={(e) => setNewRevenu({...newRevenu, montant: e.target.value})}
                  placeholder="100000"
                />
              </div>
              <div>
                <Label htmlFor="responsable-revenu">Personne ayant saisi l'entrée</Label>
                <Select 
                  value={newRevenu.responsable} 
                  onValueChange={(value) => setNewRevenu({...newRevenu, responsable: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une personne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tresorier">Trésorier</SelectItem>
                    <SelectItem value="president">Président</SelectItem>
                    <SelectItem value="vice-president">Vice-président</SelectItem>
                    <SelectItem value="secretaire">Secrétaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddRevenu} className="w-full">
                Enregistrer le revenu
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.filter(t => t.type === "revenu").map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success">
                          {formatCurrency(transaction.montant)}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.responsable}</TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter une dépense</CardTitle>
              <CardDescription>
                Enregistrez une nouvelle dépense de l'association
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="justification-depense">Justification de la dépense</Label>
                <Input
                  id="justification-depense"
                  value={newDepense.justification}
                  onChange={(e) => setNewDepense({...newDepense, justification: e.target.value})}
                  placeholder="Ex: Réception des nouveaux, Location salle..."
                />
              </div>
              <div>
                <Label htmlFor="montant-depense">Montant (en Ariary)</Label>
                <Input
                  id="montant-depense"
                  type="number"
                  value={newDepense.montant}
                  onChange={(e) => setNewDepense({...newDepense, montant: e.target.value})}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="responsable-depense">Personne responsable</Label>
                <Select 
                  value={newDepense.responsable} 
                  onValueChange={(value) => setNewDepense({...newDepense, responsable: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une personne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tresorier">Trésorier</SelectItem>
                    <SelectItem value="president">Président</SelectItem>
                    <SelectItem value="vice-president">Vice-président</SelectItem>
                    <SelectItem value="secretaire">Secrétaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddDepense} className="w-full">
                Enregistrer la dépense
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Justification</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.filter(t => t.type === "depense").map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {formatCurrency(transaction.montant)}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.responsable}</TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tresorerie;