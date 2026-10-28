import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { dbAdmin } from "@/core/lib/db";
import { invoicePayments } from "@/core/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { authorizeRoles } from "@/core/lib/auth/authorization";
import {
  PaymentReceiptPDF,
  type PaymentReceiptPDFData,
} from "@/core/lib/pdf/payment-receipt";
import { toXofInteger } from "@/core/lib/utils/money";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const authorization = await authorizeRoles(["ca", "dg"]);
  if (!authorization.success) {
    const status = authorization.error === "Não autenticado" ? 401 : 403;
    return new NextResponse(authorization.error, { status });
  }

  const { paymentId } = await params;

  const payment = await dbAdmin.query.invoicePayments.findFirst({
    where: eq(invoicePayments.id, paymentId),
    with: {
      invoice: {
        with: {
          client: true,
          payments: { orderBy: [asc(invoicePayments.data)] },
        },
      },
      registadoPor: {
        columns: { nomeCompleto: true, nomeCurto: true },
      },
    },
  });

  if (!payment) {
    return new NextResponse("Pagamento não encontrado", { status: 404 });
  }

  const { invoice } = payment;
  if (!invoice) {
    return new NextResponse("Factura não encontrada", { status: 404 });
  }

  // Total pago considera apenas pagamentos até (e incluindo) este recibo
  const pagamentosOrdenados = invoice.payments ?? [];
  const idxRecibo = pagamentosOrdenados.findIndex((p) => p.id === payment.id);
  const pagamentosAteRecibo =
    idxRecibo >= 0
      ? pagamentosOrdenados.slice(0, idxRecibo + 1)
      : [payment];

  const totalPago = pagamentosAteRecibo.reduce(
    (s, p) => s + toXofInteger(Number(p.valor) * Number(p.taxaCambio ?? "1")),
    0
  );
  const saldoRestante = Math.max(toXofInteger(invoice.total) - totalPago, 0);

  const receiptSeq = String(idxRecibo + 1).padStart(2, "0");
  const baseNumero = invoice.numero
    ? String(invoice.numero).padStart(4, "0")
    : payment.id.slice(0, 8);
  const receiptNumber = `REC-${baseNumero}-${receiptSeq}`;

  const generatedAt = new Date().toISOString().split("T")[0];

  const data: PaymentReceiptPDFData = {
    receiptNumber,
    payment: {
      data: payment.data,
      valor: payment.moeda === "XOF" ? toXofInteger(payment.valor) : Number(payment.valor),
      moeda: payment.moeda,
      taxaCambio: Number(payment.taxaCambio ?? "1"),
      referencia: payment.referencia ?? null,
      metodo: payment.metodo ?? null,
      notas: payment.notas ?? null,
    },
    invoice: {
      numero: invoice.numero,
      total: invoice.moeda === "XOF" ? toXofInteger(invoice.total) : Number(invoice.total),
      moeda: invoice.moeda,
      dataEmissao: invoice.dataEmissao,
      totalPago,
      saldoRestante,
      estado: invoice.estado,
    },
    client: {
      nome: invoice.client?.nome ?? "-",
      nif: invoice.client?.nif ?? null,
      endereco: invoice.client?.endereco ?? null,
    },
    registeredBy:
      payment.registadoPor?.nomeCompleto ??
      payment.registadoPor?.nomeCurto ??
      "-",
    generatedAt,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(PaymentReceiptPDF({ data }) as any);

  const filename = `recibo-${receiptNumber.toLowerCase()}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
