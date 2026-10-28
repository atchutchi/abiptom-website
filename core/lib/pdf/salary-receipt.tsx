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
    relativePath.replace(/^\/+/, ""),
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

const MES_LABELS = [
  "",
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const ROLE_LABELS: Record<string, string> = {
  ca: "Conselho de Administração",
  dg: "Direcção Geral",
  coord: "Coordenação",
  staff: "Staff",
};

const PAPEL_LABELS: Record<string, string> = {
  pf: "Ponto Focal",
  aux: "Auxiliar",
  coord: "Coordenador",
  dg: "Rubrica de Gestão",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
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
  logo: {
    width: 120,
    height: 50,
    objectFit: "contain",
  },
  titleBox: {
    alignItems: "flex-end",
  },
  titleLabel: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GOLD,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  periodLabel: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 2,
  },
  policyLabel: {
    fontSize: 8.5,
    color: GRAY,
    marginTop: 4,
  },
  separator: {
    borderBottomWidth: 1.5,
    borderBottomColor: BRAND_GOLD,
    marginBottom: 14,
  },
  companyBlock: {
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
  companyName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  companyDetail: {
    fontSize: 8.5,
    color: GRAY,
    lineHeight: 1.5,
  },
  staffRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  staffBlock: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    padding: 10,
    borderRadius: 4,
  },
  periodBlock: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
  },
  staffName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  staffDetail: {
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
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    backgroundColor: LIGHT_GRAY,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginTop: 8,
    marginBottom: 4,
  },
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
  colDesc: { flex: 1 },
  colRole: { width: 80 },
  colPct: { width: 50, textAlign: "right" },
  colValue: { width: 80, textAlign: "right" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  summaryLabel: { fontSize: 9, color: DARK },
  summaryValue: {
    fontSize: 9,
    color: DARK,
    fontFamily: "Helvetica-Bold",
  },
  discountValue: {
    fontSize: 9,
    color: "#B91C1C",
    fontFamily: "Helvetica-Bold",
  },
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  totalsBox: {
    width: 240,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: "hidden",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: BRAND_GOLD,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  grandTotalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  paymentBlock: {
    marginTop: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    backgroundColor: "#FAFAFA",
  },
  paymentTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  paymentDetail: {
    fontSize: 9,
    color: DARK,
    lineHeight: 1.4,
  },
  notesBlock: {
    marginTop: 10,
    fontSize: 8,
    color: GRAY,
    lineHeight: 1.4,
  },
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

export interface SalaryReceiptProjectPayment {
  projectTitulo: string;
  papel: string;
  percentagemAplicada: number;
  valorRecebido: number;
}

export interface SalaryReceiptPDFData {
  periodo: {
    ano: number;
    mes: number;
    policyNome: string;
    policyVersao: string;
  };
  staff: {
    nomeCompleto: string;
    nomeCurto: string;
    cargo: string | null;
    role: string;
    email: string | null;
  };
  line: {
    salarioBase: number;
    outrosBeneficios: number;
    descontos: number;
    totalBruto: number;
    totalLiquido: number;
    pago: boolean;
    dataPagamento: string | null;
    referenciaPagamento: string | null;
    overrideMotivo: string | null;
  };
  projectPayments: SalaryReceiptProjectPayment[];
  subsidios: Record<string, number>;
  generatedAt: string;
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

function formatDateLong(d: string): string {
  const [y, m, day] = d.split("-");
  return `${day} de ${MES_LABELS[Number(m)]} de ${y}`;
}

export function SalaryReceiptPDF({ data }: { data: SalaryReceiptPDFData }) {
  const mesLabel = MES_LABELS[data.periodo.mes];
  const periodLabel = `${mesLabel} ${data.periodo.ano}`;
  const componenteTotal = data.projectPayments.reduce(
    (sum, p) => sum + p.valorRecebido,
    0
  );
  const subsidioEntries = Object.entries(data.subsidios).filter(
    ([, v]) => v > 0
  );
  const subsidioTotal = subsidioEntries.reduce((sum, [, v]) => sum + v, 0);
  const roleLabel = ROLE_LABELS[data.staff.role] ?? data.staff.role;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={LOGO_SRC} style={styles.logo} />
          <View style={styles.titleBox}>
            <Text style={styles.titleLabel}>Recibo de Salário</Text>
            <Text style={styles.periodLabel}>{periodLabel}</Text>
            <Text style={styles.policyLabel}>
              {data.periodo.policyNome} v{data.periodo.policyVersao}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Company */}
        <View style={styles.companyBlock}>
          <Text style={styles.sectionLabel}>Entidade Empregadora</Text>
          <Text style={styles.companyName}>ABIPTOM SARL</Text>
          <Text style={styles.companyDetail}>NIF: 510148077</Text>
          <Text style={styles.companyDetail}>
            Bairro de Ajuda 2ª Fase, Bissau, Guiné-Bissau
          </Text>
          <Text style={styles.companyDetail}>
            Email: info@abiptom.gw · Tel: 955 573 423 / 956 147 317
          </Text>
        </View>

        {/* Staff + Period */}
        <View style={styles.staffRow}>
          <View style={styles.staffBlock}>
            <Text style={styles.sectionLabel}>Colaborador</Text>
            <Text style={styles.staffName}>{data.staff.nomeCompleto}</Text>
            {data.staff.cargo && (
              <Text style={styles.staffDetail}>{data.staff.cargo}</Text>
            )}
            <Text style={styles.staffDetail}>{roleLabel}</Text>
            {data.staff.email && (
              <Text style={styles.staffDetail}>{data.staff.email}</Text>
            )}
          </View>

          <View style={styles.periodBlock}>
            <Text style={styles.obsLabel}>Período</Text>
            <Text style={styles.obsValue}>
              {mesLabel} de {data.periodo.ano}
            </Text>
            <Text style={[styles.obsLabel, { marginTop: 6 }]}>
              Política Aplicada
            </Text>
            <Text style={styles.obsValue}>
              {data.periodo.policyNome} v{data.periodo.policyVersao}
            </Text>
            <Text style={[styles.obsLabel, { marginTop: 6 }]}>
              Data de Emissão
            </Text>
            <Text style={styles.obsValue}>
              {formatDate(data.generatedAt)}
            </Text>
          </View>
        </View>

        {/* Componente dinâmica (project payments) */}
        {data.projectPayments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Componente Dinâmica (por projecto)
            </Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>
                Projecto
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colRole]}>
                Papel
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colPct]}>%</Text>
              <Text style={[styles.tableHeaderCell, styles.colValue]}>
                Valor (XOF)
              </Text>
            </View>
            {data.projectPayments.map((pp, i) => (
              <View
                key={`${pp.projectTitulo}-${i}`}
                style={[
                  styles.tableRow,
                  i % 2 === 1 ? styles.tableRowAlt : {},
                ]}
              >
                <Text style={[styles.tableCell, styles.colDesc]}>
                  {pp.projectTitulo}
                </Text>
                <Text style={[styles.tableCell, styles.colRole]}>
                  {PAPEL_LABELS[pp.papel] ?? pp.papel}
                </Text>
                <Text style={[styles.tableCell, styles.colPct]}>
                  {formatNum(pp.percentagemAplicada * 100, 2)}%
                </Text>
                <Text style={[styles.tableCell, styles.colValue]}>
                  {formatNum(pp.valorRecebido)}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Subsídios */}
        {subsidioEntries.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Subsídios</Text>
            {subsidioEntries.map(([label, valor], i) => (
              <View
                key={label}
                style={[
                  styles.tableRow,
                  i % 2 === 1 ? styles.tableRowAlt : {},
                ]}
              >
                <Text style={[styles.tableCell, styles.colDesc]}>{label}</Text>
                <Text style={[styles.tableCell, styles.colValue]}>
                  {formatNum(valor)}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Summary totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Salário Base</Text>
              <Text style={styles.summaryValue}>
                {formatNum(data.line.salarioBase)} XOF
              </Text>
            </View>
            {componenteTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Componente Dinâmica</Text>
                <Text style={styles.summaryValue}>
                  {formatNum(componenteTotal)} XOF
                </Text>
              </View>
            )}
            {subsidioTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subsídios</Text>
                <Text style={styles.summaryValue}>
                  {formatNum(subsidioTotal)} XOF
                </Text>
              </View>
            )}
            {data.line.outrosBeneficios > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Outros Benefícios</Text>
                <Text style={styles.summaryValue}>
                  {formatNum(data.line.outrosBeneficios)} XOF
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Bruto</Text>
              <Text style={styles.summaryValue}>
                {formatNum(data.line.totalBruto)} XOF
              </Text>
            </View>
            {data.line.descontos > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Descontos</Text>
                <Text style={styles.discountValue}>
                  -{formatNum(data.line.descontos)} XOF
                </Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TOTAL LÍQUIDO</Text>
              <Text style={styles.grandTotalValue}>
                {formatNum(data.line.totalLiquido)} XOF
              </Text>
            </View>
          </View>
        </View>

        {/* Payment confirmation */}
        {data.line.pago && data.line.dataPagamento && (
          <View style={styles.paymentBlock}>
            <Text style={styles.paymentTitle}>Confirmação de Pagamento</Text>
            <Text style={styles.paymentDetail}>
              Pago a {formatDateLong(data.line.dataPagamento)}
              {data.line.referenciaPagamento
                ? ` · Ref: ${data.line.referenciaPagamento}`
                : ""}
            </Text>
          </View>
        )}

        {/* Override motivo */}
        {data.line.overrideMotivo && (
          <View style={styles.notesBlock}>
            <Text>Observação: {data.line.overrideMotivo}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Image src={SIGNATURE_SRC} style={styles.signature} />
            <Text style={styles.footerText}>Entidade Empregadora</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image src={STAMP_SRC} style={styles.stamp} />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.footerText}>
              Documento emitido para efeitos de registo salarial interno
            </Text>
            <Text style={styles.footerText}>ABIPTOM SARL · NIF 510148077</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
