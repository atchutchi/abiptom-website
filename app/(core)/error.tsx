"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Ocorreu um erro</h1>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
