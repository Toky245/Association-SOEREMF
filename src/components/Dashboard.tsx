import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Megaphone, Wallet } from "lucide-react";

const Dashboard = () => {
  // Données simulées
  const stats = {
    totalMembres: 45,
    annoncesActives: 3,
    soldeActuel: 125000, // en Ariary
    totalRevenus: 500000,
    totalDepenses: 375000
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount).replace('MGA', 'Ar');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">
          Tableau de bord
        </h2>
        <p className="text-muted-foreground">
          Vue d'ensemble de l'association S.O.E.RE.M.F
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des membres
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.totalMembres}
            </div>
            <p className="text-xs text-muted-foreground">
              Membres actifs de l'association
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Annonces actives
            </CardTitle>
            <Megaphone className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.annoncesActives}
            </div>
            <p className="text-xs text-muted-foreground">
              Annonces en cours
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde actuel
            </CardTitle>
            <Wallet className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(stats.soldeActuel)}
            </div>
            <p className="text-xs text-muted-foreground">
              Trésorerie disponible
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
              Résumé financier
            </CardTitle>
            <CardDescription>
              Aperçu des finances de l'association
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total des revenus</span>
              <span className="text-sm font-bold text-success">
                {formatCurrency(stats.totalRevenus)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total des dépenses</span>
              <span className="text-sm font-bold text-destructive">
                {formatCurrency(stats.totalDepenses)}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Solde net</span>
                <span className="font-bold text-success">
                  {formatCurrency(stats.soldeActuel)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
              Activités récentes
            </CardTitle>
            <CardDescription>
              Dernières actions dans l'association
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Nouveau membre ajouté</span>
                  <p className="text-muted-foreground text-xs">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Annonce publiée</span>
                  <p className="text-muted-foreground text-xs">Il y a 1 jour</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Revenu enregistré</span>
                  <p className="text-muted-foreground text-xs">Il y a 3 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;