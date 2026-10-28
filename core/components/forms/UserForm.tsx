"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import type { UserFormData } from "@/core/lib/users/actions";
import type { User } from "@/core/lib/db/schema";

interface UserFormProps {
  defaultValues?: Partial<User>;
  onSubmit: (data: UserFormData) => Promise<{ error?: string; success?: boolean }>;
  isEdit?: boolean;
  canEditDiscount?: boolean;
}

export function UserForm({
  defaultValues,
  onSubmit,
  isEdit = false,
  canEditDiscount = false,
}: UserFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data: UserFormData = {
      nomeCompleto: (form.elements.namedItem("nomeCompleto") as HTMLInputElement).value,
      nomeCurto: (form.elements.namedItem("nomeCurto") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      telefone: (form.elements.namedItem("telefone") as HTMLInputElement).value || undefined,
      role: (form.elements.namedItem("role") as HTMLSelectElement).value as UserFormData["role"],
      cargo: (form.elements.namedItem("cargo") as HTMLInputElement).value || undefined,
      salarioBaseMensal: (form.elements.namedItem("salarioBaseMensal") as HTMLInputElement).value || undefined,
      dataEntrada: (form.elements.namedItem("dataEntrada") as HTMLInputElement).value || undefined,
      percentagemDescontoFolha:
        (form.elements.namedItem("percentagemDescontoFolha") as HTMLInputElement).value ||
        undefined,
      elegivelSubsidioDinamicoDefault: (
        form.elements.namedItem("elegivelSubsidioDinamicoDefault") as HTMLInputElement
      ).checked,
    };

    try {
      const result = await onSubmit(data);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/users");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nomeCompleto">Nome completo *</Label>
          <Input
            id="nomeCompleto"
            name="nomeCompleto"
            defaultValue={defaultValues?.nomeCompleto}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nomeCurto">Nome curto *</Label>
          <Input
            id="nomeCurto"
            name="nomeCurto"
            defaultValue={defaultValues?.nomeCurto}
            maxLength={50}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email}
            disabled={isEdit}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            name="telefone"
            type="tel"
            defaultValue={defaultValues?.telefone ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Papel *</Label>
          <select
            id="role"
            name="role"
            defaultValue={defaultValues?.role ?? "staff"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="ca">Conselho de Administração</option>
            <option value="dg">Director Geral</option>
            <option value="coord">Coordenação</option>
            <option value="staff">Colaborador</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cargo">Cargo</Label>
          <Input
            id="cargo"
            name="cargo"
            defaultValue={defaultValues?.cargo ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salarioBaseMensal">Salário base mensal (XOF)</Label>
          <Input
            id="salarioBaseMensal"
            name="salarioBaseMensal"
            type="number"
            min="0"
            step="1"
            defaultValue={defaultValues?.salarioBaseMensal?.toString() ?? "0"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="percentagemDescontoFolha">Desconto sobre folha (%)</Label>
          <Input
            id="percentagemDescontoFolha"
            name="percentagemDescontoFolha"
            type="number"
            min="0"
            max="100"
            step="0.01"
            defaultValue={
              defaultValues?.percentagemDescontoFolha !== undefined
                ? (Number(defaultValues.percentagemDescontoFolha) * 100).toFixed(2)
                : "0.00"
            }
            disabled={!canEditDiscount}
          />
          <p className="text-xs text-muted-foreground">
            Percentagem aplicada ao total bruto da folha antes de produzir o valor líquido. Usa 0 para sem desconto.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataEntrada">Data de entrada</Label>
          <Input
            id="dataEntrada"
            name="dataEntrada"
            type="date"
            defaultValue={defaultValues?.dataEntrada ?? ""}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <label className="flex items-start gap-3">
          <input
            id="elegivelSubsidioDinamicoDefault"
            name="elegivelSubsidioDinamicoDefault"
            type="checkbox"
            defaultChecked={defaultValues?.elegivelSubsidioDinamicoDefault ?? true}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span className="space-y-1">
            <span className="block text-sm font-medium">
              Elegível a subsídios dinâmicos por defeito
            </span>
            <span className="block text-xs text-muted-foreground">
              Controla se esta pessoa aparece marcada como elegível ao criar um novo período de folha. Pode ser alterado depois no próprio período.
            </span>
          </span>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "A guardar..." : isEdit ? "Guardar alterações" : "Criar utilizador"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/users")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
