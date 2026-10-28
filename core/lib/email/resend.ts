import { Resend } from "resend";
import { assertCoreDataAccess } from "@/core/lib/environment";
let instance: Resend | undefined;
export const resend = new Proxy({} as Resend, {
  get(_target, property) {
    assertCoreDataAccess();
    const client = instance ??= new Resend(process.env.RESEND_API_KEY);
    const value = Reflect.get(client, property);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
export const FROM_EMAIL = process.env.RESEND_FROM ?? "ABIPTOM SARL <info@abiptom.gw>";
