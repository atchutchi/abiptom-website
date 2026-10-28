import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/core/components/layout/Header";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Plus } from "lucide-react-core";
import { listUsers } from "@/core/lib/users/actions";
import { getCurrentUser } from "@/core/lib/auth/actions";

const ROLE_LABELS: Record<string, string> = {
  ca: "CA",
  dg: "DG",
  coord: "Coord",
  staff: "Staff",
};

export const metadata = { title: "Utilizadores - ABIPTOM Core" };

export default async function UsersPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");

  if (!dbUser || (dbUser.role !== "ca" && dbUser.role !== "dg")) {
    redirect("/admin/dashboard");
  }

  const allUsers = await listUsers();

  return (
    <>
      <Header title="Utilizadores" />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{allUsers.length} utilizadores</p>
            <Link href="/admin/users/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Novo utilizador
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Desconto folha</TableHead>
                  <TableHead>Elegível 22%</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                      Nenhum utilizador criado ainda.
                    </TableCell>
                  </TableRow>
                )}
                {allUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nomeCompleto}</TableCell>
                    <TableCell className="text-gray-600">{u.email}</TableCell>
                    <TableCell className="text-gray-600">{u.cargo ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {ROLE_LABELS[u.role] ?? u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-gray-600">
                      {(Number(u.percentagemDescontoFolha ?? 0) * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      {u.elegivelSubsidioDinamicoDefault ? (
                        <Badge variant="secondary" className="text-blue-700 bg-blue-50">
                          Sim
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-gray-500 bg-gray-100">
                          Não
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {u.activo ? (
                        <Badge variant="secondary" className="text-green-700 bg-green-50">
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-gray-500 bg-gray-100">
                          Inactivo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/users/${u.id}`}>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </>
  );
}
