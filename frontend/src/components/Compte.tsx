import { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const roles = [
  "Membre simple",
  "Trésorier",
  "Secrétaire",
  "Responsable communication",
  "Président",
  "Vice Président"
];

const Compte = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const itemsPerPage = 6;

  const fetchData = () => {
    fetch("https://association-soeremf.onrender.com/compte/comptes")
      .then(res => res.json())
      .then(data => {
        const users = data.users.filter(user => !user.valide);
        const usersWithRole = users.map(user => ({
          ...user,
          role: user.role || "Membre simple"
        }));
        setRequests(usersWithRole);
      })
      .catch(() => {
        toast({
          title: "Erreur",
          description: "Impossible de charger les comptes.",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      });
  };

  useEffect(fetchData, []);

  const handleRoleChange = (email: string, newRole: string) => {
    setRequests(prev =>
      prev.map(user =>
        user.email === email ? { ...user, role: newRole } : user
      )
    );
  };

  const handleAccept = (email: string, nom: string, role: string) => {
    fetch("https://association-soeremf.onrender.com/compte/valider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, valide: true, role }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de la validation");
        return res.json();
      })
      .then(() => {
        toast({
          title: "Accepté",
          description: `${nom} a été validé.`,
          className: "bg-green-50 border-green-200 text-green-800",
        });

        setRequests(prev => prev.filter(user => user.email !== email));
      })
      .catch(() => {
        toast({
          title: "Erreur",
          description: "Erreur lors de la validation.",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      });
  };

  const handleReject = (email: string, nom: string) => {

    fetch("https://association-soeremf.onrender.com/compte/supprimer", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors du refus");
        return res.json();
      })
      .then(() => {
        toast({
          title: "Refusé",
          description: `${nom} a été supprimé.`,
          className: "bg-red-50 border-red-200 text-red-800",
        });

        setRequests(prev => prev.filter(user => user.email !== email));
      })
      .catch(() => {
        toast({
          title: "Erreur",
          description: "Erreur lors du refus.",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      });
  };

  const sortedRequests = [...requests].sort((a, b) =>
    sortOrder === 'asc'
      ? (a.nom || "").localeCompare(b.nom || "")
      : (b.nom || "").localeCompare(a.nom || "")
  );

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const currentRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Comptes</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            Demandes d'inscription <Badge variant="secondary">{requests.length}</Badge>
          </CardTitle>
          <CardDescription>Validez ou refusez les comptes utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={toggleSort} className="h-auto p-0">
                      Nom <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Promotion</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRequests.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.nom}</TableCell>
                    <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                    <TableCell>{user.promotion}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.email, value)}
                      >
                        <SelectTrigger className="min-w-[120px] sm:min-w-[150px]">
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
                    </TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0"
                        onClick={() => handleAccept(user.email, user.nom, user.role)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => handleReject(user.email, user.nom)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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

export default Compte;
