import {
  pgTable,
  index,
  uniqueIndex,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  numeric,
  date,
  pgEnum,
  pgSequence,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { getDefaultInvoiceBankAccount } from "@/core/lib/invoices/bank-account";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum("user_role", ["ca", "dg", "coord", "staff"]);

export const invoiceTypeEnum = pgEnum("invoice_type", [
  "proforma",
  "definitiva",
]);

export const invoiceStateEnum = pgEnum("invoice_state", [
  "rascunho",
  "proforma",
  "definitiva",
  "paga_parcial",
  "paga",
  "anulada",
]);

export const currencyEnum = pgEnum("currency", ["XOF", "EUR", "USD"]);

export const periodicidadeEnum = pgEnum("periodicidade", [
  "unica",
  "mensal",
  "anual",
  "bienal",
]);

export const projectStateEnum = pgEnum("project_state", [
  "proposta",
  "activo",
  "pausado",
  "concluido",
  "cancelado",
]);

export const salaryPeriodStateEnum = pgEnum("salary_period_state", [
  "aberto",
  "calculado",
  "confirmado",
  "pago",
]);

export const projectRoleEnum = pgEnum("project_role", [
  "pf",
  "aux",
  "dg",
  "coord",
]);

export const expenseCategoryEnum = pgEnum("expense_category", [
  "aluguer",
  "servicos_publicos",
  "material_escritorio",
  "deslocacoes",
  "marketing",
  "formacao",
  "software_licencas",
  "manutencao",
  "impostos_taxas",
  "impressao",
  "fundo_maneio",
  "comunicacao",
  "outros",
]);

export const expenseStateEnum = pgEnum("expense_state", [
  "rascunho",
  "aprovada",
  "paga",
  "anulada",
]);

export const dividendStateEnum = pgEnum("dividend_state", [
  "proposto",
  "aprovado",
  "pago",
  "anulado",
]);

export const stockMovementTypeEnum = pgEnum("stock_movement_type", [
  "entrada",
  "saida",
  "ajuste",
]);

export const taskStateEnum = pgEnum("task_state", [
  "pendente",
  "em_curso",
  "submetida",
  "aprovada",
  "precisa_correcao",
  "rejeitada",
  "concluida",
  "cancelada",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "baixa",
  "media",
  "alta",
]);

export const projectDeliverableStateEnum = pgEnum("project_deliverable_state", [
  "planeado",
  "em_curso",
  "concluido",
  "cancelado",
]);

export const taskValidationDecisionEnum = pgEnum("task_validation_decision", [
  "aprovada",
  "precisa_correcao",
  "rejeitada",
]);

export const reportTypeEnum = pgEnum("report_type", [
  "mensal",
  "trimestral",
  "anual",
]);

export const chatConversationTypeEnum = pgEnum("chat_conversation_type", [
  "direct",
  "group",
  "project",
]);

export const chatEmailNotificationStateEnum = pgEnum(
  "chat_email_notification_state",
  ["pending", "sent", "skipped", "error"]
);

// ─── Sequences ───────────────────────────────────────────────────────────────

export const invoiceNumberSeq = pgSequence("invoice_number_seq", {
  startWith: 1,
  increment: 1,
  minValue: 1,
});

// ─── users ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  authUserId: uuid("auth_user_id").unique().notNull(),
  nomeCompleto: text("nome_completo").notNull(),
  nomeCurto: varchar("nome_curto", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  telefone: varchar("telefone", { length: 30 }),
  role: roleEnum("role").notNull().default("staff"),
  cargo: text("cargo"),
  salarioBaseMensal: numeric("salario_base_mensal", {
    precision: 12,
    scale: 2,
  }).default("0"),
  percentagemDescontoFolha: numeric("percentagem_desconto_folha", {
    precision: 5,
    scale: 4,
  })
    .notNull()
    .default("0"),
  elegivelSubsidioDinamicoDefault: boolean(
    "elegivel_subsidio_dinamico_default"
  )
    .notNull()
    .default(true),
  dataEntrada: date("data_entrada"),
  dataSaida: date("data_saida"),
  fotografiaUrl: text("fotografia_url"),
  activo: boolean("activo").notNull().default(true),
  mfaEnabled: boolean("mfa_enabled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── partner_shares ───────────────────────────────────────────────────────────

export const partnerShares = pgTable("partner_shares", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  percentagemQuota: numeric("percentagem_quota", {
    precision: 5,
    scale: 2,
  }).notNull(),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim"),
  notas: text("notas"),
});

// ─── clients ─────────────────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  nif: varchar("nif", { length: 50 }),
  endereco: text("endereco"),
  contacto: varchar("contacto", { length: 50 }),
  email: varchar("email", { length: 255 }),
  pais: varchar("pais", { length: 100 }).default("Guiné-Bissau"),
  notas: text("notas"),
  activo: boolean("activo").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── contacts ────────────────────────────────────────────────────────────────

export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  cargo: varchar("cargo", { length: 100 }),
  email: varchar("email", { length: 255 }),
  telefone: varchar("telefone", { length: 50 }),
  principal: boolean("principal").notNull().default(false),
});

// ─── services_catalog ────────────────────────────────────────────────────────

export const servicesCatalog = pgTable("services_catalog", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoria: varchar("categoria", { length: 100 }).notNull(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  unidade: varchar("unidade", { length: 50 }).default("serviço"),
  periodicidade: periodicidadeEnum("periodicidade").notNull().default("unica"),
  prazoEntrega: varchar("prazo_entrega", { length: 100 }),
  precoXof: numeric("preco_xof", { precision: 12, scale: 2 }),
  activo: boolean("activo").notNull().default(true),
});

