import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Gavel, Heart } from "lucide-react";

const Reglement = () => {
  const regulations = [
    {
      id: 1,
      category: "Adhésion",
      icon: Users,
      rules: [
        "L'adhésion à l'association S.O.E.RE.M.F est ouverte à tous les étudiants originaires de la région Melaky.",
        "Tout nouvel adhérent doit remplir un formulaire d'inscription et s'acquitter des frais d'adhésion.",
        "Les membres doivent renouveler leur adhésion chaque année académique.",
        "La qualité de membre se perd en cas de non-renouvellement ou d'exclusion prononcée par le bureau."
      ]
    },
    {
      id: 2,
      category: "Droits et devoirs",
      icon: Gavel,
      rules: [
        "Chaque membre a le droit de participer aux assemblées générales et aux activités de l'association.",
        "Tout membre peut présenter des propositions lors des réunions statutaires.",
        "Les membres ont le devoir de respecter les statuts et règlements de l'association.",
        "Chaque membre doit contribuer au bon fonctionnement et à la bonne image de l'association."
      ]
    },
    {
      id: 3,
      category: "Vie associative",
      icon: Heart,
      rules: [
        "Les réunions du bureau se tiennent au minimum une fois par mois.",
        "L'assemblée générale ordinaire a lieu une fois par an, avant la fin de l'année académique.",
        "Toute proposition de modification des statuts doit être soumise à l'assemblée générale.",
        "Les décisions importantes sont prises à la majorité des membres présents."
      ]
    },
    {
      id: 4,
      category: "Finances",
      icon: FileText,
      rules: [
        "Les cotisations annuelles sont fixées par l'assemblée générale sur proposition du trésorier.",
        "Toute dépense supérieure à 50 000 Ar doit être approuvée par le bureau.",
        "Le trésorier présente un rapport financier à chaque assemblée générale.",
        "Les comptes de l'association sont vérifiés annuellement par un commissaire aux comptes."
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">
          Règlement intérieur
        </h2>
        <p className="text-muted-foreground">
          Règlements internes de l'association S.O.E.RE.M.F
        </p>
      </div>

      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Préambule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            La Solidarité des Étudiants de la Région Melaky à Fianarantsoa (S.O.E.RE.M.F) est une association 
            à but non lucratif qui vise à promouvoir l'entraide, la solidarité et le développement culturel 
            des étudiants originaires de la région Melaky poursuivant leurs études à Fianarantsoa.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {regulations.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{section.category}</CardTitle>
                    <CardDescription>
                      Article {section.id} du règlement intérieur
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.rules.map((rule, index) => (
                    <div key={index} className="flex gap-3">
                      <Badge variant="outline" className="shrink-0 mt-0.5">
                        {section.id}.{index + 1}
                      </Badge>
                      <p className="text-muted-foreground leading-relaxed">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-accent/20">
        <CardHeader>
          <CardTitle className="text-primary">Mise à jour du règlement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ce règlement intérieur a été adopté par l'assemblée générale du 15 janvier 2024. 
            Il peut être modifié sur proposition du bureau ou de 1/3 des membres de l'association, 
            sous réserve d'approbation par l'assemblée générale à la majorité des 2/3 des membres présents.
          </p>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Dernière mise à jour : 15 janvier 2024</span>
            <span>Version 1.0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reglement;