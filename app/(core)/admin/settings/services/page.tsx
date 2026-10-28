import { listServices } from "@/core/lib/services/actions";
import Link from "next/link";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { ChevronLeft, Package, Plus } from "lucide-react-core";
import { formatCurrency } from "@/core/lib/utils/format";
import { Header } from "@/core/components/layout/Header";

export const metadata = { title: "Catálogo de Serviços - ABIPTOM Core" };

const PERIODICIDADE_LABEL: Record<string, string> = {
  unica: "Única",
  mensal: "Mensal",
  anual: "Anual",
  bienal: "Bienal",
};

export default async function ServicesPage() {
  const services = await listServices(true);

  const byCategoria = services.reduce<Record<string, typeof services>>((acc, s) => {
    (acc[s.categoria] ||= []).push(s);
    return acc;
  }, {});

  return (
    <>
      <Header title="Catálogo de Serviços" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-3">
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Definições
            </Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Catálogo de Serviços</h1>
                <p className="text-sm text-muted-foreground">{services.length} serviço(s) no catálogo</p>
              </div>
              <Button asChild>
                <Link href="/admin/settings/services/new">
                  <Plus className="size-4" />
                  Novo Serviço
                </Link>
              </Button>
            </div>
          </div>

          {services.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-12 text-center">
              <Package className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhum serviço no catálogo.</p>
              <Button asChild variant="secondary">
                <Link href="/admin/settings/services/new">Adicionar primeiro serviço</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(byCategoria).map(([cat, items]) => (
                <div key={cat}>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {cat}
                  </h2>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="min-w-[760px] w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Nome</th>
                          <th className="px-4 py-3 text-left font-medium">Periodicidade</th>
                          <th className="px-4 py-3 text-left font-medium">Prazo</th>
                          <th className="px-4 py-3 text-right font-medium">Preço</th>
                          <th className="px-4 py-3 text-left font-medium">Estado</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {items.map((s) => (
                          <tr key={s.id} className="transition-colors hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">{s.nome}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {PERIODICIDADE_LABEL[s.periodicidade] ?? s.periodicidade}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{s.prazoEntrega ?? "-"}</td>
                            <td className="px-4 py-3 text-right font-mono">
                              {s.precoXof ? formatCurrency(Number(s.precoXof), "XOF") : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={s.activo ? "default" : "secondary"}>
                                {s.activo ? "Activo" : "Inactivo"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Link
                                href={`/admin/settings/services/${s.id}`}
                                className="text-xs text-primary hover:underline"
                              >
                                Editar
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
