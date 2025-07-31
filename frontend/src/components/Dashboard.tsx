import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Users, Megaphone, Wallet } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalMembres: number;
  annoncesActives: number;
  soldeActuel: number;
  totalRevenus: number;
  totalDepenses: number;
  recentActivities: { type: string; created_at: string }[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0
    }).format(amount).replace("MGA", "Ar");
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "membre":
        return { label: "Nouveau membre ajouté", color: "bg-primary" };
      case "annonce":
        return { label: "Annonce publiée", color: "bg-warning" };
      case "revenu":
        return { label: "Revenu enregistré", color: "bg-success" };
      default:
        return { label: "Activité", color: "bg-muted" };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const utcDate = new Date(dateString);

    // Corriger en heure locale selon le fuseau du navigateur
    const localDate = new Date(utcDate.getTime() + new Date().getTimezoneOffset() * -60000);

    const now = new Date();
    const diffMs = now.getTime() - localDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "À l'instant";

    if (diffMinutes < 60) {
      return formatDistanceToNowStrict(localDate, {
        unit: "minute",
        roundingMethod: "floor",
        addSuffix: true,
        locale: fr,
      });
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return formatDistanceToNowStrict(localDate, {
        unit: "hour",
        roundingMethod: "floor",
        addSuffix: true,
        locale: fr,
      });
    }

    return formatDistanceToNowStrict(localDate, {
      unit: "day",
      roundingMethod: "floor",
      addSuffix: true,
      locale: fr,
    });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("https://association-soeremf.onrender.com/dashboard/summary");
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-3 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-3 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-2 w-24" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) return <p>Erreur lors du chargement : {error}</p>;
  if (!stats) return <p>Aucune donnée disponible</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Tableau de bord</h2>
        <p className="text-muted-foreground">Vue d'ensemble de l'association S.O.E.RE.M.F</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total des membres</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalMembres}</div>
            <p className="text-xs text-muted-foreground">Membres actifs</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Annonces enregistrées</CardTitle>
            <Megaphone className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.annoncesActives}</div>
            <p className="text-xs text-muted-foreground">Annonces en cours</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Solde actuel</CardTitle>
            <Wallet className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(stats.soldeActuel)}
            </div>
            <p className="text-xs text-muted-foreground">Trésorerie disponible</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Résumé financier</CardTitle>
            <CardDescription>Aperçu des finances de l'association</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total des revenus</span>
              <span className="text-sm font-bold text-success">{formatCurrency(stats.totalRevenus)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total des dépenses</span>
              <span className="text-sm font-bold text-destructive">{formatCurrency(stats.totalDepenses)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-medium">Solde net</span>
              <span className="font-bold text-success">{formatCurrency(stats.soldeActuel)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Activités récentes</CardTitle>
            <CardDescription>Dernières actions dans l'association</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentActivities.length === 0 && (
              <p className="text-muted-foreground text-sm">Aucune activité récente.</p>
            )}
            {stats.recentActivities.map((activity, index) => {
              const meta = getActivityLabel(activity.type);
              const timeAgo = formatTimeAgo(activity.created_at);

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-2 h-2 ${meta.color} rounded-full`}></div>
                  <div className="text-sm">
                    <span className="font-medium">{meta.label}</span>
                    <p className="text-muted-foreground text-xs">{timeAgo}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
