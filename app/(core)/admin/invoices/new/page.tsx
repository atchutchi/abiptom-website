import { listClients } from "@/core/lib/clients/actions";
import { listServices } from "@/core/lib/services/actions";
import { dbAdmin } from "@/core/lib/db";
import InvoiceForm from "@/core/components/forms/InvoiceForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";

export const metadata = { title: "Nova Factura - ABIPTOM Core" };

export default async function NewInvoicePage() {
  const [clientes, servicos, projectRows] = await Promise.all([
    listClients(),
    listServices(),
    dbAdmin.query.projects.findMany({
      where: (table, { inArray }) =>
        inArray(table.estado, ["proposta", "activo", "pausado", "concluido"]),
      with: {
        client: { columns: { id: true, nome: true } },
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    }),
  ]);

  return (
    <>
      <Header title="Nova Factura" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <Link
              href="/admin/invoices"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Facturas
            </Link>
            <h1 className="mt-2 text-2xl font-semibold">Nova Factura</h1>
          </div>
          <InvoiceForm
            clientes={clientes}
            servicos={servicos}
            projects={projectRows.map((project) => ({
              id: project.id,
              titulo: project.titulo,
              clientId: project.clientId,
              clienteNome: project.client.nome,
            }))}
          />
        </div>
      </main>
    </>
  );
}
