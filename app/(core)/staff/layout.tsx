import { redirect } from "next/navigation";
import { Sidebar } from "@/core/components/layout/Sidebar";
import { PresenceHeartbeat } from "@/core/components/messages/PresenceHeartbeat";
import type { UserRole } from "@/core/lib/db/schema";
import { getAvatarUrl } from "@/core/lib/users/avatar";
import { getCurrentUser } from "@/core/lib/auth/actions";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");

  if (!dbUser) redirect("/login");

  const role = dbUser.role as UserRole;
  const avatarUrl = await getAvatarUrl(dbUser.fotografiaUrl);

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} userName={dbUser.nomeCurto} userAvatarUrl={avatarUrl} />
      <div className="flex-1 flex flex-col min-w-0">
        <PresenceHeartbeat />
        {children}
      </div>
    </div>
  );
}
