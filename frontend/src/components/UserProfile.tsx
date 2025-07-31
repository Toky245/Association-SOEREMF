import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Save, X } from "lucide-react";
import { useState } from "react";

export interface User {
  name: string;
  email: string;
  role: string;
  promotion: string; // Conservé pour compatibilité si besoin ailleurs
  telephone?: string;
  dateInscription?: string;
}

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

const UserProfile = ({ open, onOpenChange, user }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    console.log("Profil mis à jour:", editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Mon Profil
            {!isEditing ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="ml-auto"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            Gérez vos informations personnelles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                <AvatarInitials name={user.name} />
              </AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="text-sm">
              {user.role}
            </Badge>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                )}
              </div>

              {user.telephone && (
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  {isEditing ? (
                    <Input
                      id="telephone"
                      value={editedUser.telephone || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, telephone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{user.telephone}</p>
                  )}
                </div>
              )}

              {user.dateInscription && (
                <div>
                  <Label>Date d'inscription</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(user.dateInscription).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
