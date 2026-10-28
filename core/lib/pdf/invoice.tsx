import { readFileSync } from "node:fs";
import path from "node:path";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const BRAND_GOLD = "#F5B800";
const DARK = "#1A1A1A";
const GRAY = "#666666";
const LIGHT_GRAY = "#F5F5F5";
const BORDER = "#DDDDDD";

function getPdfAssetDataUri(relativePath: string) {
  const absolutePath = path.join(
    process.cwd(),
    "public",
    relativePath.replace(/^\/+/, "")
  );
  const extension = path.extname(absolutePath).toLowerCase();
  const mimeType =
    extension === ".jpg" || extension === ".jpeg"
      ? "image/jpeg"
      : extension === ".svg"
        ? "image/svg+xml"
        : "image/png";

  return `data:${mimeType};base64,${readFileSync(absolutePath).toString("base64")}`;
}

const LOGO_SRC = getPdfAssetDataUri("brand/abiptom-logo.png");
const SIGNATURE_SRC = getPdfAssetDataUri("brand/signature.png");
const STAMP_SRC = getPdfAssetDataUri("brand/stamp.png");

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: DARK,
    paddingHorizontal: 40,
    paddingVertical: 32,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "contain",
  },
  invoiceBox: {
    alignItems: "flex-end",
  },
  invoiceType: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GOLD,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 2,
  },
  invoiceDate: {
    fontSize: 9,
    color: GRAY,
    marginTop: 4,
  },
  separator: {
    borderBottomWidth: 1.5,
    borderBottomColor: BRAND_GOLD,
    marginBottom: 14,
  },
  // Seller block
  sellerBlock: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  sellerName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  sellerDetail: {
    fontSize: 8.5,
    color: GRAY,
    lineHeight: 1.5,
  },
  // Client + obs row
  clientObsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  clientBlock: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    padding: 10,
    borderRadius: 4,
  },
  obsBlock: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
  },
  clientName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  clientDetail: {
    fontSize: 8.5,
    color: GRAY,
    lineHeight: 1.5,
    marginTop: 2,
  },
  obsLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  obsValue: {
    fontSize: 9,
    color: DARK,
    lineHeight: 1.4,
  },
  // Items table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: BRAND_GOLD,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    backgroundColor: "#FAFAFA",
  },
  tableCell: {
    fontSize: 8.5,
    color: DARK,
  },
  // Column widths
  colNum: { width: 24 },
  colDesc: { flex: 1 },
  colUnit: { width: 50 },
  colQty: { width: 40, textAlign: "right" },
  colPu: { width: 65, textAlign: "right" },
  colTotal: { width: 70, textAlign: "right" },
  // Totals
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  totalsBox: {
    width: 200,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: "hidden",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  totalLabel: { fontSize: 8.5, color: GRAY },
  totalValue: { fontSize: 8.5, color: DARK, fontFamily: "Helvetica-Bold" },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: BRAND_GOLD,
  },
  grandTotalLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: DARK },
  grandTotalValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: DARK },
  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: {
    alignItems: "center",
    gap: 4,
  },
  signature: {
    width: 80,
    height: 40,
    objectFit: "contain",
  },
  stamp: {
    width: 70,
    height: 70,
    objectFit: "contain",
    opacity: 0.85,
  },
  footerText: {
    fontSize: 7,
    color: GRAY,
    textAlign: "center",
    maxWidth: 200,
    lineHeight: 1.4,
  },
});

export interface InvoicePDFData {
  numero: number | null;
  tipo: "proforma" | "definitiva";
  dataEmissao: string;
  dataVencimento?: string | null;
  moeda: string;
  subtotal: number;
  igvPercentagem: number;
  igvValor: number;
  total: number;
  formaPagamento?: string | null;
  contaBancaria?: string | null;
  observacoes?: string | null;
  client: {
    nome: string;
    nif?: string | null;
    endereco?: string | null;
    contacto?: string | null;
    email?: string | null;
  };
  items: {
    ordem: number;
    descricao: string;
    unidade: string;
    quantidade: number;
    precoUnitario: number;
    total: number;
  }[];
}

