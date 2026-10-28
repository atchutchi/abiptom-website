"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Camera, Trash2 } from "lucide-react-core";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { getUserInitials } from "@/core/lib/users/avatar";
import { formatDate } from "@/core/lib/utils/format";
import type { ProfileFormData } from "@/core/lib/users/actions";
import type { User, UserRole } from "@/core/lib/db/schema";

const ROLE_LABELS: Record<UserRole, string> = {
  ca: "Conselho de Administração",
  dg: "Director Geral",
  coord: "Coordenação",
  staff: "Colaborador",
};

interface ProfileFormProps {
  user: User;
  avatarUrl?: string | null;
  homeHref: string;
  onSubmit: (
    data: ProfileFormData
  ) => Promise<{ error?: string; success?: boolean }>;
  onUploadAvatar: (
    formData: FormData
  ) => Promise<{ error?: string; success?: boolean }>;
  onRemoveAvatar: () => Promise<{ error?: string; success?: boolean }>;
}

export function ProfileForm({
  user,
  avatarUrl,
  homeHref,
  onSubmit,
  onUploadAvatar,
  onRemoveAvatar,
}: ProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const previewUrl = useMemo(() => {
    if (!selectedFile) return avatarUrl ?? null;
    return URL.createObjectURL(selectedFile);
  }, [avatarUrl, selectedFile]);
  const initials = getUserInitials(user.nomeCurto || user.nomeCompleto || user.email);

  useEffect(() => {
    if (!selectedFile || !previewUrl || previewUrl === avatarUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [avatarUrl, previewUrl, selectedFile]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const form = e.currentTarget;
    const result = await onSubmit({
      nomeCompleto: (form.elements.namedItem("nomeCompleto") as HTMLInputElement).value,
      nomeCurto: (form.elements.namedItem("nomeCurto") as HTMLInputElement).value,
      telefone:
        (form.elements.namedItem("telefone") as HTMLInputElement).value || undefined,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Perfil actualizado.");
      router.refresh();
    }

    setLoading(false);
  }

  async function handleAvatarUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("avatar") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError("Selecciona uma imagem para continuar.");
      return;
    }

    const data = new FormData();
    data.set("avatar", file);

    setAvatarLoading(true);
    const result = await onUploadAvatar(data);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Avatar actualizado.");
      setSelectedFile(null);
      form.reset();
      router.refresh();
    }

    setAvatarLoading(false);
  }

  async function handleRemoveAvatar() {
    setError("");
    setSuccess("");
    setAvatarLoading(true);

    const result = await onRemoveAvatar();
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Avatar removido.");
      setSelectedFile(null);
      router.refresh();
    }

    setAvatarLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-lg border bg-white p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">Informação pessoal</h2>
              <p className="text-sm text-gray-500">
                Actualiza o nome apresentado na aplicação e o teu contacto directo.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nomeCompleto">Nome completo</Label>
                <Input
                  id="nomeCompleto"
                  name="nomeCompleto"
                  defaultValue={user.nomeCompleto}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeCurto">Nome curto</Label>
                <Input
                  id="nomeCurto"
                  name="nomeCurto"
                  defaultValue={user.nomeCurto}
                  maxLength={50}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  defaultValue={user.telefone ?? ""}
                  placeholder="+245 955 000 000"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "A guardar..." : "Guardar alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(homeHref)}>
              Voltar
            </Button>
          </div>
        </form>

        <aside className="space-y-4">
          <section className="rounded-lg border bg-white p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">Fotografia</h2>
              <p className="text-sm text-gray-500">
                Usa uma imagem quadrada para melhor enquadramento no menu lateral.
              </p>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <Avatar size="lg" className="size-20">
                {previewUrl ? <AvatarImage src={previewUrl} alt={user.nomeCurto} /> : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <form onSubmit={handleAvatarUpload} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Nova fotografia</Label>
                    <Input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) =>
                        setSelectedFile(event.currentTarget.files?.[0] ?? null)
                      }
                    />
                    <p className="text-xs text-gray-500">
                      Formatos suportados: JPG, PNG e WebP. Máximo 2 MB.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" variant="outline" disabled={avatarLoading}>
                      <Camera className="mr-2 h-4 w-4" aria-hidden="true" />
                      {avatarLoading ? "A carregar..." : "Actualizar avatar"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={avatarLoading || (!avatarUrl && !selectedFile)}
                      onClick={handleRemoveAvatar}
                    >
                      <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                      Remover
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Conta</h2>
                <p className="text-sm text-gray-500">
                  Dados controlados pela administração.
                </p>
              </div>
              <Badge variant="secondary">{ROLE_LABELS[user.role] ?? user.role}</Badge>
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="mt-1 font-medium text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Cargo</dt>
                <dd className="mt-1 font-medium text-gray-900">
                  {user.cargo ?? "Sem cargo definido"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Data de entrada</dt>
                <dd className="mt-1 font-medium text-gray-900">
                  {user.dataEntrada ? formatDate(user.dataEntrada) : "Sem registo"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Segurança da conta
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Para alterar a palavra-passe usa o fluxo de recuperação por email.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/forgot-password">Alterar palavra-passe</Link>
            </Button>
          </section>
        </aside>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
    </div>
  );
}
