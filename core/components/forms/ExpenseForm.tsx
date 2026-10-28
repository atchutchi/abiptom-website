"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/core/components/ui/button";
import { useRouter } from "next/navigation";
import type { Expense } from "@/core/lib/db/schema";
import { EXPENSE_CATEGORY_LABEL } from "@/core/lib/expenses/labels";
import { toXofInteger } from "@/core/lib/utils/money";

type ActionResult = { error?: string; success?: boolean; id?: string; authRequired?: boolean };

interface Props {
  expense?: Expense;
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  activeUsers: Array<{ id: string; nomeCurto: string; role: string }>;
  activeProjects: Array<{ id: string; titulo: string }>;
  submitLabel?: string;
}

const MOEDAS = ["XOF", "EUR", "USD"] as const;

export default function ExpenseForm({
  expense,
  action,
  activeUsers,
  activeProjects,
  submitLabel = "Guardar",
}: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  const [data, setData] = useState(
    expense?.data ?? new Date().toISOString().split("T")[0],
  );
  const [categoria, setCategoria] = useState(expense?.categoria ?? "outros");
  const [descricao, setDescricao] = useState(expense?.descricao ?? "");
  const [fornecedor, setFornecedor] = useState(expense?.fornecedor ?? "");
  const [nifFornecedor, setNifFornecedor] = useState(expense?.nifFornecedor ?? "");
  const [valor, setValor] = useState(expense?.valor ?? "");
  const [moeda, setMoeda] = useState(expense?.moeda ?? "XOF");
  const [taxaCambio, setTaxaCambio] = useState(expense?.taxaCambio ?? "1");
  const [projectId, setProjectId] = useState(expense?.projectId ?? "");
  const [beneficiarioUserId, setBeneficiarioUserId] = useState(
    expense?.beneficiarioUserId ?? "",
  );
  const [metodoPagamento, setMetodoPagamento] = useState(
    expense?.metodoPagamento ?? "",
  );
  const [referencia, setReferencia] = useState(expense?.referencia ?? "");
  const [notas, setNotas] = useState(expense?.notas ?? "");

  const valorXof = (() => {
    const v = Number(valor);
    const t = Number(taxaCambio);
    if (!isFinite(v) || !isFinite(t)) return 0;
    return toXofInteger(v * t);
  })();

  useEffect(() => {
    if (state?.success) {
      if (state.id) router.push(`/admin/expenses/${state.id}`);
      else router.push("/admin/expenses");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {state?.error && (
        <div role="alert" className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {state.error}
          {state.authRequired && (
            <a href="/login" target="_blank" rel="noopener noreferrer" className="mt-2 block underline font-medium">
              Iniciar sessão numa nova janela. Depois, volta a este formulário.
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Data *</label>
          <input
            type="date"
            name="data"
            required
            value={data}
            onChange={(event) => setData(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Categoria *</label>
          <select
            name="categoria"
            required
            value={categoria}
            onChange={(event) => setCategoria(event.target.value as typeof categoria)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            {Object.entries(EXPENSE_CATEGORY_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Descrição *</label>
        <input
          name="descricao"
          required
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Ex.: Aluguer escritório Novembro 2026"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Fornecedor</label>
          <input
            name="fornecedor"
            value={fornecedor}
            onChange={(event) => setFornecedor(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">NIF fornecedor</label>
          <input
            name="nifFornecedor"
            value={nifFornecedor}
            onChange={(event) => setNifFornecedor(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Valor *</label>
          <input
            name="valor"
            type="number"
            required
            step={moeda === "XOF" ? "1" : "0.01"}
            min="0"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Moeda</label>
          <select
            name="moeda"
            value={moeda}
            onChange={(e) => setMoeda(e.target.value as typeof MOEDAS[number])}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            {MOEDAS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Taxa câmbio → XOF</label>
          <input
            name="taxaCambio"
            type="number"
            step="0.000001"
            min="0"
            value={taxaCambio}
            onChange={(e) => setTaxaCambio(e.target.value)}
            disabled={moeda === "XOF"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:bg-muted"
          />
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 px-4 py-2.5 text-sm">
        Valor em XOF: <span className="font-mono font-semibold">
          {valorXof.toLocaleString("pt-PT", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} XOF
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Método de pagamento</label>
          <input
            name="metodoPagamento"
            value={metodoPagamento}
            onChange={(event) => setMetodoPagamento(event.target.value)}
            placeholder="Transferência, numerário, cheque…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Referência</label>
          <input
            name="referencia"
            value={referencia}
            onChange={(event) => setReferencia(event.target.value)}
            placeholder="Nº factura / recibo"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Notas</label>
        <textarea
          name="notas"
          rows={3}
          value={notas}
          onChange={(event) => setNotas(event.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Projecto relacionado (opcional)</label>
        <select
          name="projectId"
          value={projectId}
          onChange={(event) => {
            const nextProjectId = event.target.value;
            setProjectId(nextProjectId);
            if (nextProjectId) {
              setBeneficiarioUserId("");
            }
          }}
          disabled={Boolean(beneficiarioUserId)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">Sem ligação directa a projecto</option>
          {activeProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.titulo}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Usa este campo quando a despesa deve ser abatida ao projecto antes de calcular PF, auxiliares e rubrica de gestão.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Beneficiário (opcional)</label>
        <select
          name="beneficiarioUserId"
          value={beneficiarioUserId}
          onChange={(event) => {
            const nextBeneficiario = event.target.value;
            setBeneficiarioUserId(nextBeneficiario);
            if (nextBeneficiario) {
              setProjectId("");
            }
          }}
          disabled={Boolean(projectId)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">Despesa operacional da empresa</option>
          {activeUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nomeCurto} · {user.role}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Se esta despesa for um benefício directo a um colaborador, selecciona-o aqui. Benefícios directos entram em Outros benefícios na folha. Se a despesa já estiver ligada a um projecto, este campo fica vazio.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "A guardar…" : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