// ─── projects ────────────────────────────────────────────────────────────────

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "restrict" }),
  servicoId: uuid("servico_id").references(() => servicesCatalog.id, {
    onDelete: "set null",
  }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  dataInicio: date("data_inicio").notNull(),
  dataFimEstimada: date("data_fim_estimada"),
  estado: projectStateEnum("estado").notNull().default("proposta"),
  pontoFocalId: uuid("ponto_focal_id").references(() => users.id, {
    onDelete: "set null",
  }),
  valorPrevisto: numeric("valor_previsto", { precision: 14, scale: 2 }),
  moeda: currencyEnum("moeda").notNull().default("XOF"),
  notas: text("notas"),
  percentagemPf: numeric("percentagem_pf", { precision: 5, scale: 4 }),
  percentagemAuxTotal: numeric("percentagem_aux_total", {
    precision: 5,
    scale: 4,
  }),
  percentagemRubricaGestao: numeric("percentagem_rubrica_gestao", {
    precision: 5,
    scale: 4,
  }),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  arquivadoEm: timestamp("arquivado_em", { withTimezone: true }),
});

// ─── project_assistants ───────────────────────────────────────────────────────

export const projectAssistants = pgTable("project_assistants", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  percentagemOverride: numeric("percentagem_override", {
    precision: 5,
    scale: 2,
  }),
});

// ─── invoices ────────────────────────────────────────────────────────────────

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  numero: integer("numero"),
  tipo: invoiceTypeEnum("tipo"),
  estado: invoiceStateEnum("estado").notNull().default("rascunho"),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "restrict" }),
  dataEmissao: date("data_emissao").notNull(),
  dataVencimento: date("data_vencimento"),
  moeda: currencyEnum("moeda").notNull().default("XOF"),
  taxaCambio: numeric("taxa_cambio", { precision: 10, scale: 6 }).default("1"),
  subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull().default("0"),
  igvPercentagem: numeric("igv_percentagem", { precision: 5, scale: 2 }).default("0"),
  igvValor: numeric("igv_valor", { precision: 14, scale: 2 }).default("0"),
  total: numeric("total", { precision: 14, scale: 2 }).notNull().default("0"),
  formaPagamento: text("forma_pagamento"),
  contaBancaria: text("conta_bancaria").default(
    getDefaultInvoiceBankAccount(),
  ),
  observacoes: text("observacoes"),
  pdfUrl: text("pdf_url"),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  enviadaEm: timestamp("enviada_em", { withTimezone: true }),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── invoice_items ────────────────────────────────────────────────────────────

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  ordem: integer("ordem").notNull().default(1),
  descricao: text("descricao").notNull(),
  unidade: varchar("unidade", { length: 50 }).default("serviço"),
  quantidade: numeric("quantidade", { precision: 10, scale: 3 }).notNull().default("1"),
  precoUnitario: numeric("preco_unitario", { precision: 14, scale: 2 }).notNull(),
  total: numeric("total", { precision: 14, scale: 2 }).notNull(),
});

// ─── invoice_payments ─────────────────────────────────────────────────────────

