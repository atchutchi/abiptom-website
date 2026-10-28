import { listClients } from "@/core/lib/clients/actions";
import Link from "next/link";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Plus, Building2 } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";

export const metadata = { title: "Clientes - ABIPTOM Core" };

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const clientes = await listClients(q);

  return (
    <>
      <Header title="Clientes" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{clientes.length} cliente(s)</p>
            <Button asChild>
              <Link href="/admin/clients/new">
                <Plus className="size-4" />
                Novo Cliente
              </Link>
            </Button>
          </div>

          {/* Search */}
          <form className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Pesquisar por nome, NIF ou email…"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
            <Button type="submit" variant="secondary">Pesquisar</Button>
          </form>

          {clientes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-12 text-center">
              <Building2 className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
              <Button asChild variant="secondary">
                <Link href="/admin/clients/new">Criar primeiro cliente</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nome</th>
                    <th className="px-4 py-3 text-left font-medium">NIF</th>
                    <th className="px-4 py-3 text-left font-medium">Contacto principal</th>
                    <th className="px-4 py-3 text-left font-medium">País</th>
                    <th className="px-4 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clientes.map((c) => {
                    const principal = c.contacts?.[0];
                    return (
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{c.nome}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.nif ?? "-"}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {principal ? `${principal.nome} (${principal.email ?? principal.telefone ?? "-"})` : c.email ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{c.pais ?? "-"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={c.activo ? "default" : "secondary"}>
                            {c.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/clients/${c.id}`}
                            className="text-primary hover:underline text-xs"
                          >
                            Ver
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
