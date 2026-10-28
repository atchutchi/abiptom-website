"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

interface TaskFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string; success?: boolean; id?: string }>;
  submitLabel?: string;
  task?: {
    id: string;
    titulo: string;
    descricao: string | null;
    atribuidaA: string;
    projectoId: string | null;
    clienteId: string | null;
    deliverableId: string | null;
    executionWeight: string;
    prazo: string | null;
    prioridade: "baixa" | "media" | "alta";
    estado:
      | "pendente"
      | "em_curso"
      | "submetida"
      | "aprovada"
      | "precisa_correcao"
      | "rejeitada"
      | "concluida"
      | "cancelada";
  };
  users: Array<{ id: string; nomeCurto: string; role: string }>;
  projects: Array<{ id: string; titulo: string }>;
  clients: Array<{ id: string; nome: string }>;
  deliverables: Array<{
    id: string;
    projectId: string;
    titulo: string;
    peso: string;
    project?: { titulo: string };
  }>;
}

export default function TaskForm({
  action,
  submitLabel = "Guardar",
  task,
  users,
  projects,
  clients,
  deliverables,
}: TaskFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState(task?.projectoId ?? "");

  const visibleDeliverables = useMemo(
    () =>
      selectedProject
        ? deliverables.filter((deliverable) => deliverable.projectId === selectedProject)
        : deliverables,
    [deliverables, selectedProject]
  );

  useEffect(() => {
    if (!state?.success) return;

    if (state.id) {
      router.push(`/admin/tasks/${state.id}`);
      return;
    }

    if (task?.id) {
      router.push(`/admin/tasks/${task.id}`);
      router.refresh();
      return;
    }

    router.push("/admin/tasks");
  }, [state, router, task?.id]);

  return (
    <form action={formAction} className="max-w-3xl space-y-5">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Título *</label>
        <input
          name="titulo"
          required
          defaultValue={task?.titulo ?? ""}
          placeholder="Ex.: Preparar proposta para cliente X"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Descrição</label>
        <textarea
          name="descricao"
          defaultValue={task?.descricao ?? ""}
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Atribuída a *</label>
          <select
            name="atribuidaA"
            required
            defaultValue={task?.atribuidaA ?? ""}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">Selecionar colaborador</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nomeCurto} ({u.role.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Prazo</label>
          <input
            name="prazo"
            type="date"
            defaultValue={task?.prazo ?? ""}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Projecto</label>
          <select
            name="projectoId"
            defaultValue={task?.projectoId ?? ""}
            onChange={(event) => setSelectedProject(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">Sem projecto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Cliente</label>
          <select
            name="clienteId"
            defaultValue={task?.clienteId ?? ""}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">Sem cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Entregável</label>
          <select
            name="deliverableId"
            defaultValue={task?.deliverableId ?? ""}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">Sem entregável</option>
            {visibleDeliverables.map((deliverable) => (
              <option key={deliverable.id} value={deliverable.id}>
                {deliverable.titulo}
                {!selectedProject && deliverable.project?.titulo
                  ? ` · ${deliverable.project.titulo}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Peso na execução</label>
          <input
            name="executionWeight"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={task?.executionWeight ?? "1"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Prioridade</label>
          <select
            name="prioridade"
            defaultValue={task?.prioridade ?? "media"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Estado</label>
          <select
            name="estado"
            defaultValue={task?.estado ?? "pendente"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="pendente">Pendente</option>
            <option value="em_curso">Em curso</option>
            <option value="submetida">Submetida</option>
            <option value="aprovada">Aprovada</option>
            <option value="precisa_correcao">Precisa correcção</option>
            <option value="rejeitada">Rejeitada</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "A guardar..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
