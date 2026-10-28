"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { updateInvoiceProject } from "@/core/lib/invoices/actions";

interface InvoiceProjectLinkFormProps {
  invoiceId: string;
  initialProjectId: string | null;
  disabled?: boolean;
  projects: Array<{
    id: string;
    titulo: string;
    clienteNome: string;
  }>;
}

export function InvoiceProjectLinkForm({
  invoiceId,
  initialProjectId,
  disabled = false,
  projects,
}: InvoiceProjectLinkFormProps) {
  const router = useRouter();
  const [projectId, setProjectId] = useState(initialProjectId ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError("");
    startTransition(async () => {
      const result = await updateInvoiceProject(invoiceId, {
        projectId: projectId || null,
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Projecto relacionado
        </p>
        <p className="text-xs text-muted-foreground">
          Esta ligação permite que pagamentos desta factura entrem
          automaticamente na folha salarial do mês de pagamento.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          disabled={disabled || isPending}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-60"
        >
          <option value="">Sem projecto ligado</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.titulo} · {project.clienteNome}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          onClick={handleSave}
          disabled={disabled || isPending}
        >
          {isPending ? "A guardar..." : "Guardar ligação"}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
