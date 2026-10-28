import { redirect } from "next/navigation";
import { Header } from "@/core/components/layout/Header";
import { UserForm } from "@/core/components/forms/UserForm";
import { createUser } from "@/core/lib/users/actions";
import { getCurrentUser } from "@/core/lib/auth/actions";

export const metadata = { title: "Novo utilizador - ABIPTOM Core" };

export default async function NewUserPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");

  if (!dbUser || (dbUser.role !== "ca" && dbUser.role !== "dg")) {
    redirect("/admin/dashboard");
  }

  return (
    <>
      <Header title="Novo utilizador" />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border p-6">
            <UserForm
              onSubmit={createUser}
              canEditDiscount={dbUser.role === "ca" || dbUser.role === "dg"}
            />
          </div>
        </div>
      </main>
    </>
  );
}
