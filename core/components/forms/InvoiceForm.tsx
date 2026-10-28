"use client";

import { useState, useTransition } from "react";
import { Button } from "@/core/components/ui/button";
import { useRouter } from "next/navigation";
import { createInvoice } from "@/core/lib/invoices/actions";
import type { Client, ServiceCatalog } from "@/core/lib/db/schema";
import { Plus, Trash2 } from "lucide-react-core";
import { toXofInteger } from "@/core/lib/utils/money";

interface Item {
  descricao: string;
  unidade: string;
  quantidade: number;
  precoUnitario: number;
}

interface Props {
  clientes: Client[];
  servicos: ServiceCatalog[];
  projects: Array<{
    id: string;
    titulo: string;
    clientId: string;
    clienteNome: string;
  }>;
}

export default function InvoiceForm({ clientes, servicos, projects }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dataEmissao, setDataEmissao] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [dataVencimento, setDataVencimento] = useState("");
  const [moeda, setMoeda] = useState<"XOF" | "EUR" | "USD">("XOF");
  const [taxaCambio, setTaxaCambio] = useState(1);
  const [igvPercentagem, setIgvPercentagem] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState("Transferência bancária");
  const [observacoes, setObservacoes] = useState("");
  const [items, setItems] = useState<Item[]>([
    { descricao: "", unidade: "serviço", quantidade: 1, precoUnitario: 0 },
  ]);

  const addItem = () =>
    setItems([
      ...items,
      { descricao: "", unidade: "serviço", quantidade: 1, precoUnitario: 0 },
    ]);

  const removeItem = (i: number) =>
    setItems(items.filter((_, idx) => idx !== i));

  const updateItem = (i: number, key: keyof Item, val: string | number) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));

  const fillFromService = (i: number, serviceId: string) => {
    const svc = servicos.find((s) => s.id === serviceId);
    if (!svc) return;
    updateItem(i, "descricao", svc.nome);
    updateItem(i, "unidade", svc.unidade ?? "serviço");
    if (svc.precoXof) updateItem(i, "precoUnitario", Number(svc.precoXof));
  };

  const roundMoney = (value: number) =>
    moeda === "XOF" ? toXofInteger(value) : Math.round(value * 100) / 100;
  const formatMoney = (value: number) =>
    value.toLocaleString("pt-PT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: moeda === "XOF" ? 0 : 2,
    });
  const subtotal = items.reduce(
    (s, it) => s + roundMoney(it.quantidade * it.precoUnitario),
    0,
  );
  const igvValor = roundMoney(subtotal * (igvPercentagem / 100));
  const total = roundMoney(subtotal + igvValor);
  const clientProjects = clientId
    ? projects.filter((project) => project.clientId === clientId)
    : projects;

  function submit() {
    setError(null);
    if (!clientId) return setError("Selecciona um cliente.");
    const invalid = items.find((it) => !it.descricao.trim());
    if (invalid) return setError("Todos os itens precisam de descrição.");

    startTransition(async () => {
      const res = await createInvoice({
        clientId,
        projectId: projectId || undefined,
        dataEmissao,
        dataVencimento: dataVencimento || undefined,
        moeda,
        taxaCambio,
        igvPercentagem,
        formaPagamento,
        observacoes,
        items: items.map((it, idx) => ({ ...it, ordem: idx + 1 })),
      });
      if (res?.error) {
        setError(res.error);
      } else if (res?.id) {
        router.push(`/admin/invoices/${res.id}`);
      }
    });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Header fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <label className="text-sm font-medium">Cliente *</label>
          <select
            value={clientId}
            onChange={(e) => {
              const nextClientId = e.target.value;
              setClientId(nextClientId);
              const selectedProject = projects.find(
                (project) => project.id === projectId,
              );
              if (selectedProject && selectedProject.clientId !== nextClientId) {
                setProjectId("");
              }
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">Seleccionar cliente…</option>
            {clientes
              .filter((c) => c.activo)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
          </select>
        </div>

        <div className="col-span-2 space-y-1.5">
          <label className="text-sm font-medium">Projecto relacionado</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">Sem projecto ligado</option>
            {clientProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.titulo} · {project.clienteNome}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Usa esta ligação para a folha salarial importar automaticamente os
            valores pagos desta factura para o projecto.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Data de emissão *</label>
          <input
            type="date"
            value={dataEmissao}
            onChange={(e) => setDataEmissao(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Data de vencimento</label>
          <input
            type="date"
            value={dataVencimento}
            onChange={(e) => setDataVencimento(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Moeda</label>
          <select
            value={moeda}
            onChange={(e) => setMoeda(e.target.value as "XOF" | "EUR" | "USD")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          >
            <option value="XOF">XOF (Franco CFA)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="USD">USD (Dólar)</option>
          </select>
        </div>

        {moeda !== "XOF" && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Câmbio → XOF</label>
            <input
              type="number"
              min={0.000001}
              step="any"
              value={taxaCambio}
              onChange={(e) => setTaxaCambio(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>
        )}
      </div>

      {/* Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Itens</h2>
          <Button size="sm" variant="secondary" type="button" onClick={addItem}>
            <Plus className="size-4" /> Adicionar linha
          </Button>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Serviço / Descrição</th>
                <th className="px-3 py-2 text-left font-medium w-24">Unidade</th>
                <th className="px-3 py-2 text-right font-medium w-20">Qtd.</th>
                <th className="px-3 py-2 text-right font-medium w-28">Preço unit.</th>
                <th className="px-3 py-2 text-right font-medium w-28">Total</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="px-3 py-2">
                    <div className="space-y-1">
                      <select
                        onChange={(e) => fillFromService(i, e.target.value)}
                        defaultValue=""
                        className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-muted-foreground outline-none"
                      >
                        <option value="">Escolher do catálogo…</option>
                        {servicos.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.categoria} - {s.nome}
                          </option>
                        ))}
                      </select>
                      <input
                        value={item.descricao}
                        onChange={(e) => updateItem(i, "descricao", e.target.value)}
                        placeholder="Descrição do item *"
                        className="w-full rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring/50"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={item.unidade}
                      onChange={(e) => updateItem(i, "unidade", e.target.value)}
                      className="w-full rounded border border-border bg-background px-2 py-1 text-sm outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step={moeda === "XOF" ? "1" : "any"}
                      value={item.quantidade}
                      onChange={(e) =>
                        updateItem(i, "quantidade", Number(e.target.value))
                      }
                      className="w-full rounded border border-border bg-background px-2 py-1 text-sm text-right outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={item.precoUnitario}
                      onChange={(e) =>
                        updateItem(
                          i,
                          "precoUnitario",
                          moeda === "XOF"
                            ? toXofInteger(e.target.value)
                            : Number(e.target.value),
                        )
                      }
                      className="w-full rounded border border-border bg-background px-2 py-1 text-sm text-right outline-none font-mono"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-sm">
                    {formatMoney(roundMoney(item.quantidade * item.precoUnitario))}
                  </td>
                  <td className="px-2">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">{formatMoney(subtotal)} {moeda}</span>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <span className="text-muted-foreground">
                IGV (
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={igvPercentagem}
                  onChange={(e) => setIgvPercentagem(Number(e.target.value))}
                  className="w-10 rounded border border-border bg-background px-1 text-center text-xs outline-none inline"
                />
                %)
              </span>
              <span className="font-mono">{formatMoney(igvValor)} {moeda}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1 font-semibold">
              <span>TOTAL</span>
              <span className="font-mono">{formatMoney(total)} {moeda}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Forma de pagamento</label>
          <input
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Observações</label>
          <textarea
            rows={2}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={submit} disabled={pending}>
          {pending ? "A guardar…" : "Guardar como Rascunho"}
        </Button>
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
