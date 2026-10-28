import { redirect } from "next/navigation";
import { dbAdmin } from "@/core/lib/db";
import { users, clients, servicesCatalog } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { Header } from "@/core/components/layout/Header";
import ProjectForm from "@/core/components/forms/ProjectForm";
import { getCurrentUser } from "@/core/lib/auth/actions";

export const metadata = { title: "Novo Projecto - ABIPTOM Core" };

export default async function NewProjectPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");
  if (!dbUser || !["ca", "dg", "coord"].includes(dbUser.role)) {
    redirect("/admin/dashboard");
  }

  const [allClients, allUsers, allServices] = await Promise.all([
    dbAdmin.query.clients.findMany({ where: eq(clients.activo, true), orderBy: (c, { asc }) => [asc(c.nome)] }),
    dbAdmin.query.users.findMany({ where: eq(users.activo, true), orderBy: (u, { asc }) => [asc(u.nomeCurto)] }),
    dbAdmin.query.servicesCatalog.findMany({ where: eq(servicesCatalog.activo, true), orderBy: (s, { asc }) => [asc(s.nome)] }),
  ]);

  return (
    <>
      <Header title="Novo Projecto" />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <ProjectForm
            clients={allClients}
            staffUsers={allUsers}
            services={allServices}
          />
        </div>
      </main>
    </>
  );
}
