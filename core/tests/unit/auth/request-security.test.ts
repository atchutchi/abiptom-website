import { describe, expect, it } from "vitest";
import {
  getRequestIp,
  normalizeAuthEmail,
} from "@/core/lib/auth/request-security";

describe("getRequestIp", () => {
  it("usa apenas o primeiro endereço válido de x-forwarded-for", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.10, 10.0.0.2",
      "x-real-ip": "198.51.100.9",
    });

    expect(getRequestIp(headers)).toBe("203.0.113.10");
  });

  it("usa x-real-ip quando o primeiro endereço encaminhado é inválido", () => {
    const headers = new Headers({
      "x-forwarded-for": "desconhecido, 203.0.113.10",
      "x-real-ip": "2001:db8::1",
    });

    expect(getRequestIp(headers)).toBe("2001:db8::1");
  });

  it("devolve um identificador comum quando nenhum endereço é válido", () => {
    expect(getRequestIp(new Headers())).toBe("unknown");
  });
});

describe("normalizeAuthEmail", () => {
  it("remove espaços exteriores e normaliza maiúsculas", () => {
    expect(normalizeAuthEmail("  Pessoa@ABIPTOM.GW ")).toBe(
      "pessoa@abiptom.gw",
    );
  });
});
