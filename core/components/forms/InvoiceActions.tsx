"use client";

import { useState, useTransition } from "react";
import { Button } from "@/core/components/ui/button";
import {
  transitionInvoice,
  deleteInvoiceDraft,
} from "@/core/lib/invoices/actions";
import { useRouter } from "next/navigation";
import { sendInvoiceEmail } from "@/core/lib/email/actions";
import type { InvoiceState } from "@/core/lib/db/schema";
import { FileDown, Mail, CheckCircle, XCircle, Trash2 } from "lucide-react-core";

interface Props {
  invoiceId: string;
  estado: InvoiceState;
  canProforma: boolean;
  canDefinitiva: boolean;
  canAnular: boolean;
  pdfUrl: string;
  clientEmail?: string;
}

export default function InvoiceActions({
  invoiceId,
  estado,
  canProforma,
  canDefinitiva,
  canAnular,
  pdfUrl,
  clientEmail,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  function transition(to: InvoiceState, tipo?: "proforma" | "definitiva") {
    setError(null);
    startTransition(async () => {
      const res = await transitionInvoice(invoiceId, to, tipo);
      if (res?.error) setError(res.error);
      else router.refresh();
    });
  }

  function handleEmail() {
    setError(null);
    startTransition(async () => {
      const res = await sendInvoiceEmail(invoiceId);
      if (res?.error) setError(res.error);
      else {
        setEmailSent(true);
        router.refresh();
      }
    });
  }

  async function handleDelete() {
    if (!confirm("Eliminar este rascunho?")) return;
    const res = await deleteInvoiceDraft(invoiceId);
    if (res?.error) setError(res.error);
    else router.push("/admin/invoices");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {/* PDF */}
        <Button variant="outline" asChild>
          <a href={pdfUrl}>
            <FileDown className="size-4" />
            Ver PDF
          </a>
        </Button>

        {/* Email */}
        {(estado === "proforma" || estado === "definitiva") && clientEmail && (
          <Button variant="outline" onClick={handleEmail} disabled={pending || emailSent}>
            <Mail className="size-4" />
            {emailSent ? "Enviado!" : "Enviar por email"}
          </Button>
        )}

        {/* Transitions */}
        {canProforma && (
          <Button
            variant="secondary"
            onClick={() => transition("proforma", "proforma")}
            disabled={pending}
          >
            Emitir como Proforma
          </Button>
        )}

        {canDefinitiva && (
          <Button onClick={() => transition("definitiva", "definitiva")} disabled={pending}>
            <CheckCircle className="size-4" />
            Emitir como Definitiva
          </Button>
        )}

        {canAnular && estado !== "rascunho" && (
          <Button
            variant="destructive"
            onClick={() => transition("anulada")}
            disabled={pending}
          >
            <XCircle className="size-4" />
            Anular
          </Button>
        )}

        {estado === "rascunho" && (
          <Button variant="destructive" onClick={handleDelete} disabled={pending}>
            <Trash2 className="size-4" />
            Eliminar rascunho
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
