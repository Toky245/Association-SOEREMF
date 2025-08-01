import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Apropos = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">À propos de l'application</h2>
        <p className="text-muted-foreground text-base">
          SOEREMF est une application conçue pour accompagner les activités de l'association
          <strong> Solidarité des Étudiants de la Région Melaky à Fianarantsoa (S.O.E.RE.M.F)</strong>.
        </p>
      </div>

      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-lg">Mission de l'association</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            L'association S.O.E.RE.M.F, à but non lucratif, vise à promouvoir l'entraide, la solidarité et
            le développement culturel des étudiants originaires de la région Melaky poursuivant leurs études à Fianarantsoa. 
            Elle constitue un espace d'intégration, de soutien mutuel et de développement personnel à travers diverses activités.
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-secondary">
        <CardHeader>
          <CardTitle className="text-lg">Objectifs de l'application</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Faciliter la gestion administrative de l'association (adhésion, règlements internes, annonces).</li>
            <li>Permettre une meilleure communication entre les membres via les annonces en ligne.</li>
            <li>Suivre les mouvements financiers de manière transparente (revenus, dépenses, solde).</li>
            <li>Valoriser l'engagement associatif des étudiants originaires de la région Melaky.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-success">
        <CardHeader>
          <CardTitle className="text-lg">Public cible</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Cette application s'adresse principalement aux membres de l'association S.O.E.RE.M.F,
            aux nouveaux adhérents, au bureau exécutif, ainsi qu'à toute personne impliquée de près ou de loin dans la vie associative de la diaspora Melaky à Fianarantsoa.
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-warning">
        <CardHeader>
          <CardTitle className="text-lg">Fonctionnalités principales</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Gestion des membres (inscription, statut, historique).</li>
            <li>Publication et consultation d'annonces internes.</li>
            <li>Enregistrement des revenus et dépenses avec affichage du solde.</li>
            <li>Historique des activités récentes.</li>
            <li>Affichage et mise à jour du règlement intérieur.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-accent/20">
        <CardHeader>
          <CardTitle className="text-primary">Version et développement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            SOEREMF - v1.0 est une application développée en 2025 pour répondre aux besoins spécifiques de l'association. 
            Cette version a été conçue pour allier simplicité, efficacité et accessibilité.
          </p>
          <Separator className="my-4" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>Version 1.0</span>
            <span>Développée par <strong>Dazai | ConnectiQ 2025</strong></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Apropos;