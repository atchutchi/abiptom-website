"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/core/components/ui/button";
import { useRouter } from "next/navigation";

type ActionResult = { error?: string; success?: boolean; id?: string };

interface Share {
  userId: string;
  nomeCurto: string;
  percentagemQuota: string;
}

interface Props {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  activeShares: Share[];
}

export default function DividendPeriodForm({ action, activeShares }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      if (state.id) router.push(`/admin/dividends/${state.id}`);
      else router.push("/admin/dividends");
    }
  }, [state, router]);

  const totalPct = activeShares.reduce(
    (sum, s) => sum + Number(s.percentagemQuota),
    0
  );

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {state?.error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Ano *</label>
          <input
            type="number"
            name="ano"
            required
            min={2020}
            max={2100}
            defaultValue={new Date().getFullYear()}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Trimestre</label>
          <select
            name="trimestre"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            defaultValue=""
          >
            <option value="">Anual (sem trimestre)</option>
            <option value="1">T1</option>
            <option value="2">T2</option>
            <option value="3">T3</option>
            <option value="4">T4</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Base Calculada (XOF) *</label>
        <input
          type="text"
          name="baseCalculada"
          required
          placeholder="Ex: 5000000"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 tabular-nums"
        />
        <p className="text-xs text-gray-500">
          Valor a distribuir pelos sócios. Tipicamente margem líquida do
          período (facturação recebida menos despesas e salários).
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Notas</label>
        <textarea
          name="notas"
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      <div className="rounded-lg border bg-gray-50 p-4 space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Sócios activos ({activeShares.length})
        </p>
        {activeShares.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhum sócio activo. Crie quotas em Definições antes de prosseguir.
          </p>
        ) : (
          <>
            <ul className="space-y-1 text-sm">
              {activeShares.map((s) => (
                <li
                  key={s.userId}
                  className="flex items-center justify-between"
                >
                  <span>{s.nomeCurto}</span>
                  <span className="tabular-nums text-gray-600">
                    {Number(s.percentagemQuota).toFixed(2)}%
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t flex items-center justify-between text-sm font-medium">
              <span>Total</span>
              <span className="tabular-nums">{totalPct.toFixed(2)}%</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" disabled={pending || activeShares.length === 0}>
          {pending ? "A calcular..." : "Criar e calcular"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
