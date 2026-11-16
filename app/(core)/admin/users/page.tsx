import { UsersTable } from "@/core/components/users/UsersTable";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/core/components/layout/Header";
import { Button } from "@/core/components/ui/button";
import { Plus } from "lucide-react-core";
import { listUsers } from "@/core/lib/users/actions";
import { getCurrentUser } from "@/core/lib/auth/actions";

export const metadata = { title: "Utilizadores - ABIPTOM Core" };

export default async function UsersPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");

  if (!dbUser || (dbUser.role !== "ca" && dbUser.role !== "dg")) {
    redirect("/admin/dashboard");
  }

  const allUsers = await listUsers();

  return (
    <>
      <Header title="Utilizadores" />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{allUsers.length} utilizadores</p>
            <Link href="/admin/users/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Novo utilizador
              </Button>
            </Link>
          </div>

          <UsersTable users={allUsers} />
        </div>
      </main>
    </>
  );
}
