import { describe, expect, it } from "vitest";
import {
  getProjectArchiveUpdates,
  getProjectStatesForScope,
} from "@/core/lib/projects/archive";

describe("project archive helpers", () => {
  it("arquiva automaticamente quando o estado passa para concluido", () => {
    const now = new Date("2026-07-07T10:00:00.000Z");

    expect(getProjectArchiveUpdates("concluido", now)).toEqual({
      arquivadoEm: now,
    });
  });

  it("remove arquivo quando o projecto volta a proposta ou activo", () => {
    expect(getProjectArchiveUpdates("activo", new Date())).toEqual({
      arquivadoEm: null,
    });
  });

  it("mostra apenas proposta e activo por defeito", () => {
    expect(getProjectStatesForScope("activos")).toEqual(["proposta", "activo"]);
  });
});
