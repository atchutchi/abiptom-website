import writeExcelFile from "write-excel-file/node";
import type { SheetData } from "write-excel-file/node";
import type { Invoice } from "@/core/lib/db/schema";

type InvoiceExportInput = Pick<
  Invoice,
  | "numero"
  | "tipo"
  | "estado"
  | "dataEmissao"
  | "dataVencimento"
  | "moeda"
  | "subtotal"
  | "igvPercentagem"
  | "igvValor"
  | "total"
  | "formaPagamento"
  | "enviadaEm"
> & {
  client?: {
    nome: string;
  } | null;
};

export type InvoiceExportRow = {
  numero: string;
  tipo: string;
  estado: string;
  cliente: string;
  dataEmissao: string;
  dataVencimento: string;
  moeda: string;
  subtotal: number;
  igvPercentagem: number;
  igvValor: number;
  total: number;
  formaPagamento: string;
  enviadaEm: string;
};

const HEADERS = [
  "Numero",
  "Tipo",
  "Estado",
  "Cliente",
  "Data Emissao",
  "Data Vencimento",
  "Moeda",
  "Subtotal",
  "IGV (%)",
  "IGV Valor",
  "Total",
  "Forma Pagamento",
  "Enviada Em",
];

export function buildInvoiceExportRows(rows: InvoiceExportInput[]): InvoiceExportRow[] {
  return rows.map((row) => ({
    numero: row.numero ? String(row.numero).padStart(5, "0") : "Rascunho",
    tipo: row.tipo ?? "",
    estado: row.estado,
    cliente: row.client?.nome ?? "",
    dataEmissao: row.dataEmissao,
    dataVencimento: row.dataVencimento ?? "",
    moeda: row.moeda,
    subtotal: Number(row.subtotal),
    igvPercentagem: Number(row.igvPercentagem),
    igvValor: Number(row.igvValor),
    total: Number(row.total),
    formaPagamento: row.formaPagamento ?? "",
    enviadaEm: row.enviadaEm?.toISOString().slice(0, 10) ?? "",
  }));
}

export async function createInvoiceExportWorkbook(
  rows: InvoiceExportRow[],
  mes: string
) {
  const sheetData: SheetData = [
    HEADERS.map((value) => ({ value, fontWeight: "bold" as const })),
    ...rows.map((row) => [
      row.numero,
      row.tipo,
      row.estado,
      row.cliente,
      row.dataEmissao,
      row.dataVencimento,
      row.moeda,
      row.subtotal,
      row.igvPercentagem,
      row.igvValor,
      row.total,
      row.formaPagamento,
      row.enviadaEm,
    ]),
  ];

  return writeExcelFile(sheetData, { sheet: `Facturas ${mes}` }).toBuffer();
}
