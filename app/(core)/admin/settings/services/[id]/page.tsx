import { dbAdmin } from "@/core/lib/db";
import { servicesCatalog } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ServiceForm from "@/core/components/forms/ServiceForm";
import { updateService, toggleServiceActive } from "@/core/lib/services/actions";
import { Button } from "@/core/components/ui/button";
import { Header } from "@/core/components/layout/Header";
import Link from "next/link";
import { ChevronLeft } from "lucide-react-core";
import { getCurrentUser } from "@/core/lib/auth/actions";

export const metadata = { title: "Editar Serviço - ABIPTOM Core" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ dbUser }, service] = await Promise.all([
    getCurrentUser(),
    dbAdmin.query.servicesCatalog.findFirst({
      where: eq(servicesCatalog.id, id),
    }),
  ]);

  if (!service) notFound();

  const action = updateService.bind(null, id);
  const canToggleActive = dbUser?.role === "ca";
  const toggle = async () => {
    "use server";
    await toggleServiceActive(id, !service.activo);
  };

  return (
    <>
      <Header title="Editar Serviço" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <Link
              href="/admin/settings/services"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Catálogo de Serviços
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Editar Serviço</h1>
              <p className="text-sm text-muted-foreground">{service.categoria} · {service.nome}</p>
            </div>
            {canToggleActive && (
              <form action={toggle}>
                <Button type="submit" variant={service.activo ? "outline" : "default"}>
                  {service.activo ? "Desactivar" : "Reactivar"}
                </Button>
              </form>
            )}
          </div>
          <ServiceForm service={service} action={action} submitLabel="Actualizar" />
        </div>
      </main>
    </>
  );
}
