import { getClient, updateClient, toggleClientActive } from "@/core/lib/clients/actions";
import ClientForm from "@/core/components/forms/ClientForm";
import ContactsSection from "@/core/components/forms/ContactsSection";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { formatCurrency, formatDate } from "@/core/lib/utils/format";

export const metadata = { title: "Cliente - ABIPTOM Core" };

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  const updateBound = updateClient.bind(null, id);

  return (
    <>
      <Header title={client.nome} />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <Link
              href="/admin/clients"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Clientes
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold">{client.nome}</h1>
              <Badge variant={client.activo ? "default" : "secondary"}>
                {client.activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>

          <ClientForm client={client} action={updateBound} />

          <form
            action={async () => {
              "use server";
              await toggleClientActive(id, !client.activo);
            }}
          >
            <Button type="submit" variant={client.activo ? "destructive" : "secondary"} size="sm">
              {client.activo ? "Desactivar cliente" : "Reactivar cliente"}
            </Button>
          </form>

          <ContactsSection clientId={id} contacts={client.contacts ?? []} />

          {(client.invoices?.length ?? 0) > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-medium">Facturas recentes</h2>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-[640px] w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Nº</th>
                      <th className="px-4 py-2 text-left font-medium">Data</th>
                      <th className="px-4 py-2 text-left font-medium">Estado</th>
                      <th className="px-4 py-2 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {client.invoices!.map((inv) => (
                      <tr key={inv.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2">
                          <Link href={`/admin/invoices/${inv.id}`} className="text-primary hover:underline">
                            {inv.numero ? `#${String(inv.numero).padStart(5, "0")}` : "Rascunho"}
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{formatDate(inv.dataEmissao)}</td>
                        <td className="px-4 py-2">
                          <Badge variant="secondary" className="capitalize">{inv.estado}</Badge>
                        </td>
                        <td className="px-4 py-2 text-right font-mono">
                          {formatCurrency(inv.total, inv.moeda)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