export const invoicePayments = pgTable("invoice_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  data: date("data").notNull(),
  valor: numeric("valor", { precision: 14, scale: 2 }).notNull(),
  moeda: currencyEnum("moeda").notNull(),
  taxaCambio: numeric("taxa_cambio", { precision: 10, scale: 6 }).default("1"),
  referencia: varchar("referencia", { length: 200 }),
  metodo: varchar("metodo", { length: 100 }),
  comproativoUrl: text("comprovativo_url"),
  notas: text("notas"),
  registadoPor: uuid("registado_por").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── salary_policies ──────────────────────────────────────────────────────────

export const salaryPolicies = pgTable("salary_policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  versao: varchar("versao", { length: 20 }).notNull(),
  descricao: text("descricao"),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim"),
  activo: boolean("activo").notNull().default(true),
  configuracaoJson: jsonb("configuracao_json").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── salary_periods ───────────────────────────────────────────────────────────

export const salaryPeriods = pgTable("salary_periods", {
  id: uuid("id").defaultRandom().primaryKey(),
  ano: integer("ano").notNull(),
  mes: integer("mes").notNull(),
  policyId: uuid("policy_id")
    .notNull()
    .references(() => salaryPolicies.id, { onDelete: "restrict" }),
  estado: salaryPeriodStateEnum("estado").notNull().default("aberto"),
  totalBruto: numeric("total_bruto", { precision: 14, scale: 2 }).default("0"),
  totalLiquido: numeric("total_liquido", { precision: 14, scale: 2 }).default("0"),
  totalFolha: numeric("total_folha", { precision: 14, scale: 2 }).default("0"),
  criadoPor: uuid("criado_por").references(() => users.id, {
    onDelete: "set null",
  }),
  confirmadoEm: timestamp("confirmado_em", { withTimezone: true }),
  confirmadoPor: uuid("confirmado_por").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── salary_lines ─────────────────────────────────────────────────────────────

export const salaryLines = pgTable("salary_lines", {
  id: uuid("id").defaultRandom().primaryKey(),
  periodId: uuid("period_id")
    .notNull()
    .references(() => salaryPeriods.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  salarioBase: numeric("salario_base", { precision: 14, scale: 2 }).notNull().default("0"),
  componenteDinamica: jsonb("componente_dinamica").default("[]"),
  subsidios: jsonb("subsidios").default("{}"),
  outrosBeneficios: numeric("outros_beneficios", { precision: 14, scale: 2 }).default("0"),
  descontos: numeric("descontos", { precision: 14, scale: 2 }).default("0"),
  totalBrutoCalculado: numeric("total_bruto_calculado", {
    precision: 14,
    scale: 2,
  })
    .notNull()
    .default("0"),
  totalBrutoFinal: numeric("total_bruto_final", { precision: 14, scale: 2 })
    .notNull()
    .default("0"),
  totalLiquidoCalculado: numeric("total_liquido_calculado", {
    precision: 14,
    scale: 2,
  })
    .notNull()
    .default("0"),
  totalLiquidoFinal: numeric("total_liquido_final", { precision: 14, scale: 2 })
    .notNull()
    .default("0"),
  pago: boolean("pago").notNull().default(false),
  dataPagamento: date("data_pagamento"),
  referenciaPagamento: varchar("referencia_pagamento", { length: 200 }),
  reciboUrl: text("recibo_url"),
  overrideMotivo: text("override_motivo"),
});

// ─── project_payments ─────────────────────────────────────────────────────────

export const projectPayments = pgTable("project_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  periodId: uuid("period_id")
    .notNull()
    .references(() => salaryPeriods.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "restrict" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  papel: projectRoleEnum("papel").notNull(),
  percentagemAplicada: numeric("percentagem_aplicada", { precision: 5, scale: 2 }).notNull(),
  valorLiquidoProjecto: numeric("valor_liquido_projecto", { precision: 14, scale: 2 }).notNull(),
  valorRecebido: numeric("valor_recebido", { precision: 14, scale: 2 }).notNull(),
});

// ─── expenses ─────────────────────────────────────────────────────────────────

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  data: date("data").notNull(),
  categoria: expenseCategoryEnum("categoria").notNull(),
  descricao: text("descricao").notNull(),
  fornecedor: text("fornecedor"),
  nifFornecedor: varchar("nif_fornecedor", { length: 50 }),
  valor: numeric("valor", { precision: 14, scale: 2 }).notNull(),
  moeda: currencyEnum("moeda").notNull().default("XOF"),
  taxaCambio: numeric("taxa_cambio", { precision: 10, scale: 6 }).default("1"),
  valorXof: numeric("valor_xof", { precision: 14, scale: 2 }).notNull(),
  metodoPagamento: varchar("metodo_pagamento", { length: 100 }),
  referencia: varchar("referencia", { length: 200 }),
  comprovativoUrl: text("comprovativo_url"),
  estado: expenseStateEnum("estado").notNull().default("rascunho"),
  dataPagamento: date("data_pagamento"),
  notas: text("notas"),
  criadoPor: uuid("criado_por").references(() => users.id, {
    onDelete: "set null",
  }),
  aprovadoPor: uuid("aprovado_por").references(() => users.id, {
    onDelete: "set null",
  }),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  beneficiarioUserId: uuid("beneficiario_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── salary_period_participants ─────────────────────────────────────────────

export const salaryPeriodParticipants = pgTable(
  "salary_period_participants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    periodId: uuid("period_id")
      .notNull()
      .references(() => salaryPeriods.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    isElegivelSubsidio: boolean("is_elegivel_subsidio")
      .notNull()
      .default(true),
    recebeRubricaGestao: boolean("recebe_rubrica_gestao")
      .notNull()
      .default(false),
    salarioBaseOverride: numeric("salario_base_override", {
      precision: 12,
      scale: 2,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("salary_period_participants_period_user_uq").on(
      t.periodId,
      t.userId
    ),
    uniqueIndex("one_rubrica_gestao_per_period")
      .on(t.periodId)
      .where(sql`${t.recebeRubricaGestao} = true`),
  ]
);

// ─── salary_period_projects ────────────────────────────────────────────────

export const salaryPeriodProjects = pgTable(
  "salary_period_projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    periodId: uuid("period_id")
      .notNull()
      .references(() => salaryPeriods.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "restrict" }),
    valorLiquido: numeric("valor_liquido", { precision: 14, scale: 2 })
      .notNull()
      .default("0"),
    pfPercentagemOverride: numeric("pf_percentagem_override", {
      precision: 5,
      scale: 4,
    }),
    coordId: uuid("coord_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("salary_period_projects_period_project_uq").on(
      t.periodId,
      t.projectId
    ),
  ]
);

// ─── stock_items ─────────────────────────────────────────────────────────────

export const stockItems = pgTable("stock_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  sku: varchar("sku", { length: 100 }).unique(),
  categoria: varchar("categoria", { length: 100 }),
  unidade: varchar("unidade", { length: 30 }).notNull().default("unidade"),
  quantidadeAtual: numeric("quantidade_atual", { precision: 14, scale: 3 })
    .notNull()
    .default("0"),
  quantidadeMinima: numeric("quantidade_minima", { precision: 14, scale: 3 })
    .notNull()
    .default("0"),
  custoUnitario: numeric("custo_unitario", { precision: 14, scale: 2 }),
  localizacao: text("localizacao"),
  activo: boolean("activo").notNull().default(true),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── stock_movements ─────────────────────────────────────────────────────────

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  itemId: uuid("item_id")
    .notNull()
    .references(() => stockItems.id, { onDelete: "cascade" }),
  tipo: stockMovementTypeEnum("tipo").notNull(),
  quantidade: numeric("quantidade", { precision: 14, scale: 3 }).notNull(),
  custoUnitario: numeric("custo_unitario", { precision: 14, scale: 2 }),
  referencia: varchar("referencia", { length: 200 }),
  notas: text("notas"),
  criadoPor: uuid("criado_por").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── tasks ──────────────────────────────────────────────────────────────────

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  atribuidaA: uuid("atribuida_a")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  atribuidaPor: uuid("atribuida_por").references(() => users.id, {
    onDelete: "set null",
  }),
  projectoId: uuid("projecto_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  clienteId: uuid("cliente_id").references(() => clients.id, {
    onDelete: "set null",
  }),
  deliverableId: uuid("deliverable_id").references(() => projectDeliverables.id, {
    onDelete: "set null",
  }),
  executionWeight: numeric("execution_weight", { precision: 7, scale: 2 })
    .notNull()
    .default("1"),
  prazo: date("prazo"),
  estado: taskStateEnum("estado").notNull().default("pendente"),
  prioridade: taskPriorityEnum("prioridade").notNull().default("media"),
  submissionNote: text("submission_note"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  validatedAt: timestamp("validated_at", { withTimezone: true }),
  validatedBy: uuid("validated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  qualityScore: integer("quality_score"),
  validationNote: text("validation_note"),
  concluidaEm: timestamp("concluida_em", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── project_deliverables ───────────────────────────────────────────────────

export const projectDeliverables = pgTable(
  "project_deliverables",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    titulo: text("titulo").notNull(),
    descricao: text("descricao"),
    peso: numeric("peso", { precision: 7, scale: 2 }).notNull().default("0"),
    prazo: date("prazo"),
    estado: projectDeliverableStateEnum("estado").notNull().default("planeado"),
    ordem: integer("ordem").notNull().default(0),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("project_deliverables_project_title_uq").on(
      t.projectId,
      t.titulo
    ),
  ]
);

// ─── task_submissions ───────────────────────────────────────────────────────

export const taskSubmissions = pgTable("task_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  submittedBy: uuid("submitted_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  comentario: text("comentario"),
  evidenciaUrl: text("evidencia_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── task_validations ───────────────────────────────────────────────────────

export const taskValidations = pgTable("task_validations", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  submissionId: uuid("submission_id").references(() => taskSubmissions.id, {
    onDelete: "set null",
  }),
  validatedBy: uuid("validated_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  decision: taskValidationDecisionEnum("decision").notNull(),
  qualityScore: integer("quality_score"),
  comentario: text("comentario"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── project_execution_snapshots ─────────────────────────────────────────────

export const projectExecutionSnapshots = pgTable(
  "project_execution_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    ano: integer("ano").notNull(),
    mes: integer("mes").notNull(),
    plannedWeight: numeric("planned_weight", { precision: 7, scale: 2 })
      .notNull()
      .default("0"),
    approvedWeight: numeric("approved_weight", { precision: 7, scale: 2 })
      .notNull()
      .default("0"),
    executionPercent: numeric("execution_percent", { precision: 7, scale: 2 })
      .notNull()
      .default("0"),
    assignedTasks: integer("assigned_tasks").notNull().default(0),
    submittedTasks: integer("submitted_tasks").notNull().default(0),
    approvedTasks: integer("approved_tasks").notNull().default(0),
    rejectedTasks: integer("rejected_tasks").notNull().default(0),
    pendingValidationTasks: integer("pending_validation_tasks")
      .notNull()
      .default(0),
    overdueTasks: integer("overdue_tasks").notNull().default(0),
    generatedBy: uuid("generated_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("project_execution_snapshots_project_month_uq").on(
      t.projectId,
      t.ano,
      t.mes
    ),
  ]
);

// ─── staff_performance_snapshots ─────────────────────────────────────────────

export const staffPerformanceSnapshots = pgTable(
  "staff_performance_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    ano: integer("ano").notNull(),
    mes: integer("mes").notNull(),
    assignedTasks: integer("assigned_tasks").notNull().default(0),
    submittedTasks: integer("submitted_tasks").notNull().default(0),
    approvedTasks: integer("approved_tasks").notNull().default(0),
    rejectedTasks: integer("rejected_tasks").notNull().default(0),
    overdueTasks: integer("overdue_tasks").notNull().default(0),
    approvalRate: numeric("approval_rate", { precision: 7, scale: 2 })
      .notNull()
      .default("0"),
    qualityAverage: numeric("quality_average", { precision: 7, scale: 2 }),
    generatedBy: uuid("generated_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("staff_performance_snapshots_user_project_month_uq").on(
      t.userId,
      t.projectId,
      t.ano,
      t.mes
    ),
  ]
);

// ─── reports ────────────────────────────────────────────────────────────────

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  tipo: reportTypeEnum("tipo").notNull(),
  periodoInicio: date("periodo_inicio").notNull(),
  periodoFim: date("periodo_fim").notNull(),
  dadosJson: jsonb("dados_json").notNull().default("{}"),
  pdfUrl: text("pdf_url"),
  xlsxUrl: text("xlsx_url"),
  geradoPor: uuid("gerado_por").references(() => users.id, {
    onDelete: "set null",
  }),
  geradoEm: timestamp("gerado_em", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── chat_conversations ──────────────────────────────────────────────────────

export const chatConversations = pgTable(
  "chat_conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: chatConversationTypeEnum("type").notNull(),
    title: text("title"),
    directKey: varchar("direct_key", { length: 80 }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("chat_conversations_direct_key_uq")
      .on(t.directKey)
      .where(sql`${t.type} = 'direct' AND ${t.directKey} IS NOT NULL`),
    uniqueIndex("chat_conversations_project_uq")
      .on(t.projectId)
      .where(sql`${t.type} = 'project' AND ${t.projectId} IS NOT NULL`),
  ]
);

// ─── chat_participants ───────────────────────────────────────────────────────

export const chatParticipants = pgTable(
  "chat_participants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => chatConversations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("chat_participants_conversation_user_uq").on(
      t.conversationId,
      t.userId
    ),
  ]
);

// ─── chat_messages ───────────────────────────────────────────────────────────

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => chatConversations.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  editedAt: timestamp("edited_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// ─── chat_message_reads ──────────────────────────────────────────────────────

export const chatMessageReads = pgTable(
  "chat_message_reads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    messageId: uuid("message_id")
      .notNull()
      .references(() => chatMessages.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("chat_message_reads_message_user_uq").on(
      t.messageId,
      t.userId
    ),
  ]
);

// ─── user_presence ───────────────────────────────────────────────────────────

export const userPresence = pgTable("user_presence", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  isOnline: boolean("is_online").notNull().default(false),
  currentConversationId: uuid("current_conversation_id").references(
    () => chatConversations.id,
    { onDelete: "set null" }
  ),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── chat_email_notifications ────────────────────────────────────────────────

export const chatEmailNotifications = pgTable(
  "chat_email_notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    messageId: uuid("message_id")
      .notNull()
      .references(() => chatMessages.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    state: chatEmailNotificationStateEnum("state")
      .notNull()
      .default("pending"),
    availableAt: timestamp("available_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("chat_email_notifications_message_recipient_uq").on(
      t.messageId,
      t.recipientId
    ),
  ]
);

// ─── dividend_periods ─────────────────────────────────────────────────────────

export const dividendPeriods = pgTable("dividend_periods", {
  id: uuid("id").defaultRandom().primaryKey(),
  ano: integer("ano").notNull(),
  trimestre: integer("trimestre"),
  baseCalculada: numeric("base_calculada", { precision: 14, scale: 2 })
    .notNull()
    .default("0"),
  totalDistribuido: numeric("total_distribuido", { precision: 14, scale: 2 })
    .notNull()
    .default("0"),
  estado: dividendStateEnum("estado").notNull().default("proposto"),
  notas: text("notas"),
  criadoPor: uuid("criado_por").references(() => users.id, {
    onDelete: "set null",
  }),
  aprovadoPor: uuid("aprovado_por").references(() => users.id, {
    onDelete: "set null",
  }),
  aprovadoEm: timestamp("aprovado_em", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── dividend_lines ───────────────────────────────────────────────────────────

export const dividendLines = pgTable("dividend_lines", {
  id: uuid("id").defaultRandom().primaryKey(),
  periodId: uuid("period_id")
    .notNull()
    .references(() => dividendPeriods.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  percentagemQuota: numeric("percentagem_quota", {
    precision: 5,
    scale: 2,
  }).notNull(),
  valorBruto: numeric("valor_bruto", { precision: 14, scale: 2 })
    .notNull()
    .default("0"),
  pago: boolean("pago").notNull().default(false),
  dataPagamento: date("data_pagamento"),
  referenciaPagamento: varchar("referencia_pagamento", { length: 200 }),
  notas: text("notas"),
});

// ─── audit_log ────────────────────────────────────────────────────────────────

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    acao: varchar("acao", { length: 100 }).notNull(),
    entidade: varchar("entidade", { length: 100 }).notNull(),
    entidadeId: text("entidade_id"),
    resultado: varchar("resultado", { length: 20 })
      .notNull()
      .default("success"),
    severidade: varchar("severidade", { length: 20 })
      .notNull()
      .default("info"),
    requestId: varchar("request_id", { length: 100 }),
    dadosAntes: jsonb("dados_antes"),
    dadosDepois: jsonb("dados_depois"),
    ip: varchar("ip", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_log_created_at_idx").on(table.createdAt),
    index("audit_log_result_created_at_idx").on(
      table.resultado,
      table.createdAt,
    ),
  ],
);

export const securityRateLimits = pgTable(
  "security_rate_limits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    action: varchar("action", { length: 80 }).notNull(),
    subjectHash: varchar("subject_hash", { length: 64 }).notNull(),
    windowStartedAt: timestamp("window_started_at", {
      withTimezone: true,
    }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    blockedUntil: timestamp("blocked_until", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("security_rate_limits_action_subject_uq").on(
      table.action,
      table.subjectHash,
    ),
    index("security_rate_limits_blocked_idx").on(table.blockedUntil),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  partnerShares: many(partnerShares),
  auditLogs: many(auditLog),
  invoicesCreated: many(invoices),
  projectsAsPF: many(projects, { relationName: "pontoFocal" }),
  projectAssistants: many(projectAssistants),
  salaryLines: many(salaryLines),
  salaryPeriodParticipants: many(salaryPeriodParticipants),
  salaryPeriodProjectsAsCoord: many(salaryPeriodProjects, {
    relationName: "salary_period_project_coord",
  }),
  projectPayments: many(projectPayments),
  stockItemsCreated: many(stockItems, {
    relationName: "stock_item_created_by",
  }),
  stockMovements: many(stockMovements, {
    relationName: "stock_movement_created_by",
  }),
  tasksAssigned: many(tasks, {
    relationName: "task_assigned_to",
  }),
  tasksCreated: many(tasks, {
    relationName: "task_assigned_by",
  }),
  tasksValidated: many(tasks, {
    relationName: "task_validated_by",
  }),
  projectDeliverablesCreated: many(projectDeliverables, {
    relationName: "project_deliverable_created_by",
  }),
  taskSubmissions: many(taskSubmissions),
  taskValidations: many(taskValidations, {
    relationName: "task_validation_validated_by",
  }),
  projectExecutionSnapshotsGenerated: many(projectExecutionSnapshots, {
    relationName: "project_execution_snapshot_generated_by",
  }),
  staffPerformanceSnapshots: many(staffPerformanceSnapshots, {
    relationName: "staff_performance_snapshot_user",
  }),
  staffPerformanceSnapshotsGenerated: many(staffPerformanceSnapshots, {
    relationName: "staff_performance_snapshot_generated_by",
  }),
  reportsGenerated: many(reports),
  chatParticipants: many(chatParticipants),
  chatMessagesSent: many(chatMessages, { relationName: "chat_message_sender" }),
  chatMessageReads: many(chatMessageReads),
  chatEmailNotifications: many(chatEmailNotifications),
}));

export const partnerSharesRelations = relations(partnerShares, ({ one }) => ({
  user: one(users, { fields: [partnerShares.userId], references: [users.id] }),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  contacts: many(contacts),
  invoices: many(invoices),
  projects: many(projects),
  tasks: many(tasks),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  client: one(clients, {
    fields: [contacts.clientId],
    references: [clients.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  project: one(projects, {
    fields: [invoices.projectId],
    references: [projects.id],
  }),
  createdBy: one(users, {
    fields: [invoices.createdBy],
    references: [users.id],
  }),
  items: many(invoiceItems),
  payments: many(invoicePayments),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  servico: one(servicesCatalog, {
    fields: [projects.servicoId],
    references: [servicesCatalog.id],
  }),
  pontoFocal: one(users, {
    fields: [projects.pontoFocalId],
    references: [users.id],
    relationName: "pontoFocal",
  }),
  assistants: many(projectAssistants),
  invoices: many(invoices),
  salaryPeriodProjects: many(salaryPeriodProjects),
  projectPayments: many(projectPayments),
  expenses: many(expenses),
  tasks: many(tasks),
  deliverables: many(projectDeliverables),
  executionSnapshots: many(projectExecutionSnapshots),
  staffPerformanceSnapshots: many(staffPerformanceSnapshots),
}));

export const projectAssistantsRelations = relations(projectAssistants, ({ one }) => ({
  project: one(projects, {
    fields: [projectAssistants.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectAssistants.userId],
    references: [users.id],
  }),
}));

export const salaryPoliciesRelations = relations(salaryPolicies, ({ many }) => ({
  periods: many(salaryPeriods),
}));

export const salaryPeriodsRelations = relations(salaryPeriods, ({ one, many }) => ({
  policy: one(salaryPolicies, {
    fields: [salaryPeriods.policyId],
    references: [salaryPolicies.id],
  }),
  lines: many(salaryLines),
  projectPayments: many(projectPayments),
  participants: many(salaryPeriodParticipants),
  periodProjects: many(salaryPeriodProjects),
}));

export const salaryPeriodParticipantsRelations = relations(
  salaryPeriodParticipants,
  ({ one }) => ({
    period: one(salaryPeriods, {
      fields: [salaryPeriodParticipants.periodId],
      references: [salaryPeriods.id],
    }),
    user: one(users, {
      fields: [salaryPeriodParticipants.userId],
      references: [users.id],
    }),
  })
);

export const salaryPeriodProjectsRelations = relations(
  salaryPeriodProjects,
  ({ one }) => ({
    period: one(salaryPeriods, {
      fields: [salaryPeriodProjects.periodId],
      references: [salaryPeriods.id],
    }),
    project: one(projects, {
      fields: [salaryPeriodProjects.projectId],
      references: [projects.id],
    }),
    coord: one(users, {
      fields: [salaryPeriodProjects.coordId],
      references: [users.id],
      relationName: "salary_period_project_coord",
    }),
  })
);

export const salaryLinesRelations = relations(salaryLines, ({ one }) => ({
  period: one(salaryPeriods, {
    fields: [salaryLines.periodId],
    references: [salaryPeriods.id],
  }),
  user: one(users, {
    fields: [salaryLines.userId],
    references: [users.id],
  }),
}));

export const projectPaymentsRelations = relations(projectPayments, ({ one }) => ({
  period: one(salaryPeriods, {
    fields: [projectPayments.periodId],
    references: [salaryPeriods.id],
  }),
  project: one(projects, {
    fields: [projectPayments.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectPayments.userId],
    references: [users.id],
  }),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const invoicePaymentsRelations = relations(
  invoicePayments,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoicePayments.invoiceId],
      references: [invoices.id],
    }),
    registadoPor: one(users, {
      fields: [invoicePayments.registadoPor],
      references: [users.id],
    }),
  })
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, { fields: [auditLog.userId], references: [users.id] }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  criadoPor: one(users, {
    fields: [expenses.criadoPor],
    references: [users.id],
    relationName: "expense_criado_por",
  }),
  aprovadoPor: one(users, {
    fields: [expenses.aprovadoPor],
    references: [users.id],
    relationName: "expense_aprovado_por",
  }),
  project: one(projects, {
    fields: [expenses.projectId],
    references: [projects.id],
    relationName: "expense_project",
  }),
  beneficiario: one(users, {
    fields: [expenses.beneficiarioUserId],
    references: [users.id],
    relationName: "expense_beneficiario",
  }),
}));

export const stockItemsRelations = relations(stockItems, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [stockItems.createdBy],
    references: [users.id],
    relationName: "stock_item_created_by",
  }),
  movements: many(stockMovements),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  item: one(stockItems, {
    fields: [stockMovements.itemId],
    references: [stockItems.id],
  }),
  criadoPor: one(users, {
    fields: [stockMovements.criadoPor],
    references: [users.id],
    relationName: "stock_movement_created_by",
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  atribuidaA: one(users, {
    fields: [tasks.atribuidaA],
    references: [users.id],
    relationName: "task_assigned_to",
  }),
  atribuidaPor: one(users, {
    fields: [tasks.atribuidaPor],
    references: [users.id],
    relationName: "task_assigned_by",
  }),
  projecto: one(projects, {
    fields: [tasks.projectoId],
    references: [projects.id],
  }),
  cliente: one(clients, {
    fields: [tasks.clienteId],
    references: [clients.id],
  }),
  deliverable: one(projectDeliverables, {
    fields: [tasks.deliverableId],
    references: [projectDeliverables.id],
  }),
  validatedByUser: one(users, {
    fields: [tasks.validatedBy],
    references: [users.id],
    relationName: "task_validated_by",
  }),
  submissions: many(taskSubmissions),
  validations: many(taskValidations),
}));

export const projectDeliverablesRelations = relations(
  projectDeliverables,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [projectDeliverables.projectId],
      references: [projects.id],
    }),
    createdByUser: one(users, {
      fields: [projectDeliverables.createdBy],
      references: [users.id],
      relationName: "project_deliverable_created_by",
    }),
    tasks: many(tasks),
  })
);

export const taskSubmissionsRelations = relations(
  taskSubmissions,
  ({ one, many }) => ({
    task: one(tasks, {
      fields: [taskSubmissions.taskId],
      references: [tasks.id],
    }),
    submittedByUser: one(users, {
      fields: [taskSubmissions.submittedBy],
      references: [users.id],
    }),
    validations: many(taskValidations),
  })
);

export const taskValidationsRelations = relations(taskValidations, ({ one }) => ({
  task: one(tasks, {
    fields: [taskValidations.taskId],
    references: [tasks.id],
  }),
  submission: one(taskSubmissions, {
    fields: [taskValidations.submissionId],
    references: [taskSubmissions.id],
  }),
  validatedByUser: one(users, {
    fields: [taskValidations.validatedBy],
    references: [users.id],
    relationName: "task_validation_validated_by",
  }),
}));

export const projectExecutionSnapshotsRelations = relations(
  projectExecutionSnapshots,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectExecutionSnapshots.projectId],
      references: [projects.id],
    }),
    generatedByUser: one(users, {
      fields: [projectExecutionSnapshots.generatedBy],
      references: [users.id],
      relationName: "project_execution_snapshot_generated_by",
    }),
  })
);

export const staffPerformanceSnapshotsRelations = relations(
  staffPerformanceSnapshots,
  ({ one }) => ({
    user: one(users, {
      fields: [staffPerformanceSnapshots.userId],
      references: [users.id],
      relationName: "staff_performance_snapshot_user",
    }),
    project: one(projects, {
      fields: [staffPerformanceSnapshots.projectId],
      references: [projects.id],
    }),
    generatedByUser: one(users, {
      fields: [staffPerformanceSnapshots.generatedBy],
      references: [users.id],
      relationName: "staff_performance_snapshot_generated_by",
    }),
  })
);

export const reportsRelations = relations(reports, ({ one }) => ({
  geradoPor: one(users, {
    fields: [reports.geradoPor],
    references: [users.id],
  }),
}));

export const chatConversationsRelations = relations(
  chatConversations,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [chatConversations.projectId],
      references: [projects.id],
    }),
    creator: one(users, {
      fields: [chatConversations.createdBy],
      references: [users.id],
    }),
    participants: many(chatParticipants),
    messages: many(chatMessages),
  })
);

