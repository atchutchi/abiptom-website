import { redirect } from "next/navigation";

export default function AdminChatRedirectPage() {
  redirect("/admin/messages");
}