function formatNum(n: number, decimals = 0): string {
  return n.toLocaleString("pt-PT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatDate(d: string): string {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

export function InvoicePDF({ data }: { data: InvoicePDFData }) {
  const tipoLabel =
    data.tipo === "proforma" ? "FACTURA PROFORMA" : "FACTURA DEFINITIVA";
  const numLabel = data.numero
    ? String(data.numero).padStart(5, "0")
    : "RASCUNHO";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Header ─────────────────────────────────── */}
        <View style={styles.header}>
          <Image
            src={LOGO_SRC}
            style={styles.logo}
          />
          <View style={styles.invoiceBox}>
            <Text style={styles.invoiceType}>{tipoLabel} Nº</Text>
            <Text style={styles.invoiceNumber}>{numLabel}</Text>
            <Text style={styles.invoiceDate}>
              Data: {formatDate(data.dataEmissao)}
            </Text>
            {data.dataVencimento && (
              <Text style={styles.invoiceDate}>
                Vencimento: {formatDate(data.dataVencimento)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.separator} />

        {/* ── Seller block ────────────────────────────── */}
        <View style={styles.sellerBlock}>
          <Text style={styles.sectionLabel}>Vendedora</Text>
          <Text style={styles.sellerName}>ABIPTOM SARL</Text>
          <Text style={styles.sellerDetail}>NIF: 510148077</Text>
          <Text style={styles.sellerDetail}>Bairro de Ajuda 2ª Fase, Bissau, Guiné-Bissau</Text>
          <Text style={styles.sellerDetail}>Email: info@abiptom.gw · Tel: 955 573 423 / 956 147 317</Text>
        </View>

        {/* ── Client + Observations ────────────────── */}
        <View style={styles.clientObsRow}>
          <View style={styles.clientBlock}>
            <Text style={styles.sectionLabel}>Dados do Cliente</Text>
            <Text style={styles.clientName}>{data.client.nome}</Text>
            {data.client.nif && (
              <Text style={styles.clientDetail}>NIF: {data.client.nif}</Text>
            )}
            {data.client.endereco && (
              <Text style={styles.clientDetail}>{data.client.endereco}</Text>
            )}
            {data.client.contacto && (
              <Text style={styles.clientDetail}>Tel: {data.client.contacto}</Text>
            )}
            {data.client.email && (
              <Text style={styles.clientDetail}>{data.client.email}</Text>
            )}
          </View>

          <View style={styles.obsBlock}>
            {data.formaPagamento && (
              <>
                <Text style={styles.obsLabel}>Forma de Pagamento</Text>
                <Text style={styles.obsValue}>{data.formaPagamento}</Text>
              </>
            )}
            {data.contaBancaria && (
              <>
                <Text style={[styles.obsLabel, { marginTop: 6 }]}>
                  Nº de Conta Bancária
                </Text>
                <Text style={styles.obsValue}>{data.contaBancaria}</Text>
              </>
            )}
            {data.observacoes && (
              <>
                <Text style={[styles.obsLabel, { marginTop: 6 }]}>Observações</Text>
                <Text style={styles.obsValue}>{data.observacoes}</Text>
              </>
            )}
          </View>
        </View>

        {/* ── Items table ──────────────────────────── */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colNum]}>Nº</Text>
          <Text style={[styles.tableHeaderCell, styles.colDesc]}>Descrição</Text>
          <Text style={[styles.tableHeaderCell, styles.colUnit]}>Unidade</Text>
          <Text style={[styles.tableHeaderCell, styles.colQty]}>Qtd.</Text>
          <Text style={[styles.tableHeaderCell, styles.colPu]}>
            P.U. ({data.moeda})
          </Text>
          <Text style={[styles.tableHeaderCell, styles.colTotal]}>
            Total ({data.moeda})
          </Text>
        </View>

        {data.items.map((item, i) => (
          <View
            key={item.ordem}
            style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
          >
            <Text style={[styles.tableCell, styles.colNum]}>{item.ordem}</Text>
            <Text style={[styles.tableCell, styles.colDesc]}>{item.descricao}</Text>
            <Text style={[styles.tableCell, styles.colUnit]}>{item.unidade}</Text>
            <Text style={[styles.tableCell, styles.colQty]}>
              {formatNum(item.quantidade, item.quantidade % 1 !== 0 ? 2 : 0)}
            </Text>
            <Text style={[styles.tableCell, styles.colPu]}>
              {formatNum(item.precoUnitario)}
            </Text>
            <Text style={[styles.tableCell, styles.colTotal]}>
              {formatNum(item.total)}
            </Text>
          </View>
        ))}

        {/* ── Totals ───────────────────────────────── */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Soma Total</Text>
              <Text style={styles.totalValue}>
                {formatNum(data.subtotal)} {data.moeda}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                IGV {data.igvPercentagem}%
              </Text>
              <Text style={styles.totalValue}>
                {formatNum(data.igvValor)} {data.moeda}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TOTAL</Text>
              <Text style={styles.grandTotalValue}>
                {formatNum(data.total)} {data.moeda}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Footer ───────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Image src={SIGNATURE_SRC} style={styles.signature} />
            <Text style={styles.footerText}>Assinatura</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image src={STAMP_SRC} style={styles.stamp} />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.footerText}>
              Despacho de Autorização nº 000084A/2020 - 360 V2 Sarl
            </Text>
            <Text style={styles.footerText}>
              Credenciamento: 000003B/2018
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