export const chatParticipantsRelations = relations(
  chatParticipants,
  ({ one }) => ({
    conversation: one(chatConversations, {
      fields: [chatParticipants.conversationId],
      references: [chatConversations.id],
    }),
    user: one(users, {
      fields: [chatParticipants.userId],
      references: [users.id],
    }),
  })
);

export const chatMessagesRelations = relations(
  chatMessages,
  ({ one, many }) => ({
    conversation: one(chatConversations, {
      fields: [chatMessages.conversationId],
      references: [chatConversations.id],
    }),
    sender: one(users, {
      fields: [chatMessages.senderId],
      references: [users.id],
      relationName: "chat_message_sender",
    }),
    reads: many(chatMessageReads),
    emailNotifications: many(chatEmailNotifications),
  })
);

export const chatMessageReadsRelations = relations(
  chatMessageReads,
  ({ one }) => ({
    message: one(chatMessages, {
      fields: [chatMessageReads.messageId],
      references: [chatMessages.id],
    }),
    user: one(users, {
      fields: [chatMessageReads.userId],
      references: [users.id],
    }),
  })
);

export const userPresenceRelations = relations(userPresence, ({ one }) => ({
  user: one(users, {
    fields: [userPresence.userId],
    references: [users.id],
  }),
  currentConversation: one(chatConversations, {
    fields: [userPresence.currentConversationId],
    references: [chatConversations.id],
  }),
}));

