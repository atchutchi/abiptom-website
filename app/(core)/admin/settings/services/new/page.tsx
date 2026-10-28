import ServiceForm from "@/core/components/forms/ServiceForm";
import { createService } from "@/core/lib/services/actions";
import { Header } from "@/core/components/layout/Header";
import Link from "next/link";
import { ChevronLeft } from "lucide-react-core";

export const metadata = { title: "Novo Serviço - ABIPTOM Core" };

export default function NewServicePage() {
  return (
    <>
      <Header title="Novo Serviço" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <Link
              href="/admin/settings/services"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Catálogo de Serviços
            </Link>
            <h1 className="mt-2 text-2xl font-semibold">Novo Serviço</h1>
            <p className="text-sm text-muted-foreground">
              Adicionar um serviço ao catálogo.
            </p>
          </div>
          <ServiceForm action={createService} submitLabel="Criar serviço" />
        </div>
      </main>
    </>
  );
}
