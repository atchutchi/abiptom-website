import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const BRAND_GREEN = "#2D6A4F";
const DARK = "#1A1A1A";
const GRAY = "#666666";
const LIGHT_GRAY = "#F5F5F5";
const BORDER = "#DDDDDD";

export interface PaymentReceiptPDFData {
  receiptNumber: string;
  payment: {
    data: string;
    valor: number;
    moeda: string;
    taxaCambio: number;
    referencia: string | null;
    metodo: string | null;
    notas: string | null;
  };
  invoice: {
    numero: number | null;
    total: number;
    moeda: string;
    dataEmissao: string;
    totalPago: number;
    saldoRestante: number;
    estado: string;
  };
  client: {
    nome: string;
    nif: string | null;
    endereco: string | null;
  };
  registeredBy: string;
  generatedAt: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: DARK,
    paddingHorizontal: 40,
    paddingVertical: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  logo: { width: 120, height: 50, objectFit: "contain" },
  titleBox: { alignItems: "flex-end" },
  titleLabel: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GREEN,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  receiptNumber: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 2,
  },
  dateLabel: { fontSize: 9, color: GRAY, marginTop: 4 },
  separator: {
    borderBottomWidth: 1.5,
    borderBottomColor: BRAND_GREEN,
    marginBottom: 14,
  },
  twoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 24,
  },
  col: { flex: 1 },
  sectionLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  entityName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  entityDetail: { fontSize: 9, color: GRAY, lineHeight: 1.5 },
  bigValueBox: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bigValueLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bigValueAmount: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  detailsBox: {
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 4,
    marginBottom: 14,
    overflow: "hidden",
  },
  detailsTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    backgroundColor: LIGHT_GRAY,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  detailLabel: { fontSize: 9, color: GRAY },
  detailValue: { fontSize: 9, color: DARK, fontFamily: "Helvetica-Bold" },
  notes: {
    fontSize: 9,
    color: GRAY,
    lineHeight: 1.5,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  signatureRow: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40,
  },
  signatureBox: { flex: 1 },
  signatureLine: {
    borderTopWidth: 0.5,
    borderTopColor: DARK,
    marginTop: 36,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: GRAY,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingTop: 8,
  },
  footerText: { fontSize: 7, color: GRAY },
});

function formatNum(n: number): string {
  return Math.round(n).toLocaleString("pt-PT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatDate(d: string): string {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function fmtInvoiceNumber(n: number | null): string {
  if (!n) return "-";
  return String(n).padStart(4, "0");
}

const METHOD_LABELS: Record<string, string> = {
  transferencia: "Transferência bancária",
  numerario: "Numerário",
  cheque: "Cheque",
  mobile_money: "Mobile Money",
  cartao: "Cartão",
};

const STATE_LABELS: Record<string, string> = {
  paga: "Paga",
  paga_parcial: "Paga parcial",
  definitiva: "Em dívida",
};

export function PaymentReceiptPDF({ data }: { data: PaymentReceiptPDFData }) {
  const { receiptNumber, payment, invoice, client, registeredBy, generatedAt } =
    data;

  const valorMoeda = payment.moeda === "XOF" ? "XOF" : payment.moeda;
  const metodo = payment.metodo
    ? METHOD_LABELS[payment.metodo] ?? payment.metodo
    : "-";
  const estadoLabel = STATE_LABELS[invoice.estado] ?? invoice.estado;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/brand/abiptom-logo.png" style={styles.logo} />
          <View style={styles.titleBox}>
            <Text style={styles.titleLabel}>Recibo de Pagamento</Text>
            <Text style={styles.receiptNumber}>{receiptNumber}</Text>
            <Text style={styles.dateLabel}>
              Data de pagamento: {formatDate(payment.data)}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Emitido por</Text>
            <Text style={styles.entityName}>ABIPTOM SARL</Text>
            <Text style={styles.entityDetail}>
              NIF: 510148077{"\n"}Bissau, Guiné-Bissau
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Recebido de</Text>
            <Text style={styles.entityName}>{client.nome}</Text>
            <Text style={styles.entityDetail}>
              {client.nif ? `NIF: ${client.nif}\n` : ""}
              {client.endereco ?? ""}
            </Text>
          </View>
        </View>

        <View style={styles.bigValueBox}>
          <Text style={styles.bigValueLabel}>Valor recebido</Text>
          <Text style={styles.bigValueAmount}>
            {formatNum(payment.valor)} {valorMoeda}
          </Text>
        </View>

        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>Detalhes do pagamento</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Método</Text>
            <Text style={styles.detailValue}>{metodo}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Referência</Text>
            <Text style={styles.detailValue}>{payment.referencia ?? "-"}</Text>
          </View>
          {payment.moeda !== "XOF" && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Taxa de câmbio</Text>
              <Text style={styles.detailValue}>{payment.taxaCambio}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>Factura associada</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Número da factura</Text>
            <Text style={styles.detailValue}>
              {fmtInvoiceNumber(invoice.numero)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data de emissão</Text>
            <Text style={styles.detailValue}>
              {formatDate(invoice.dataEmissao)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total da factura</Text>
            <Text style={styles.detailValue}>
              {formatNum(invoice.total)} {invoice.moeda}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total pago até à data</Text>
            <Text style={styles.detailValue}>
              {formatNum(invoice.totalPago)} {invoice.moeda}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Saldo em dívida</Text>
            <Text style={styles.detailValue}>
              {formatNum(invoice.saldoRestante)} {invoice.moeda}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estado da factura</Text>
            <Text style={styles.detailValue}>{estadoLabel}</Text>
          </View>
        </View>

        {payment.notas && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Observações</Text>
            <Text style={styles.notes}>{payment.notas}</Text>
          </View>
        )}

        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>
              Recebido por: {registeredBy}
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Assinatura / Carimbo</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ABIPTOM SARL · NIF 510148077
          </Text>
          <Text style={styles.footerText}>
            Documento gerado automaticamente · {formatDate(generatedAt)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
