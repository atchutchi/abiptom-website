import { redirect } from "next/navigation";

export default function StaffChatRedirectPage() {
  redirect("/staff/me/messages");
}