export const chatEmailNotificationsRelations = relations(
  chatEmailNotifications,
  ({ one }) => ({
    message: one(chatMessages, {
      fields: [chatEmailNotifications.messageId],
      references: [chatMessages.id],
    }),
    recipient: one(users, {
      fields: [chatEmailNotifications.recipientId],
      references: [users.id],
    }),
  })
);

export const dividendPeriodsRelations = relations(
  dividendPeriods,
  ({ one, many }) => ({
    criadoPor: one(users, {
      fields: [dividendPeriods.criadoPor],
      references: [users.id],
      relationName: "dividend_criado_por",
    }),
    aprovadoPor: one(users, {
      fields: [dividendPeriods.aprovadoPor],
      references: [users.id],
      relationName: "dividend_aprovado_por",
    }),
    lines: many(dividendLines),
  })
);

export const dividendLinesRelations = relations(dividendLines, ({ one }) => ({
  period: one(dividendPeriods, {
    fields: [dividendLines.periodId],
    references: [dividendPeriods.id],
  }),
  user: one(users, {
    fields: [dividendLines.userId],
    references: [users.id],
  }),
}));

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PartnerShare = typeof partnerShares.$inferSelect;
export type NewPartnerShare = typeof partnerShares.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type ServiceCatalog = typeof servicesCatalog.$inferSelect;
export type NewServiceCatalog = typeof servicesCatalog.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;
export type InvoicePayment = typeof invoicePayments.$inferSelect;
export type NewInvoicePayment = typeof invoicePayments.$inferInsert;
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
export type SecurityRateLimit = typeof securityRateLimits.$inferSelect;
export type NewSecurityRateLimit = typeof securityRateLimits.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type StockItem = typeof stockItems.$inferSelect;
export type NewStockItem = typeof stockItems.$inferInsert;
export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type ProjectDeliverable = typeof projectDeliverables.$inferSelect;
export type NewProjectDeliverable = typeof projectDeliverables.$inferInsert;
export type TaskSubmission = typeof taskSubmissions.$inferSelect;
export type NewTaskSubmission = typeof taskSubmissions.$inferInsert;
export type TaskValidation = typeof taskValidations.$inferSelect;
export type NewTaskValidation = typeof taskValidations.$inferInsert;
export type ProjectExecutionSnapshot =
  typeof projectExecutionSnapshots.$inferSelect;
