import Link from "next/link";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table";
import type { UserRole } from "@/core/lib/db/schema";

export interface UserListItem {
  id: string; nomeCompleto: string; email: string; cargo: string | null; role: UserRole;
  percentagemDescontoFolha: string | null; elegivelSubsidioDinamicoDefault: boolean; activo: boolean;
}
const ROLE_LABELS: Record<string, string> = { ca: "CA", dg: "DG", coord: "Coord", staff: "Staff" };

export function UsersTable({ users }: { users: readonly UserListItem[] }) {
  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <Table data-slot="users-table" className="min-w-[900px] xl:min-w-0 xl:table-fixed">
        <colgroup>
          <col style={{ width: "18%" }} /><col style={{ width: "22%" }} /><col style={{ width: "18%" }} /><col style={{ width: "8%" }} />
          <col style={{ width: "10%" }} /><col style={{ width: "8%" }} /><col style={{ width: "8%" }} /><col style={{ width: "8%" }} />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Desconto folha</TableHead>
            <TableHead>Elegível 22%</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead><span className="sr-only">Acções</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                Nenhum utilizador criado ainda.
              </TableCell>
            </TableRow>
          )}
          {users.map((u) => (
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
  );
}
