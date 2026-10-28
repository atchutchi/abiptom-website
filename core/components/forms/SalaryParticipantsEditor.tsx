"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react-core";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { updateParticipant } from "@/core/lib/salary/actions";
import { toXofInteger } from "@/core/lib/utils/money";

type ParticipantRow = {
  id: string;
  userId: string;
  isElegivelSubsidio: boolean;
  recebeRubricaGestao: boolean;
  salarioBaseOverride: string | null;
  user: {
    nomeCurto: string;
    nomeCompleto: string;
    role: string;
    salarioBaseMensal: string | null;
  };
};

interface SalaryParticipantsEditorProps {
  periodId: string;
  participants: ParticipantRow[];
  editable: boolean;
}

export function SalaryParticipantsEditor({
  periodId,
  participants,
  editable,
}: SalaryParticipantsEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [rows, setRows] = useState(
    participants.map((participant) => ({
      ...participant,
      salarioBaseOverride:
        participant.salarioBaseOverride !== null
          ? String(participant.salarioBaseOverride)
          : "",
    })),
  );

  const hasChanges = useMemo(
    () =>
      rows.some((row, index) => {
        const original = participants[index];
        return (
          row.isElegivelSubsidio !== original.isElegivelSubsidio ||
          row.recebeRubricaGestao !== original.recebeRubricaGestao ||
          row.salarioBaseOverride !==
            (original.salarioBaseOverride !== null
              ? String(original.salarioBaseOverride)
              : "")
        );
      }),
    [participants, rows],
  );

  function setRubricaBeneficiario(targetId: string) {
    setRows((current) =>
      current.map((row) => ({
        ...row,
        recebeRubricaGestao: row.id === targetId,
      })),
    );
  }

  function setOverrideValue(targetId: string, value: string) {
    setRows((current) =>
      current.map((row) =>
        row.id === targetId ? { ...row, salarioBaseOverride: value } : row,
      ),
    );
  }

  async function handleSaveAll() {
    setError("");
    startTransition(async () => {
      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const original = participants[index];
        const nextOverride = row.salarioBaseOverride.trim();
        const originalOverride =
          original.salarioBaseOverride !== null
            ? String(original.salarioBaseOverride)
            : "";

        const changed =
          row.isElegivelSubsidio !== original.isElegivelSubsidio ||
          row.recebeRubricaGestao !== original.recebeRubricaGestao ||
          nextOverride !== originalOverride;

        if (!changed) continue;

        const result = await updateParticipant(row.id, {
          isElegivelSubsidio: row.isElegivelSubsidio,
          recebeRubricaGestao: row.recebeRubricaGestao,
          salarioBaseOverride:
            nextOverride === "" ? null : toXofInteger(nextOverride),
        });

        if ("error" in result) {
          setError(result.error ?? "Erro ao actualizar participantes");
          return;
        }
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-[760px] w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Nome</th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">Elegivel 22%</th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">Rubrica gestao</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Base do perfil</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Salário base do período</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{row.user.nomeCurto}</p>
                  <p className="text-xs uppercase text-gray-400">{row.user.role}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={row.isElegivelSubsidio}
                    disabled={!editable || isPending}
                    onChange={(event) =>
                      setRows((current) =>
                        current.map((item) =>
                          item.id === row.id
                            ? { ...item, isElegivelSubsidio: event.target.checked }
                            : item,
                        ),
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="radio"
                    name={`rubrica-${periodId}`}
                    checked={row.recebeRubricaGestao}
                    disabled={!editable || isPending}
                    onChange={() => setRubricaBeneficiario(row.id)}
                    className="h-4 w-4 border-gray-300 text-blue-600"
                  />
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-500">
                  {Number(row.user.salarioBaseMensal ?? 0).toLocaleString("pt-PT")} XOF
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={row.salarioBaseOverride}
                    disabled={!editable || isPending}
                    onChange={(event) => setOverrideValue(row.id, event.target.value)}
                    className="ml-auto max-w-[180px] text-right"
                    placeholder="usar perfil"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {editable && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            Este campo só corrige o salário base do período. Outros benefícios vêm de despesas com beneficiário. Guardar participantes limpa o cálculo actual e volta o período para aberto.
          </p>
          <Button onClick={handleSaveAll} disabled={isPending || !hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "A guardar..." : "Guardar participantes"}
          </Button>
        </div>
      )}
    </div>
  );
}
