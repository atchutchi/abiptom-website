"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { upsertContact, deleteContact } from "@/core/lib/clients/actions";
import type { Contact } from "@/core/lib/db/schema";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react-core";

interface Props {
  clientId: string;
  contacts: Contact[];
}

interface ContactForm {
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  principal: boolean;
}

const empty: ContactForm = {
  nome: "",
  cargo: "",
  email: "",
  telefone: "",
  principal: false,
};

export default function ContactsSection({ clientId, contacts }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<ContactForm>(empty);
  const [pending, setPending] = useState(false);

  function startEdit(c: Contact) {
    setEditing(c.id);
    setAdding(false);
    setForm({
      nome: c.nome,
      cargo: c.cargo ?? "",
      email: c.email ?? "",
      telefone: c.telefone ?? "",
      principal: c.principal,
    });
  }

  function startAdd() {
    setAdding(true);
    setEditing(null);
    setForm(empty);
  }

  function cancel() {
    setEditing(null);
    setAdding(false);
    setForm(empty);
  }

  async function save() {
    setPending(true);
    try {
      await upsertContact(clientId, editing, form);
      cancel();
    } finally {
      setPending(false);
    }
  }

  async function remove(contactId: string) {
    if (!confirm("Eliminar este contacto?")) return;
    await deleteContact(clientId, contactId);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Contactos</h2>
        {!adding && (
          <Button size="sm" variant="secondary" onClick={startAdd}>
            <Plus className="size-4" /> Adicionar
          </Button>
        )}
      </div>

      {contacts.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">Nenhum contacto registado.</p>
      )}

      <div className="space-y-2">
        {contacts.map((c) =>
          editing === c.id ? (
            <ContactEditRow
              key={c.id}
              form={form}
              setForm={setForm}
              onSave={save}
              onCancel={cancel}
              pending={pending}
            />
          ) : (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{c.nome}</span>
                  {c.principal && (
                    <span className="text-xs bg-primary/10 text-primary rounded px-1.5 py-0.5">
                      Principal
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {[c.cargo, c.email, c.telefone].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="icon-sm" variant="ghost" onClick={() => startEdit(c)}>
                  <Edit2 className="size-3.5" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove(c.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          )
        )}

        {adding && (
          <ContactEditRow
            form={form}
            setForm={setForm}
            onSave={save}
            onCancel={cancel}
            pending={pending}
          />
        )}
      </div>
    </div>
  );
}

function ContactEditRow({
  form,
  setForm,
  onSave,
  onCancel,
  pending,
}: {
  form: ContactForm;
  setForm: (f: ContactForm) => void;
  onSave: () => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const field = (key: keyof ContactForm) => (
    <input
      value={form[key] as string}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      placeholder={key === "nome" ? "Nome *" : key.charAt(0).toUpperCase() + key.slice(1)}
      className="rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring/50 w-full"
    />
  );

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {field("nome")}
        {field("cargo")}
        {field("email")}
        {field("telefone")}
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={form.principal}
          onChange={(e) => setForm({ ...form, principal: e.target.checked })}
          className="rounded"
        />
        Contacto principal
      </label>
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} disabled={pending || !form.nome}>
          <Check className="size-3.5" /> Guardar
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={pending}>
          <X className="size-3.5" /> Cancelar
        </Button>
      </div>
    </div>
  );
}