export type NewProjectExecutionSnapshot =
  typeof projectExecutionSnapshots.$inferInsert;
export type StaffPerformanceSnapshot =
  typeof staffPerformanceSnapshots.$inferSelect;
export type NewStaffPerformanceSnapshot =
  typeof staffPerformanceSnapshots.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type NewChatConversation = typeof chatConversations.$inferInsert;
export type ChatParticipant = typeof chatParticipants.$inferSelect;
export type NewChatParticipant = typeof chatParticipants.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type ChatMessageRead = typeof chatMessageReads.$inferSelect;
export type NewChatMessageRead = typeof chatMessageReads.$inferInsert;
export type UserPresence = typeof userPresence.$inferSelect;
export type NewUserPresence = typeof userPresence.$inferInsert;
export type ChatEmailNotification =
  typeof chatEmailNotifications.$inferSelect;
export type NewChatEmailNotification =
  typeof chatEmailNotifications.$inferInsert;
export type UserRole = (typeof roleEnum.enumValues)[number];
export type InvoiceState = (typeof invoiceStateEnum.enumValues)[number];
export type InvoiceType = (typeof invoiceTypeEnum.enumValues)[number];
export type Currency = (typeof currencyEnum.enumValues)[number];
export type ProjectState = (typeof projectStateEnum.enumValues)[number];
export type SalaryPeriodState = (typeof salaryPeriodStateEnum.enumValues)[number];
export type ProjectRole = (typeof projectRoleEnum.enumValues)[number];
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectAssistant = typeof projectAssistants.$inferSelect;
export type SalaryPolicy = typeof salaryPolicies.$inferSelect;
export type NewSalaryPolicy = typeof salaryPolicies.$inferInsert;
export type SalaryPeriod = typeof salaryPeriods.$inferSelect;
export type NewSalaryPeriod = typeof salaryPeriods.$inferInsert;
export type SalaryLine = typeof salaryLines.$inferSelect;
export type NewSalaryLine = typeof salaryLines.$inferInsert;
export type SalaryPeriodParticipant = typeof salaryPeriodParticipants.$inferSelect;
export type NewSalaryPeriodParticipant = typeof salaryPeriodParticipants.$inferInsert;
export type SalaryPeriodProject = typeof salaryPeriodProjects.$inferSelect;
export type NewSalaryPeriodProject = typeof salaryPeriodProjects.$inferInsert;
export type ProjectPayment = typeof projectPayments.$inferSelect;
export type ExpenseCategory = (typeof expenseCategoryEnum.enumValues)[number];
export type ExpenseState = (typeof expenseStateEnum.enumValues)[number];
export type DividendState = (typeof dividendStateEnum.enumValues)[number];
export type StockMovementType = (typeof stockMovementTypeEnum.enumValues)[number];
export type TaskState = (typeof taskStateEnum.enumValues)[number];
export type TaskPriority = (typeof taskPriorityEnum.enumValues)[number];
export type ProjectDeliverableState =
  (typeof projectDeliverableStateEnum.enumValues)[number];
export type TaskValidationDecision =
  (typeof taskValidationDecisionEnum.enumValues)[number];
export type ReportType = (typeof reportTypeEnum.enumValues)[number];
export type ChatConversationType =
  (typeof chatConversationTypeEnum.enumValues)[number];
export type ChatEmailNotificationState =
  (typeof chatEmailNotificationStateEnum.enumValues)[number];
export type DividendPeriod = typeof dividendPeriods.$inferSelect;
export type NewDividendPeriod = typeof dividendPeriods.$inferInsert;
export type DividendLine = typeof dividendLines.$inferSelect;
export type NewDividendLine = typeof dividendLines.$inferInsert;
