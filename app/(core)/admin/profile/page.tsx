import { redirect } from "next/navigation";
import { Header } from "@/core/components/layout/Header";
import { ProfileForm } from "@/core/components/forms/ProfileForm";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { getDefaultRoute } from "@/core/lib/auth/rbac";
import { getAvatarUrl } from "@/core/lib/users/avatar";
import {
  removeMyAvatar,
  updateMyProfile,
  uploadMyAvatar,
} from "@/core/lib/users/actions";

export const metadata = { title: "Meu perfil - ABIPTOM Core" };

export default async function AdminProfilePage() {
  const { user, dbUser } = await getCurrentUser();

  if (!user || !dbUser) {
    redirect("/login");
  }

  if (dbUser.role === "staff") {
    redirect("/staff/me/profile");
  }

  const avatarUrl = await getAvatarUrl(dbUser.fotografiaUrl);

  return (
    <>
      <Header title="Meu perfil" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <ProfileForm
            user={dbUser}
            avatarUrl={avatarUrl}
            homeHref={getDefaultRoute(dbUser.role)}
            onSubmit={updateMyProfile}
            onUploadAvatar={uploadMyAvatar}
            onRemoveAvatar={removeMyAvatar}
          />
        </div>
      </main>
    </>
  );
}
