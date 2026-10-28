import { describe, expect, it } from "vitest";
import {
  assertSafeRestoreFile,
  assertSafeRestoreTarget,
  redactDatabaseUrl,
} from "@/core/lib/backup/restore-safety";

describe("assertSafeRestoreTarget", () => {
  it("recusa restaurar sobre qualquer ligação usada pela aplicação", () => {
    expect(() =>
      assertSafeRestoreTarget({
        restoreUrl: "postgresql://user:secret@db.example.com:5432/prod",
        runtimeUrl: "postgresql://user:secret@db.example.com:5432/prod",
      }),
    ).toThrow("A base de restauro tem de ser isolada");

    expect(() =>
      assertSafeRestoreTarget({
        restoreUrl: "postgresql://user:secret@db.example.com:5432/prod",
        directUrl: "postgresql://user:other@db.example.com:5432/prod",
      }),
    ).toThrow("A base de restauro tem de ser isolada");
  });

  it("aceita uma base com nome explicitamente isolado", () => {
    expect(() =>
      assertSafeRestoreTarget({
        restoreUrl:
          "postgresql://user:secret@localhost:5432/abiptom_restore_verify",
        runtimeUrl: "postgresql://user:secret@db.example.com:5432/prod",
      }),
    ).not.toThrow();
  });
});

describe("assertSafeRestoreFile", () => {
  it("recusa um ficheiro vazio", () => {
    expect(() => assertSafeRestoreFile("C:/backups/empty.sql", 0)).toThrow(
      "O dump está vazio",
    );
  });
});

describe("redactDatabaseUrl", () => {
  it("remove credenciais antes de apresentar a ligação", () => {
    expect(
      redactDatabaseUrl("postgresql://user:secret@localhost:5432/restore"),
    ).toBe("postgresql://localhost:5432/restore");
  });
});
